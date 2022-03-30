import React from "react";
import { FLAT, GRAY, WHITE } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  return (
    <div className="stitch-grid">
      <h2>{props.label}</h2>
      <div className="pixels">
        {!props.viewOnly && (
          <div className="row">
            <Pixel
              colour={GRAY}
              stitchType={FLAT}
              key={-1}
              onChange={() => {}}
            />
            {props.pattern[0].map((_, j) => (
              <Pixel
                colArrow
                colour={GRAY}
                stitchType={FLAT}
                key={j}
                onChange={() => props.updateCol(j)}
              />
            ))}
          </div>
        )}
        {props.pattern.map((row, i) => (
          <div className="row" key={i}>
            {!props.viewOnly && (
              <Pixel
                rowArrow
                colour={GRAY}
                stitchType={FLAT}
                onChange={() => props.updateRow(i)}
              />
            )}
            {row.map((pixel, j) => (
              <Pixel
                key={j}
                colour={props.pattern[i][j].colour}
                stitchType={props.pattern[i][j].type}
                onChange={() => props.updatePixel(i, j)}
                viewOnly={props.viewOnly}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
