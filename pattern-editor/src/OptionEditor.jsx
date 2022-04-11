import React from "react";
import { CompactPicker } from "react-color";
import TextField from "@material-ui/core/TextField";

import { HEIGHT, WIDTH, DIRECTION } from "./constants";

export default function OptionEditor(props) {
  return (
    <div>
      <div>
        <TextField
          style={styles.textField}
          id="height"
          label="Rows"
          variant="outlined"
          defaultValue={HEIGHT}
          onBlur={(e) =>
            props.handleResize(parseInt(e.target.value), props.width)
          }
        />
        <TextField
          style={styles.textField}
          id="width"
          label="Stitches per Row"
          variant="outlined"
          defaultValue={WIDTH}
          onBlur={(e) =>
            props.handleResize(props.height, parseInt(e.target.value))
          }
        />
      </div>
      <CompactPicker
        color={props.colour}
        onChangeComplete={(colour) => props.setColour(colour.hex)}
      />
      <div>
        <p>Heuristic Weights</p>
        <span style={styles.weightSpan}>
          <label>Top: </label>
          <input
            type="text"
            value={props.weights.TOP}
            onChange={props.handleWeightChange(DIRECTION.TOP)}
          />
        </span>
        <span style={styles.weightSpan}>
          <label>North: </label>
          <input
            type="text"
            value={props.weights.NORTH}
            onChange={props.handleWeightChange(DIRECTION.NORTH)}
          />
        </span>
        <span style={styles.weightSpan}>
          <label>South: </label>
          <input
            type="text"
            value={props.weights.SOUTH}
            onChange={props.handleWeightChange(DIRECTION.SOUTH)}
          />
        </span>
        <span style={styles.weightSpan}>
          <label>East: </label>
          <input
            type="text"
            value={props.weights.EAST}
            onChange={props.handleWeightChange(DIRECTION.EAST)}
          />
        </span>
        <span style={styles.weightSpan}>
          <label>West: </label>
          <input
            type="text"
            value={props.weights.WEST}
            onChange={props.handleWeightChange(DIRECTION.WEST)}
          />
        </span>
      </div>
    </div>
  );
}

const styles = {
  textField: {
    padding: 10,
  },
  weightSpan: {
    margin: 10,
  },
};
