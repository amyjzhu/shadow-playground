import React from "react";
import { CompactPicker } from "react-color";
import TextField from "@material-ui/core/TextField";

import { HEIGHT, WIDTH } from "./constants";

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
    </div>
  );
}

const styles = {
  textField: {
    padding: 10,
  },
};
