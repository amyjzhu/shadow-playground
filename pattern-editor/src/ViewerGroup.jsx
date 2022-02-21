import Viewer from "./Viewer";

export default function ViewerGroup(props) {
  const { pattern } = props;

  return (
    <div>
      {/* <div id="viewer">
          <Viewer
            style={{
              margin: 0,
              height: "50vh",
              width: "40vw",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
            allowControls={true}
          />
        </div> */}
      <div id="row1" style={{ display: "flex" }}>
        <div id="west-viewer">
          <Viewer
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              // float: "right",
            }}
            pattern={pattern}
            allowControls={true}
            cameraPosn={[0, 20, 20]}
            title="West"
          />
        </div>
        <div id="east-viewer">
          <Viewer
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
            allowControls={true}
            //   todo: should really be related to width/height
            cameraPosn={[0, 20, -20]}
            title="East"
          />
        </div>
      </div>
      <div id="row1" style={{ display: "flex" }}>
        <div id="north-viewer">
          <Viewer
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              // float: "right",
            }}
            pattern={pattern}
            allowControls={true}
            cameraPosn={[30, 20, 0]}
            title="North"
          />
        </div>
        <div id="south-viewer">
          <Viewer
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
            allowControls={true}
            cameraPosn={[-30, 20, 0]}
            title="South"
          />
        </div>
      </div>
    </div>
  );
}
