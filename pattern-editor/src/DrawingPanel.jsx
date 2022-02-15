import React from "react";
// TODO: leaving this import here for now because we'll probably want to use it
// to add multi-color support but for now it's not needed.
// import { CirclePicker } from "react-color";
import Pixel from "./Pixel";
import Viewer from "./Viewer";

export default function DrawingPanel(props) {
  const { rows, readOnly, title } = props;
  return (
    <div className="editor">
      <h1>{title}</h1>
      <div className="drawingPanel">
        <div className="pixels">
          {rows.map((row, i) => (
            <div className="row" key={i}>
              {row.map((pixel, j) => (
                <Pixel
                  readOnly={readOnly}
                  color={rows[i][j]}
                  key={j}
                  setColor={(newColor) => {
                    props.updatePixel(i, j, newColor);
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
