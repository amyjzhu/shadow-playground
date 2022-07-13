import React from "react";
import { FLAT } from "./constants";
import Bitmap from "./bitmap";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Button from "@material-ui/core/Button";

export default function PngPreview(props) {
  const { pattern, width, height } = props;

  function hexToRgb(hexColor) {
    const R = parseInt(hexColor.substr(1, 2), 16) / 255;
    const G = parseInt(hexColor.substr(3, 2), 16) / 255;
    const B = parseInt(hexColor.substr(5, 2), 16) / 255;
    return [R, G, B, 1];
  }

  function downloadZip() {
    const zip = new JSZip();
    zip.file("colour.png", colourPng.substring(22), { base64: true });
    zip.file("stitchType.png", stitchPng.substring(22), { base64: true });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      let filename = prompt("Name this pattern");
      if (filename) {
        saveAs(content, `${filename}.zip`);
      }
    });
  }

  const colourMap = pattern.map((row) => row.map((stitch) => stitch.colour));
  const colourBmp = new Bitmap(width, height);
  colourMap.forEach((row, row_i) => {
    row.forEach((col, col_i) => {
      colourBmp.pixel[col_i][row_i] = hexToRgb(col);
    });
  });
  const colourPng = colourBmp.dataURL();

  const stitchMap = pattern.map((row) => row.map((stitch) => stitch.type));
  const stitchBmp = new Bitmap(pattern[0].length, pattern.length);
  stitchMap.forEach((row, row_i) => {
    row.forEach((col, col_i) => {
      stitchBmp.pixel[col_i][row_i] =
        col === FLAT ? [1, 1, 1, 1] : [0, 0, 0, 1];
    });
  });
  const stitchPng = stitchBmp.dataURL();

  return (
    <div>
      <img style={styles.image} src={colourPng} alt="colour map" />
      <img style={styles.image} src={stitchPng} alt="stitch map" />
      <div>
        <Button style={styles.button} variant="outlined" onClick={downloadZip}>
          Save Pattern
        </Button>
      </div>
    </div>
  );
}

const styles = {
  button: {
    fontSize: "1em",
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    display: "block",
  },
  image: {
    outline: "1px solid black",
    width: 200,
    margin: 20,
    display: "inline-block",
  },
};
