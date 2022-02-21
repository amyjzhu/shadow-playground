import React, { useState } from "react";
import _ from "lodash";
import TextField from "@material-ui/core/TextField";
import { CompactPicker } from "react-color";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {
  HEIGHT,
  WIDTH,
  RAISED,
  FLAT,
  TOGGLE,
  DEFAULT_STITCH,
} from "./constants";
import "./styles/App.scss";
import DrawingPanel from "./DrawingPanel";
import ViewerGroup from "./ViewerGroup";
import Text from "./Text";

export default function App() {
  let defaultPattern = [];
  let defaultColorMap = [];
  let defaultStitchMap = [];
  for (let row = 0; row < HEIGHT; row++) {
    let patternRow = [];
    for (let col = 0; col < WIDTH; col++) {
      patternRow.push({ ...DEFAULT_STITCH });
    }
    defaultPattern.push(patternRow);
  }

  let [selectedColor, setSelectedColor] = useState("#653294");
  let [stitchType, setStitchType] = useState(RAISED);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);
  let [pattern, setPattern] = useState(defaultPattern);

  function resize(newWidth, newHeight) {
    let newPattern = [];
    for (let row = 0; row < newHeight; row++) {
      let patternRow = [];
      for (let col = 0; col < newWidth; col++) {
        if (pattern[row] && pattern[row][col]) {
          patternRow.push({ ...pattern[row][col] });
        } else {
          patternRow.push({ ...DEFAULT_STITCH });
        }
      }
      newPattern.push(patternRow);
    }
    setPattern(newPattern);
  }

  function updatePixel(row, col) {
    let newPattern = _.cloneDeep(pattern);
    newPattern[row][col].color = selectedColor;

    let newType;
    if (stitchType === TOGGLE) {
      if (pattern[row][col].type === RAISED) {
        newType = FLAT;
      } else {
        newType = RAISED;
      }
    } else {
      newType = stitchType;
    }

    newPattern[row][col].type = newType;
    setPattern(newPattern);
  }

  function updateRow(i) {
    let newPattern = _.cloneDeep(pattern);

    newPattern[i].forEach((stitch) => {
      stitch.color = selectedColor;
      stitch.type =
        stitchType === TOGGLE
          ? stitch.type === RAISED
            ? FLAT
            : RAISED
          : stitchType;
    });
    setPattern(newPattern);
  }

  function updateCol(i) {
    let newPattern = _.cloneDeep(pattern);

    newPattern.forEach((row) => {
      const stitch = row[i];
      stitch.color = selectedColor;
      stitch.type =
        stitchType === TOGGLE
          ? stitch.type === RAISED
            ? FLAT
            : RAISED
          : stitchType;
    });
    setPattern(newPattern);
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

  function handleLoadPattern(newPattern) {
    setPattern(newPattern);
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
          <FormControlLabel value={TOGGLE} control={<Radio />} label="Toggle" />
          <FormControlLabel value={RAISED} control={<Radio />} label="Raised" />
          <FormControlLabel value={FLAT} control={<Radio />} label="Flat" />
        </RadioGroup>
      </FormControl>
      <CompactPicker
        color={selectedColor}
        onChangeComplete={(color) => setSelectedColor(color.hex)}
      />
      <div style={{ display: "flex", marginTop: 10 }} className="App">
        <DrawingPanel
          style={{ float: "left" }}
          pattern={pattern}
          updatePixel={updatePixel}
          updateRow={updateRow}
          updateCol={updateCol}
          title={"Editor"}
        />
        <div id="all-viewers">
          <ViewerGroup
            style={{
              margin: 0,
              height: "50vh",
              width: "40vw",
              overflow: "scroll",
              float: "right",
            }}
            pattern={pattern}
          />
        </div>
      </div>
      <Text pattern={pattern} handleLoadPattern={handleLoadPattern} />
    </div>
  );
}

const styles = {
  optionsContainer: { display: "flex" },
  textField: { padding: 10 },
};
