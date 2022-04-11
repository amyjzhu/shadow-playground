import React, { useState } from "react";
import _ from "lodash";
import { useHotkeys } from "react-hotkeys-hook";

import "./styles/App.scss";
import OptionEditor from "./OptionEditor";
import StitchGrid from "./StitchGrid";
import {
  HEIGHT,
  WIDTH,
  DEFAULT_STITCH,
  DIRECTION,
  WHITE,
  RAISED,
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

  function toggle(stitchType) {
    return stitchType === RAISED ? FLAT : RAISED;
  }

  function updatePixel(row, col) {
    console.log("edit made at " + row + ", " + col);
    let newPattern = _.cloneDeep(getPattern());
    let oldPattern = getPattern();
    newPattern[row][col].colour = colour;
    newPattern[row][col].type = toggle(oldPattern[row][col].type);
    pushPattern(newPattern);
  }

  function updateRow(row) {
    let newPattern = _.cloneDeep(getPattern());
    newPattern[row].forEach((stitch) => {
      stitch.colour = colour;
      stitch.type = toggle(stitch.type);
    });
    pushPattern(newPattern);
  }

  function updateCol(col) {
    let newPattern = _.cloneDeep(getPattern());
    newPattern.forEach((row) => {
      const stitch = row[col];
      stitch.colour = colour;
      stitch.type = toggle(stitch.type);
    });
    pushPattern(newPattern);
  }

  function minimizeDiff(direction) {
    return function (viewRow, viewCol) {
      let oldPattern = getPattern();
      let targetColour = colour;
      let targetOptions = [
        (pattern, i, j) => (pattern[i][j].type = toggle(pattern[i][j].type)), // change stitch type
        (pattern, i, j) => (pattern[i][j].colour = targetColour), // change colour
        (pattern, i, j) => {
          pattern[i][j].type = toggle(pattern[i][j].type);
          pattern[i][j].colour = targetColour;
        }, // change both
        (pattern, i, j) => {}, // do nothing
      ];
      let frontOptions = [
        (pattern, i, j) => {
          const { r, c } = getFrontCoords(direction, i, j);
          if (pattern[r] && pattern[r][c]) {
            pattern[r][c].type = toggle(pattern[r][c].type);
          }
        }, // change stitch type
        (pattern, i, j) => {
          const { r, c } = getFrontCoords(direction, i, j);
          if (pattern[r] && pattern[r][c]) {
            pattern[r][c].colour = targetColour;
          }
        }, // change colour
        (pattern, i, j) => {
          const { r, c } = getFrontCoords(direction, i, j);
          if (pattern[r] && pattern[r][c]) {
            pattern[r][c].type = toggle(pattern[r][c].type);
            pattern[r][c].colour = targetColour;
          }
        }, // change both
        (pattern, i, j) => {}, // do nothing
      ];
      let allOptions = [];
      targetOptions.forEach((opt1) => {
        frontOptions.forEach((opt2) => {
          allOptions.push((pattern, i, j) => {
            opt1(pattern, i, j);
            opt2(pattern, i, j);
          });
        });
      });

      let { row, col } = getCanonicalPixelFromDirection(
        direction,
        viewRow,
        viewCol,
        oldPattern
      );
      let cost = 1000;
      let best;
      let opt_ind;
      allOptions.forEach((opt, opt_i) => {
        let patternCopy = _.cloneDeep(oldPattern);
        opt(patternCopy, row, col);
        const viewPattern = getPatternForDirection(patternCopy, direction);
        if (viewPattern[viewRow][viewCol].colour === targetColour) {
          const otherViews = [DIRECTION.NORTH, DIRECTION.SOUTH];
          let optCost = 0;
          otherViews.forEach((otherDir) => {
            optCost += computeCost(
              getPatternForDirection(patternCopy, otherDir),
              getPatternForDirection(oldPattern, otherDir)
            );
          });
          console.log(optCost);
          if (optCost < cost) {
            cost = optCost;
            best = patternCopy;
            opt_ind = opt_i;
          }
        }
      });
      if (best) {
        console.log(`best: ${cost}, option ${opt_ind}`);
        pushPattern(best);
      }
    };
  }

  function computeCost(pat1, pat2) {
    let cost = 0;
    pat1.forEach((row, i) => {
      row.forEach((stitch, j) => {
        if (stitch.colour !== pat2[i][j].colour) {
          cost++;
        }
      });
    });
    return cost;
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
        return { col: maxCol - col, row: maxRow - row };
      }
      case DIRECTION.SOUTH: {
        return { col: col, row: row };
      }
      case DIRECTION.EAST: {
        // order is preserved for the y direction
        return { col: row, row: maxCol - col };
      }
      case DIRECTION.WEST: {
        // order is preserved for the x direction
        return { col: maxRow - row, row: col };
      }
      default:
        return { col: col, row: row };
    }
  }

  function getFrontCoords(direction, row, col) {
    switch (direction) {
      case DIRECTION.NORTH:
        return { r: row - 1, c: col };
      case DIRECTION.SOUTH:
        return { r: row + 1, c: col };
      case DIRECTION.EAST:
        return { r: row, c: col + 1 };
      case DIRECTION.WEST:
        return { r: row, c: col - 1 };
      case DIRECTION.TOP:
        return { r: row, c: col };
      default:
        console.warn(`unknown direction ${direction}`);
        return { r: -1, c: -1 };
    }
  }

  function getPatternForDirection(pattern, direction) {
    let newPattern = _.cloneDeep(pattern);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let { r, c } = getFrontCoords(direction, row, col);
        let frontStitch = pattern[r] && pattern[r][c];
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
        width={width}
        setColour={setColour}
        handleResize={handleResize}
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
        pattern={getPatternForDirection(getPattern(), DIRECTION.NORTH)}
        updatePixel={minimizeDiff(DIRECTION.NORTH)}
        allFlat
      />
      <StitchGrid
        label="SOUTH"
        pattern={getPatternForDirection(getPattern(), DIRECTION.SOUTH)}
        updatePixel={minimizeDiff(DIRECTION.SOUTH)}
        allFlat
      />
      <StitchGrid
        label="EAST"
        pattern={getPatternForDirection(getPattern(), DIRECTION.EAST)}
        updatePixel={minimizeDiff(DIRECTION.EAST)}
        allFlat
      />
      <StitchGrid
        label="WEST"
        pattern={getPatternForDirection(getPattern(), DIRECTION.WEST)}
        updatePixel={minimizeDiff(DIRECTION.WEST)}
        allFlat
      />
    </div>
  );
}
