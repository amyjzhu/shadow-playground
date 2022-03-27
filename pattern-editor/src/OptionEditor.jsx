import React from "react";
import { CompactPicker } from "react-color";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@material-ui/core/TextField";

import { HEIGHT, WIDTH, TOGGLE, RAISED, FLAT } from "./constants";

//TODO: hook these up to state
export default function OptionEditor(props) {
  function handleChangeHeight(e) {
    const newHeight = parseInt(e.target.value);
    if (newHeight) {
      props.setHeight(newHeight);
    }
  }

  function handleChangeWidth(e) {
    const newWidth = parseInt(e.target.value);
    if (newWidth) {
      props.setWidth(newWidth);
    }
  }

  return (
    <div>
      <div>
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
        <FormLabel>Stitch Type</FormLabel>
        <RadioGroup
          row
          name="row-radio-buttons-group"
          value={props.stitchType}
          onChange={(e) => props.setStitchType(parseInt(e.target.value))}
        >
          <FormControlLabel value={TOGGLE} control={<Radio />} label="toggle" />
          <FormControlLabel value={RAISED} control={<Radio />} label="raised" />
          <FormControlLabel value={FLAT} control={<Radio />} label="flat" />
        </RadioGroup>
      </FormControl>
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
