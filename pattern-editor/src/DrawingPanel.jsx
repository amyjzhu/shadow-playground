import React from "react";
import Pixel from "./Pixel";
import Viewer from "./Viewer";

export default function DrawingPanel(props) {
  const { rows, readOnly, title, updatePixel } = props;
  return (
    <div className="editor">
      <h2>{title}</h2>
      <div className="drawingPanel">
        <div className="pixels">
          {rows.map((row, i) => (
            <div className="row" key={i}>
              {row.map((pixel, j) => (
                <Pixel
                  readOnly={readOnly}
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
