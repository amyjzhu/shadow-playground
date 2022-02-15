import React from "react";
import Pixel from "./Pixel";

export default function DrawingPanel(props) {
  const { rows, title, updatePixel } = props;
  return (
    <div className="editor">
      <h2>{title}</h2>
      <div className="drawingPanel">
        <div className="pixels">
          {rows.map((row, i) => (
            <div className="row" key={i}>
              {row.map((pixel, j) => (
                <Pixel
                  color={rows[i][j]}
                  key={j}
                  onChange={() => {
                    updatePixel(i, j);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
