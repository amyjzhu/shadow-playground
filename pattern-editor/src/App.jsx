import React, { useState } from "react";
import _ from "lodash";
import { useHotkeys } from "react-hotkeys-hook";

import "./styles/App.scss";
import PngPreview from "./PngPreview";
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
  let [pendingPattern, setPendingPattern] = useState(defaultPattern);
  let [colour, setColour] = useState(WHITE);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);
  let [weights, setWeights] = useState(
    Object.keys(DIRECTION).reduce((weights, dir) => {
      weights[dir] = 1;
      return weights;
    }, {})
  );
  let [batchedChanges, setBatchedChanges] = useState([]);

  function getPendingPattern(direction) {
    if (batchedChanges.length > 0) {
      return pendingPattern;
    }
    let pattern = getPattern();
    let newPattern = _.cloneDeep(pattern);
    // TODO: maybe deduplicate with getPatternForDirection?
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let { r, c } = getFrontCoords(direction, row, col);
        let frontStitch = pattern[r] && pattern[r][c];
        if (frontStitch && frontStitch.type === RAISED) {
          newPattern[row][col].colour = frontStitch.colour;
        }
        newPattern[row][col].type = FLAT;
      }
    }
    return newPattern;
  }

  function updateViewPixel(direction) {
    return function (viewRow, viewCol) {
      let { row, col } = getCanonicalPixelFromDirection(
        direction,
        viewRow,
        viewCol,
        getPattern()
      );
      let newPendingPattern = getPendingPattern(direction);
      newPendingPattern[row][col].colour = colour;
      setPendingPattern(newPendingPattern);

      let copy = _.cloneDeep(batchedChanges);
      copy.unshift({ direction, viewRow, viewCol, colour });
      setBatchedChanges(copy);
    };
  }

  function applyBatchedChanges() {
    let pattern = getPattern();
    batchedChanges.forEach((change) => {
      // TODO: Do something smarter than sequentially applying changes
      pattern = minimizeDiff(
        pattern,
        change.direction,
        change.viewRow,
        change.viewCol,
        change.colour
      );
    });
    pushPattern(pattern);
    setBatchedChanges([]);
  }

  function handleWeightChange(dir) {
    return function (e) {
      const newWeight = parseInt(e.target.value) || 0;
      let newWeights = { ...weights };
      newWeights[dir] = newWeight;
      setWeights(newWeights);
    };
  }

  useHotkeys("cmd+z", handleUndo, {}, [
    patternStack,
    batchedChanges,
    pendingPattern,
  ]);

  function getPattern() {
    return patternStack[0];
  }

  function pushPattern(pattern) {
    let copy = _.cloneDeep(patternStack);
    copy.unshift(pattern);
    setPatternStack(copy);
  }

  function handleUndo() {
    if (batchedChanges.length > 0) {
      let copy = _.cloneDeep(batchedChanges);
      copy.shift();
      setBatchedChanges(copy);
      let newPendingPattern = _.cloneDeep(getPattern());
      copy.forEach((change) => {
        let { row, col } = getCanonicalPixelFromDirection(
          change.direction,
          change.viewRow,
          change.viewCol,
          getPattern()
        );
        newPendingPattern[row][col].colour = colour;
      });
      setPendingPattern(newPendingPattern);
    } else {
      let copy = _.cloneDeep(patternStack);
      copy.shift();
      if (copy.length > 0) {
        setPatternStack(copy);
      } else {
        setPatternStack([defaultPattern]);
      }
    }
  }

  function toggle(stitchType) {
    return stitchType === RAISED ? FLAT : RAISED;
  }

  function updateTopPixel(row, col) {
    console.log("edit made at " + row + ", " + col);
    let newPattern = _.cloneDeep(getPattern());
    let oldPattern = getPattern();
    newPattern[row][col].colour = colour;
    newPattern[row][col].type = toggle(oldPattern[row][col].type);
    pushPattern(newPattern);
  }

  function minimizeDiff(oldPattern, direction, viewRow, viewCol, targetColour) {
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
    allOptions.forEach((opt) => {
      let patternCopy = _.cloneDeep(oldPattern);
      opt(patternCopy, row, col);
      const viewPattern = getPatternForDirection(patternCopy, direction);
      if (viewPattern[viewRow][viewCol].colour === targetColour) {
        let optCost = computeCost(patternCopy, direction);
        if (optCost < cost) {
          cost = optCost;
          best = patternCopy;
        }
      }
    });
    return best;
  }

  function computeCost(modifiedPattern, targetDirection) {
    let cost = 0;
    Object.keys(DIRECTION).forEach((dir) => {
      let weight = weights[dir];
      let original = getPatternForDirection(getPattern(), dir);
      let updated = getPatternForDirection(modifiedPattern, dir);
      original.forEach((row, i) => {
        row.forEach((stitch, j) => {
          if (stitch.colour !== updated[i][j].colour) {
            cost += weight;
          }
        });
      });
    });
    // subtract out the cost of the stitch you're trying to change
    cost -= weights[targetDirection];
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

  function canEdit(direction) {
    if (batchedChanges.length === 0) {
      return true;
    }
    return batchedChanges[0].direction === direction;
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

  function getPatternView(direction) {
    if (
      batchedChanges.length === 0 ||
      batchedChanges[0].direction !== direction
    ) {
      return getPatternForDirection(getPattern(), direction);
    }
    return getPatternForDirection(pendingPattern, direction);
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
        weights={weights}
        handleWeightChange={handleWeightChange}
        numBatchedChanges={batchedChanges.length}
        applyBatchedChanges={applyBatchedChanges}
      />
      <StitchGrid
        label="TOP"
        pattern={getPattern()}
        updatePixel={updateTopPixel}
        canEdit={canEdit(DIRECTION.TOP)}
      />
      <StitchGrid
        label="NORTH"
        pattern={getPatternView(DIRECTION.NORTH)}
        updatePixel={updateViewPixel(DIRECTION.NORTH)}
        allFlat
        canEdit={canEdit(DIRECTION.NORTH)}
      />
      <StitchGrid
        label="SOUTH"
        pattern={getPatternView(DIRECTION.SOUTH)}
        updatePixel={updateViewPixel(DIRECTION.SOUTH)}
        allFlat
        canEdit={canEdit(DIRECTION.SOUTH)}
      />
      <StitchGrid
        label="EAST"
        pattern={getPatternView(DIRECTION.EAST)}
        updatePixel={updateViewPixel(DIRECTION.EAST)}
        allFlat
        canEdit={canEdit(DIRECTION.EAST)}
      />
      <StitchGrid
        label="WEST"
        pattern={getPatternView(DIRECTION.WEST)}
        updatePixel={updateViewPixel(DIRECTION.WEST)}
        allFlat
        canEdit={canEdit(DIRECTION.WEST)}
      />

      <PngPreview pattern={getPattern()} height={height} width={width} />
    </div>
  );
}
