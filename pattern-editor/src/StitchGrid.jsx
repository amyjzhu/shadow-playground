import React from "react";
import { FLAT } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  const { colour, label, pattern, updatePixel } = props;
  return (
    <div className="stitch-grid">
      <h2>{label}</h2>
      <div className="pixels">
        {pattern.map((row, i) => (
          <div className="row" key={i}>
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
