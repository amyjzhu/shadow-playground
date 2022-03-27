import React, { useState } from "react";
import _ from "lodash";
import "./styles/App.scss";
import OptionEditor from "./OptionEditor";
import StitchGrid from "./StitchGrid";
import {
  HEIGHT,
  WIDTH,
  DEFAULT_STITCH,
  WHITE,
  RAISED,
  TOGGLE,
  FLAT,
} from "./constants";

export default function App() {
  let defaultPattern = [];
  for (let row = 0; row < HEIGHT; row++) {
    let patternRow = [];
    for (let col = 0; col < WIDTH; col++) {
      patternRow.push({ ...DEFAULT_STITCH });
    }
    defaultPattern.push(patternRow);
  }

  let [pattern, setPattern] = useState(defaultPattern);
  let [colour, setColour] = useState(WHITE);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);
  let [stitchType, setStitchType] = useState(RAISED);

  function updatePixel(row, col) {
    let newPattern = _.cloneDeep(pattern);
    newPattern[row][col].colour = colour;
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

  function handleResize(newHeight, newWidth) {
    if (!newHeight || !newWidth) {
      return;
    }
    let newPattern = [];
    let oldPattern = pattern;
    for (let row = 0; row < newHeight; row++) {
      let patternRow = [];
      for (let col = 0; col < newWidth; col++) {
        if (oldPattern[row] && oldPattern[row][col]) {
          patternRow.push({ ...oldPattern[row][col] });
        } else {
          patternRow.push({ ...DEFAULT_STITCH });
        }
      }
      newPattern.push(patternRow);
    }
    setWidth(newWidth);
    setHeight(newHeight);
    setPattern(newPattern);
  }

  return (
    <div>
      <h1>Pattern Editor/Visualizer</h1>
      <OptionEditor
        colour={colour}
        height={height}
        stitchType={stitchType}
        width={width}
        setColour={setColour}
        setStitchType={setStitchType}
        handleResize={handleResize}
      />
      <StitchGrid label="TOP" pattern={pattern} updatePixel={updatePixel} />
      <StitchGrid label="NORTH" pattern={pattern} />
      <StitchGrid label="SOUTH" pattern={pattern} />
      <StitchGrid label="EAST" pattern={pattern} />
      <StitchGrid label="WEST" pattern={pattern} />
    </div>
  );
}
