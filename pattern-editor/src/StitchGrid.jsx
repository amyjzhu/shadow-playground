import React from "react";
import { FLAT, GRAY } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  const updateRow = props.updateRow && !props.viewOnly;
  const updateCol = props.updateCol && !props.viewOnly;
  return (
    <div className="stitch-grid">
      <h2>{props.label}</h2>
      <div className="pixels">
        {updateCol && (
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
            {props.updateRow && (
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
                stitchType={props.allFlat ? FLAT : props.pattern[i][j].type}
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
