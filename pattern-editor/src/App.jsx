import React, { useState } from "react";
import "./styles/App.scss";
import OptionEditor from "./OptionEditor";
import StitchGrid from "./StitchGrid";
import { HEIGHT, WIDTH, DEFAULT_STITCH, WHITE, RAISED } from "./constants";

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

  return (
    <div>
      <h1>Pattern Editor/Visualizer</h1>
      <OptionEditor
        colour={colour}
        height={height}
        stitchType={stitchType}
        width={width}
        setColour={setColour}
        setHeight={setHeight}
        setStitchType={setStitchType}
        setWidth={setWidth}
      />
      <StitchGrid label="TOP" pattern={pattern} />
      <StitchGrid label="NORTH" pattern={pattern} />
      <StitchGrid label="SOUTH" pattern={pattern} />
      <StitchGrid label="EAST" pattern={pattern} />
      <StitchGrid label="WEST" pattern={pattern} />
    </div>
  );
}
