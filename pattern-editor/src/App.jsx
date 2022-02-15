import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { CompactPicker } from "react-color";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { HEIGHT, WIDTH, RAISED, FLAT } from "./constants";
import "./styles/App.scss";
import DrawingPanel from "./DrawingPanel";
import Viewer from "./Viewer";

export default function App() {
  let defaultColorMap = [];
  let defaultStitchMap = [];
  for (let row = 0; row < HEIGHT; row++) {
    let colorRow = [];
    let stitchRow = [];
    for (let col = 0; col < WIDTH; col++) {
      colorRow.push("#fff");
      stitchRow.push(FLAT);
    }
    defaultColorMap.push(colorRow);
    defaultStitchMap.push(stitchRow);
  }

  let [selectedColor, setSelectedColor] = useState("#653294");
  let [stitchType, setStitchType] = useState(RAISED);
  let [colorMap, setColorMap] = useState(defaultColorMap);
  let [stitchMap, setStitchMap] = useState(defaultStitchMap);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);

  function resize(newWidth, newHeight) {
    let newColorMap = [];
    let newStitchMap = [];
    for (let row = 0; row < newHeight; row++) {
      let colorRow = [];
      let stitchRow = [];
      for (let col = 0; col < newWidth; col++) {
        if (colorMap[row] && colorMap[row][col]) {
          colorRow.push(colorMap[row][col]);
          stitchRow.push(stitchMap[row][col]);
        } else {
          colorRow.push("#fff");
          stitchRow.push(FLAT);
        }
      }
      newColorMap.push(colorRow);
      newStitchMap.push(stitchRow);
    }
    setColorMap(newColorMap);
    setStitchMap(newStitchMap);
  }

  function updatePixel(row, col) {
    let newColorMap = [...colorMap];
    newColorMap[row][col] = selectedColor;
    setColorMap(newColorMap);

    let newStitchMap = [...stitchMap];
    newStitchMap[row][col] = stitchType;
    setStitchMap(newStitchMap);
  }

  function handleChangeHeight(e) {
    const newHeight = parseInt(e.target.value);
    if (!newHeight) {
      return;
    }
    setHeight(newHeight);
    resize(width, newHeight);
  }

  function handleChangeWidth(e) {
    const newWidth = parseInt(e.target.value);
    if (!newWidth) {
      return;
    }
    setWidth(newWidth);
    resize(newWidth, height);
  }

  // TODO: Might be nice to show some instructions about what this means?
  return (
    <div>
      <h1>Pattern Editor/Visualizer</h1>
      <div style={{ marginTop: 20 }}>
        <TextField
          style={styles.textField}
          id="height"
          label="Rows"
          variant="outlined"
          defaultValue={HEIGHT}
          onBlur={handleChangeHeight}
        />
        <TextField
          style={styles.textField}
          id="width"
          label="Stitches per Row"
          variant="outlined"
          defaultValue={WIDTH}
          onBlur={handleChangeWidth}
        />
      </div>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          Stitch Type
        </FormLabel>
        <RadioGroup
          row
          name="row-radio-buttons-group"
          value={stitchType}
          onChange={(e) => setStitchType(parseInt(e.target.value))}
        >
          <FormControlLabel value={RAISED} control={<Radio />} label="Raised" />
          <FormControlLabel value={FLAT} control={<Radio />} label="Flat" />
        </RadioGroup>
      </FormControl>
      <CompactPicker
        color={selectedColor}
        onChangeComplete={(color) => setSelectedColor(color.hex)}
      />
      <div style={{ display: "flex" }} className="App">
        <DrawingPanel
          style={{ float: "left" }}
          colorMap={colorMap}
          stitchMap={stitchMap}
          updatePixel={updatePixel}
          title={"Editor"}
        />
        <div id="viewer">
          <Viewer style={{ float: "right" }} rows={stitchMap} colours={colorMap} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  optionsContainer: { display: "flex" },
  textField: { padding: 10 },
};
