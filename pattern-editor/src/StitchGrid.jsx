import React from "react";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  return (
    <div className="stitch-grid">
      <h2 style={{ marginTop: 0 }}>{props.label}</h2>
      <div className="pixels">
        {props.pattern.map((row, i) => (
          <div className="row" key={i}>
            {row.map((pixel, j) => (
              <Pixel
                key={j}
                colour={props.pattern[i][j].colour}
                onChange={() => props.updatePixel(i, j)}
                canEdit={props.canEdit}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
