import React, { useState } from "react";
import _ from "lodash";
import { useHotkeys } from "react-hotkeys-hook";

import "./styles/App.scss";
import HeuristicEditor from "./HeuristicEditor";
import OptionEditor from "./OptionEditor";
import StitchGrid from "./StitchGrid";
import {
  HEIGHT,
  WIDTH,
  DEFAULT_STITCH,
  DIRECTION,
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

  let [patternStack, setPatternStack] = useState([defaultPattern]);
  let [colour, setColour] = useState(WHITE);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);
  let [stitchType, setStitchType] = useState(RAISED);

  useHotkeys("cmd+z", handleUndo, {}, [patternStack]);

  function getPattern() {
    return patternStack[0];
  }

  function pushPattern(pattern) {
    let copy = _.cloneDeep(patternStack);
    copy.unshift(pattern);
    setPatternStack(copy);
  }

  function handleUndo() {
    let copy = _.cloneDeep(patternStack);
    copy.shift();
    if (copy.length > 0) {
      setPatternStack(copy);
    } else {
      setPatternStack([defaultPattern]);
    }
  }

  function updatePixel(row, col) {
    let newPattern = _.cloneDeep(getPattern());
    let oldPattern = getPattern();
    newPattern[row][col].colour = colour;
    let newType;
    if (stitchType === TOGGLE) {
      if (oldPattern[row][col].type === RAISED) {
        newType = FLAT;
      } else {
        newType = RAISED;
      }
    } else {
      newType = stitchType;
    }
    newPattern[row][col].type = newType;
    pushPattern(newPattern);
  }

  function updateRow(row) {
    let newPattern = _.cloneDeep(getPattern());
    newPattern[row].forEach((stitch) => {
      stitch.colour = colour;
      stitch.type =
        stitchType === TOGGLE
          ? stitch.type === RAISED
            ? FLAT
            : RAISED
          : stitchType;
    });
    pushPattern(newPattern);
  }

  function updateCol(col) {
    let newPattern = _.cloneDeep(getPattern());
    newPattern.forEach((row) => {
      const stitch = row[col];
      stitch.colour = colour;
      stitch.type =
        stitchType === TOGGLE
          ? stitch.type === RAISED
            ? FLAT
            : RAISED
          : stitchType;
    });
    pushPattern(newPattern);
  }

  function handleResize(newHeight, newWidth) {
    if (!newHeight || !newWidth) {
      return;
    }
    let newPattern = [];
    let oldPattern = _.cloneDeep(getPattern());
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
    pushPattern(newPattern);
  }

  function getFrontStitchForDirection(direction, row, col, pattern) {
    switch (direction) {
      case DIRECTION.NORTH: {
        return row > 0 && pattern[row - 1][col];
      }
      case DIRECTION.SOUTH: {
        return row < pattern.length - 1 && pattern[row + 1][col];
      }
      case DIRECTION.EAST: {
        return pattern[row][col + 1];
      }
      case DIRECTION.WEST: {
        return pattern[row][col - 1];
      }
      default:
        return pattern[row][col];
    }
  }

  function getPatternForDirection(direction) {
    let pattern = getPattern();
    let newPattern = _.cloneDeep(pattern);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let frontStitch = getFrontStitchForDirection(
          direction,
          row,
          col,
          pattern
        );
        if (frontStitch && frontStitch.type === RAISED) {
          newPattern[row][col].colour = frontStitch.colour;
        }
      }
    }

    let transpose = (arr) => arr[0].map((_, i) => arr.map((row) => row[i]));

    switch (direction) {
      case DIRECTION.NORTH: {
        newPattern.forEach((row) => row.reverse());
        newPattern.reverse();
        break;
      }
      case DIRECTION.WEST: {
        newPattern = transpose(newPattern);

        newPattern.reverse();
        break;
      }
      case DIRECTION.EAST: {
        newPattern = transpose(newPattern);
        newPattern.forEach((row) => row.reverse());
        break;
      }
    }
    return newPattern;
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
      <HeuristicEditor />
      <StitchGrid
        label="TOP"
        pattern={getPattern()}
        updatePixel={updatePixel}
        updateCol={updateCol}
        updateRow={updateRow}
      />
      <StitchGrid
        label="NORTH"
        pattern={getPatternForDirection(DIRECTION.NORTH)}
        viewOnly
      />
      <StitchGrid
        label="SOUTH"
        pattern={getPatternForDirection(DIRECTION.SOUTH)}
        viewOnly
      />
      <StitchGrid
        label="EAST"
        pattern={getPatternForDirection(DIRECTION.EAST)}
        viewOnly
      />
      <StitchGrid
        label="WEST"
        pattern={getPatternForDirection(DIRECTION.WEST)}
        viewOnly
      />
    </div>
  );
}
