/*
 * UBC CPSC 314, Vjan2019
 * Assignment 1 Template
 */

// CHECK WEBGL VERSION
if (WEBGL.isWebGL2Available() === false) {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}

// SETUP RENDERER & SCENE
var container = document.getElementById("glCanvas");
console.log(container);
console.log(container.offsetHeight);
console.log(container.offsetWidth);

var canvas = document.createElement("canvas");

var context = canvas.getContext('webgl2');
var renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
renderer.setClearColor(0XAFEEEE); // green background colour
container.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(100, 50, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
// TODO: restrict to linear-ish view (no upside down)
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize', resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
  window.scrollTo(0, 0);
}

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5);
scene.add(worldFrame);

var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
let altFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x6C6C6C, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(60, 60);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

let stitch_height = 1;
let stitch_width = 1;
let width = 41;
let height = 41;

new THREE.SourceLoader().load("bitmaps/circle.bitmap", str => {
  console.log(str);
});
function generateStripedTexture(colourBitmap) {
  let flatColourBitmap = colourBitmap.flat();
  console.log(colourBitmap);

  color1 = new THREE.Color(0xafafaf);
  color2 = new THREE.Color(0x3f3f3f);

  var size = width * height;
  var pixelData = new Uint8Array(3 * size);
  for (var i = 0, len = size; i < len; i++) {
    var i3 = i * 3;
    var color = flatColourBitmap[i] ? color1 : color2;
    // if(i >= 8) color = (color === color1) ? color2 : color1;
    pixelData[i3] = 255 * color.r;
    pixelData[i3 + 1] = 255 * color.g;
    pixelData[i3 + 2] = 255 * color.b;
  };
  var format = THREE.RGBFormat,
    type = THREE.UnsignedByteType;

  let colourMap = new THREE.DataTexture(pixelData, width, height, format, type);
  colourMap.wrapS = THREE.ClampToEdgeWrapping;
  colourMap.wrapT = THREE.ClampToEdgeWrapping;
  colourMap.needsUpdate = true;
  console.log(colourMap);
  // idea: make a box with the given dimensions 
  return colourMap;
}

let raised_y = 0.5;

let max_y = stitch_height * height;
let max_x = stitch_width * width;

// generate our own geometry for the box
// TODO: this is supposed to be deprecated in newest three.js
// take the vector of bitmaps
// if 0, add a regular bottom face
// if 1, raise it by making new vertices at box corners and at some z-level and make a face that connects
let raised_vertices = [];
function generateRaisedMesh(bitmap) {
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
      let c2 = 2 * (across * (h + 1) + w);
      let c3 = 2 * (across * h + w + 1);
      let c4 = 2 * (across * (h + 1) + w + 1);

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
        geom.faces.push(new THREE.Face3(c1, r_c3, c3));
        geom.faces.push(new THREE.Face3(c1, r_c1, r_c3));
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
  return geom;
}

// UNIFORMS
var knitPosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
var lightSource = { type: 'v3', value: new THREE.Vector3(0.0, 20.0, 1.0) };

var lightColor = new THREE.Color(1.0, 1.0, 1.0);
//   var lightDirection = new THREE.Vector3(0.49,0.79, 0.49);
var lightDirection = new THREE.Vector3(0.0, 1, 0.0);

var lightColorUniform = { type: "c", value: lightColor };
var lightDirectionUniform = { type: "v3", value: lightDirection };

// Material properties
var kAmbient = 0.8;
var kDiffuse = 0.2;
var kAmbientUniform = { type: "f", value: kAmbient };
var kDiffuseUniform = { type: "f", value: kDiffuse };

let x_range = max_x; // assuming we start at zero
let z_range = max_y; // assuming we start at zero
let xRangeUniform = { type: "f", value: x_range };
let zRangeUniform = { type: "f", value: z_range };

let colourBitmap = [...Array(height).keys()].map(x => (x % 2 == 0) ? [...Array(width)].map(f => true) : [...Array(width)].map(f => false));
let colourMap = generateStripedTexture(colourBitmap);

// MATERIALS: specifying uniforms and shaders
var knitMaterial = new THREE.ShaderMaterial({
  uniforms: {
    knitPosition: knitPosition,
    lightSource: lightSource,
    colourMap: { type: "t", value: colourMap },

    lightColor: lightColorUniform,
    lightDirection: lightDirectionUniform,
    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    xRange: xRangeUniform,
    zRange: zRangeUniform,
  },
});


let bitmap = [...Array(height)].map(x => [...Array(width)].map(f => false));
bitmap[10][5] = true;
bitmap[11][5] = true;
bitmap[10][6] = true;
bitmap[8][2] = true;
bitmap[11][3] = true;

console.log(bitmap);
let geom = generateRaisedMesh(bitmap);

// LOAD SHADERS
var shaderFiles = [
  'glsl/vertex.glsl',
  'glsl/fragment.glsl',
];

let cube;
new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  knitMaterial.vertexShader = shaders['glsl/vertex.glsl'];
  knitMaterial.fragmentShader = shaders['glsl/fragment.glsl'];


  cube = new THREE.Mesh(geom, knitMaterial);
  //   const cube = new THREE.Mesh( geom, material );
  cube.position.set(0, 0, 0);
  cube.parent = worldFrame;
  scene.add(cube);


  const circ = new THREE.SphereGeometry(15, 32, 16);
  const circle = new THREE.Mesh(circ, new THREE.MeshPhongMaterial({
    // color: 0x6C6C6C
    map: colourMap,
  }));
  // //   const cube = new THREE.Mesh( geom, material );
  // circle.position.set(0,20,0);
  // circle.parent = worldFrame;
  //   scene.add( circle ); 

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

  scene.add(directionalLight);
  const light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(50, 50, 50);
  scene.add(light);
  console.log(light);

  update();


  
  newBitmap = getCircle();
  // newBitmap[5][8] = true;
  replaceMesh(newBitmap);
  //   
});

console.log("Finished defining shaders");

//   const geom = new THREE.BoxGeometry( stitch_width * width, 1, stitch_height * height );

function update() {
  // checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

function replaceMesh(newBitmap) {
  console.log(cube);
  cube.geometry = generateRaisedMesh(newBitmap);
  cube.needsUpdate = true;
}

function replaceTexture(newBitmap) {
  console.log(cube);
  cube.material.uniforms.colourMap = generateStripedTexture(newBitmap);
  cube.needsUpdate = true;
}

function getCircle() {
  let bitmap = `11111111111111111111111111111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111
00000000000000000111111100000000000000000
11111111111111111000000011111111111111111
00000000000001111111111111110000000000000
11111111111110000000000000001111111111111
00000000000111111111111111111100000000000
11111111111000000000000000000011111111111
00000000011111111111111111111111000000000
11111111100000000000000000000000111111111
00000000111111111111111111111111100000000
11111111000000000000000000000000011111111
00000001111111111111111111111111110000000
11111110000000000000000000000000001111111
00000001111111111111111111111111110000000
11111110000000000000000000000000001111111
00000001111111111111111111111111110000000
11111110000000000000000000000000001111111
00000001111111111111111111111111110000000
11111110000000000000000000000000001111111
00000000111111111111111111111111100000000
11111111000000000000000000000000011111111
00000000011111111111111111111111000000000
11111111100000000000000000000000111111111
00000000000111111111111111111100000000000
11111111111000000000000000000011111111111
00000000000001111111111111110000000000000
11111111111110000000000000001111111111111
00000000000000000111111100000000000000000
11111111111111111000000011111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111
00000000000000000000000000000000000000000
11111111111111111111111111111111111111111`
let lines = bitmap.split("\n");
let map = lines.map(str => str.split("").map(v => v == "0" ? false : true));
console.log(lines);
console.log(map);
return map;
}


update();


