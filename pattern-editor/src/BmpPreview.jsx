import React from "react";
import { FLAT } from "./constants";
import Bitmap from "./bitmap";

export default function StitchGrid(props) {
  const { pattern, width, height } = props;

  function hexToRgb(hexColor) {
    const R = parseInt(hexColor.substr(1, 2), 16) / 255;
    const G = parseInt(hexColor.substr(3, 2), 16) / 255;
    const B = parseInt(hexColor.substr(5, 2), 16) / 255;
    return [R, G, B, 1];
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
      <h2>Bitmaps</h2>
      <div style={styles.container}>
        <a style={styles.link} href={colourPng} download="colour.bmp">
          Download Colour Bitmap
        </a>
        <img style={styles.image} src={colourPng} alt="colour bitmap" />
      </div>
      <div style={styles.container}>
        <a style={styles.link} href={stitchPng} download="stitchType.bmp">
          Download Stitch Type Bitmap
        </a>
        <img style={styles.image} src={stitchPng} alt="stitch bitmap" />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "inline-block",
    margin: 20,
  },
  link: {
    display: "block",
  },
  image: {
    outline: "1px solid black",
    width: 200,
    marginTop: 20,
  },
};
