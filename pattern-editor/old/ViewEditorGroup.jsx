import ViewEditor from "./ViewEditor";

export default function ViewerGroup(props) {
  const { pattern, updatePixelSpecific, selectedColor } = props;

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
          <ViewEditor
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              // float: "right",
            }}
            pattern={pattern}
            updatePixelSpecific={updatePixelSpecific}
            selectedColour={selectedColor}
            direction={1}
            title="West"
          />
        </div>
        <div id="east-viewer">
          <ViewEditor
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
            updatePixelSpecific={updatePixelSpecific}
            selectedColour={selectedColor}
            direction={3}
            title="East"
          />
        </div>
      </div>
      <div id="row1" style={{ display: "flex" }}>
        <div id="north-viewer">
          <ViewEditor
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              // float: "right",
            }}
            pattern={pattern}
            updatePixelSpecific={updatePixelSpecific}
            selectedColour={selectedColor}
            direction={2}
            title="North"
          />
        </div>
        <div id="south-viewer">
          <ViewEditor
            style={{
              margin: 0,
              height: "50%",
              width: "50%",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
            updatePixelSpecific={updatePixelSpecific}
            selectedColour={selectedColor}
            direction={0}
            title="South"
          />
        </div>
      </div>
    </div>
  );
}
