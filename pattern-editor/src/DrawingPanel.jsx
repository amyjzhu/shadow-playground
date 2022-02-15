import React from "react";
import Pixel from "./Pixel";

export default function DrawingPanel(props) {
  const { colorMap, stitchMap, title, updatePixel } = props;
  return (
    <div className="editor">
      <h2>{title}</h2>
      <div className="drawingPanel">
        <div className="pixels">
          {colorMap.map((row, i) => (
            <div className="row" key={i}>
              {row.map((pixel, j) => (
                <Pixel
                  color={colorMap[i][j]}
                  stitchType={stitchMap[i][j]}
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
