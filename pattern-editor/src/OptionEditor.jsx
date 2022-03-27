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
export default function OptionEditor() {
  return (
    <div>
      <div>
        <TextField
          style={styles.textField}
          id="height"
          label="Rows"
          variant="outlined"
          defaultValue={HEIGHT}
        />
        <TextField
          style={styles.textField}
          id="width"
          label="Stitches per Row"
          variant="outlined"
          defaultValue={WIDTH}
        />
      </div>
      <FormControl>
        <FormLabel>Stitch Type</FormLabel>
        <RadioGroup row name="row-radio-buttons-group">
          <FormControlLabel value={TOGGLE} control={<Radio />} label="toggle" />
          <FormControlLabel value={RAISED} control={<Radio />} label="raised" />
          <FormControlLabel value={FLAT} control={<Radio />} label="flat" />
        </RadioGroup>
      </FormControl>
      <CompactPicker />
    </div>
  );
}

const styles = {
  textField: {
    padding: 10,
  },
};
