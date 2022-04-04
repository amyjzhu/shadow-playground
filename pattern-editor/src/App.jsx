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
  STITCH_CASES,
  TOGGLE,
  FLAT,
} from "./constants";
import * as utils from "./utils";

export default function App() {
  let defaultPattern = [];
  for (let row = 0; row < HEIGHT; row++) {
    let patternRow = [];
    for (let col = 0; col < WIDTH; col++) {
      patternRow.push({ ...DEFAULT_STITCH });
    }
    defaultPattern.push(patternRow);
  }
  let defaultHeuristicMap = {};
  STITCH_CASES.forEach((targetStitch) => {
    STITCH_CASES.forEach((frontStitch) => {
      defaultHeuristicMap[
        `${utils.hackySerialize(targetStitch)}:${utils.hackySerialize(
          frontStitch
        )}`
      ] = `${utils.hackySerialize(DEFAULT_STITCH)}:${utils.hackySerialize(
        DEFAULT_STITCH
      )}`;
    });
  });

  let [patternStack, setPatternStack] = useState([defaultPattern]);
  let [heuristicMap, setHeuristicMap] = useState(defaultHeuristicMap);
  let [colour, setColour] = useState(WHITE);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);
  let [stitchType, setStitchType] = useState(RAISED);

  useHotkeys("cmd+z", handleUndo, {}, [patternStack]);

  function handleChangeHeuristic(key, value) {
    let newHeuristicMap = _.cloneDeep(heuristicMap);
    newHeuristicMap[key] = value;
    setHeuristicMap(newHeuristicMap);
  }

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
    console.log("edit made at " + row + ", " + col);
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

  // the idea is that you want to make the pixel in that view that colour
  // eventually we should use rules to make this modification 
  // but for now we just apply the settings chosen in OptionEditor
  function updateForDirection(direction) {
    // delicious curry 
    return (viewRow, viewCol) => {
      let newPattern = _.cloneDeep(getPattern());
      let oldPattern = getPattern();
      
      console.log(getCanonicalPixelFromDirection(direction, viewRow, viewCol, oldPattern));
      let {row, col} = getCanonicalPixelFromDirection(direction, viewRow, viewCol, oldPattern);
      console.log(row);
      console.log(col);
      console.log(newPattern[row]);

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

  function getCanonicalPixelFromDirection(direction, row, col, pattern) {
    let maxRow = pattern.length - 1;
    let maxCol = pattern[0].length - 1;
    
    switch (direction) {
      case DIRECTION.NORTH: {
        // normally it would be pattern[x][y]
        // with north, we are completely opposite
        return {col: maxCol - col, row: maxRow - row};
      }
      case DIRECTION.SOUTH: {
        return {col: col, row: row};
      }
      case DIRECTION.EAST: {
        // order is preserved for the y direction 
        return {col: row, row: maxCol - col};
      }
      case DIRECTION.WEST: {
        // order is preserved for the x direction
        return {col: maxRow - row, row: col};
      }
      default:
        return {col: col, row: row};
    }
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
      default: {
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
      <HeuristicEditor
        map={heuristicMap}
        onUpdateHeuristic={handleChangeHeuristic}
      />
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
        updatePixel={updateForDirection(DIRECTION.NORTH)}
        updateCol={updateCol}
        updateRow={updateRow}
      />
      <StitchGrid
        label="SOUTH"
        pattern={getPatternForDirection(DIRECTION.SOUTH)}
        updatePixel={updateForDirection(DIRECTION.SOUTH)}
        updateCol={updateCol}
        updateRow={updateRow}
      />
      <StitchGrid
        label="EAST"
        pattern={getPatternForDirection(DIRECTION.EAST)}
        updatePixel={updateForDirection(DIRECTION.EAST)}
        updateCol={updateCol}
        updateRow={updateRow}
      />
      <StitchGrid
        label="WEST"
        pattern={getPatternForDirection(DIRECTION.WEST)}
        updatePixel={updateForDirection(DIRECTION.WEST)}
        updateCol={updateCol}
        updateRow={updateRow}
      />
    </div>
  );
}
