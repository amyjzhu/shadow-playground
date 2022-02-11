/*
 * UBC CPSC 314, Vjan2019
 * Assignment 1 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
  }
  
  // SETUP RENDERER & SCENE
  var container = document.getElementById("glCanvas");
  console.log(container);
  console.log(container.offsetHeight);
  console.log(container.offsetWidth);
  
  var canvas = document.createElement("canvas");
  
  var context = canvas.getContext( 'webgl2' );
  var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
  renderer.setClearColor(0XAFEEEE); // green background colour
  container.appendChild( renderer.domElement );
  var scene = new THREE.Scene();
  
  // SETUP CAMERA
  var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
  camera.position.set(100,50,40);
  camera.lookAt(scene.position);
  scene.add(camera);
  
  // SETUP ORBIT CONTROLS OF THE CAMERA
  // TODO: restrict to linear-ish view (no upside down)
  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.autoRotate = false;
  
  // ADAPT TO WINDOW RESIZE
  function resize() {
    renderer.setSize(container.offsetWidth,container.offsetHeight);
    camera.aspect = container.offsetWidth/container.offsetHeight;
    camera.updateProjectionMatrix();
  }
  
  // EVENT LISTENER RESIZE
  window.addEventListener('resize',resize);
  resize();
  
  //SCROLLBAR FUNCTION DISABLE
  window.onscroll = function () {
       window.scrollTo(0,0);
     }
  
  // WORLD COORDINATE FRAME: other objects are defined with respect to it
  var worldFrame = new THREE.AxesHelper(5) ;
  scene.add(worldFrame);

  var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(2, 2);
  
  var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneBufferGeometry(60, 60);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.1;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  floor.parent = worldFrame;
  

  // idea: make a box with the given dimensions 

  let stitch_height = 1.5;
  let stitch_width = 1;
  let width = 10;
  let height = 20;
  let raised_y = 1;
  let bitmap = [...Array(height)].map(x => [...Array(width)].map(f => false));
  bitmap[10][5] = true;

  console.log(bitmap);

  // generate our own geometry for the box
  // TODO: this is supposed to be deprecated in newest three.js
  // take the vector of bitmaps
  // if 0, add a regular bottom face
  // if 1, raise it by making new vertices at box corners and at some z-level and make a face that connects
  let raised_vertices = [];

  let geom = new THREE.Geometry();
  // start by making a bunch of vertices.
  for (let h = 0; h <= height; h++) {
      for (let w = 0; w <= width; w++) {
          let z = h * stitch_height;
          let x = w * stitch_width;
          geom.vertices.push(new THREE.Vector3(x, 0, z));
          geom.vertices.push(new THREE.Vector3(x, raised_y, z));
        //   raised_vertices.push(new THREE.Vector3(x, raised_y, z));
      }
  }

  // now connect the faces
  for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
          // TODO just duplicating faces now, there's definitely a more optimal way
          let across = width + 1;
          // do I need to index from ALL vertices? 
          let c1 = 2 * (across * h + w);
          let c2 = 2 * (across * (h+1) + w);
          let c3 = 2 * (across * h + w + 1);
          let c4 = 2 * (across * (h+1) + w + 1);

          if (bitmap[h][w]) {
           console.log('true at ' + h + ' ' + w);
           // take those raised ones and make some faces
           // top face
            let r_c1 = c1 + 1;
            let r_c2 = c2 + 1;
            let r_c3 = c3 + 1;
            let r_c4 = c4 + 1;
            // top face
            geom.faces.push(new THREE.Face3(r_c1, r_c2, r_c4));
            geom.faces.push(new THREE.Face3(r_c1, r_c4, r_c3));  
            // south face 
            geom.faces.push(new THREE.Face3(c1, c3, r_c3));
            geom.faces.push(new THREE.Face3(c1, r_c3, r_c3));
            // east face
            geom.faces.push(new THREE.Face3(r_c3, c4, c3));
            geom.faces.push(new THREE.Face3(r_c4, c4, r_c3));
            // west face
            geom.faces.push(new THREE.Face3(c1, c2, r_c2));
            geom.faces.push(new THREE.Face3(r_c1, c1, r_c2));
            // north face
            geom.faces.push(new THREE.Face3(c2, c4, r_c4));
            geom.faces.push(new THREE.Face3(r_c2, c2, r_c4));
          } else {  
              // we're just a flat layer!
            geom.faces.push(new THREE.Face3(c1, c2, c4));
            geom.faces.push(new THREE.Face3(c1, c4, c3)); 
          }
        // we have four vertices: h, w, h+1, w+1
           
      }
  }

  add_depth = false;
  if (add_depth) {
  // we need to add the sides of the thing.
    let min_x = 0;
    let min_y = 0;
    let sw = 0;
    let se = width + 1;
    let nw = height + 1;
    let ne = (width + 1) * (height + 1);

    let max_y = stitch_height * height;
    let max_x = stitch_width * width;
    let z_below = -5;
    
    let c1l = new THREE.Vector3(min_x, z_below, min_y);
    let c2l = new THREE.Vector3(max_x, z_below, min_y);
    let c3l = new THREE.Vector3(min_x, z_below, max_y);
    let c4l = new THREE.Vector3(max_x, z_below, max_y);
    let base = geom.vertices.length;

    let lsw = base;
    let lse = base + 1;
    let lnw = base + 2;
    let lne = base + 3;
    
    console.log(min_x + " " + min_y + " " + max_x + " " + max_y);
    console.log(geom.vertices.length);

    geom.vertices.push(c1l);
    geom.vertices.push(c2l);
    geom.vertices.push(c3l);
    geom.vertices.push(c4l);
//     geom.vertices.push([sw, nw, se, ne, swl, nwl, nel, sel]);

//   below face
//     geom.faces.push(new THREE.Face3(lsw, lse, lnw));
//     geom.faces.push(new THREE.Face3(lse, lnw, lne));
    // south side
    geom.faces.push(new THREE.Face3(sw, se, lsw));
    geom.faces.push(new THREE.Face3(sw, lsw, lse));
    // west side
    geom.faces.push(new THREE.Face3(sw, nw, lsw));
    geom.faces.push(new THREE.Face3(sw, lsw, lnw));
    // east side
    geom.faces.push(new THREE.Face3(se, ne, lse));
    geom.faces.push(new THREE.Face3(se, lse, lne));
    // north side
    geom.faces.push(new THREE.Face3(nw, ne, lnw));
    geom.faces.push(new THREE.Face3(ne, lnw, lne));
  }

  geom.computeFaceNormals();
  console.log(geom);

  
  // UNIFORMS
  var knitPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
  var lightSource = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
    
  // MATERIALS: specifying uniforms and shaders
  var knitMaterial = new THREE.ShaderMaterial({
    uniforms: { 
        knitPosition: knitPosition,
        lightSource: lightSource,
    }
  });

  
  
  // LOAD SHADERS
  var shaderFiles = [
    'glsl/vertex.glsl',
    'glsl/fragment.glsl',
  ];
  
  new THREE.SourceLoader().load(shaderFiles, function(shaders) {
    knitMaterial.vertexShader = shaders['glsl/vertex.glsl'];
    knitMaterial.fragmentShader = shaders['glsl/fragment.glsl'];
    

    const cube = new THREE.Mesh( geom, knitMaterial );
    //   const cube = new THREE.Mesh( geom, material );
    cube.position.set(0,0,0);
    cube.parent = worldFrame;
    scene.add( cube );


    // const circ = new THREE.SphereGeometry(15, 32, 16);
    // const circle = new THREE.Mesh( circ, knitMaterial );
    // //   const cube = new THREE.Mesh( geom, material );
    // circle.position.set(0,20,0);
    // circle.parent = worldFrame;
    //   scene.add( circle );
    
      update();
//   
  });

  console.log("Finished defining shaders");
  
//   const geom = new THREE.BoxGeometry( stitch_width * width, 1, stitch_height * height );

  function update() {
    // checkKeyboard();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  
  update();
  
  