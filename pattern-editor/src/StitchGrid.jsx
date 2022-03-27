import React from "react";
import { FLAT, GRAY, WHITE } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  const { colour, label, pattern, updatePixel, updateCol, updateRow } = props;
  return (
    <div className="stitch-grid">
      <h2>{label}</h2>
      <div className="pixels">
        <div className="row">
          <Pixel colour={GRAY} stitchType={FLAT} key={-1} onChange={() => {}} />
          {pattern[0].map((_, j) => (
            <Pixel
              colArrow
              colour={GRAY}
              stitchType={FLAT}
              key={j}
              onChange={() => updateCol(j)}
            />
          ))}
        </div>
        {pattern.map((row, i) => (
          <div className="row" key={i}>
            <Pixel
              rowArrow
              colour={GRAY}
              stitchType={FLAT}
              onChange={() => updateRow(i)}
            />
            {row.map((pixel, j) => (
              <Pixel
                key={j}
                colour={pattern[i][j].colour}
                stitchType={pattern[i][j].type}
                onChange={() => updatePixel(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
