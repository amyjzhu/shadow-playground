import React from "react";
import Pixel from "./Pixel";
import { FLAT } from "./constants";

export default function DrawingPanel(props) {
  const { colorMap, stitchMap, title, updatePixel } = props;

  function updateRow(i) {
    stitchMap[i].forEach((_, j) => updatePixel(i, j));
  }

  function updateCol(j) {
    stitchMap.forEach((_, i) => updatePixel(i, j));
  }

  return (
    <div
      style={{ height: "50vh", width: "40vw", overflow: "scroll" }}
      className="editor"
    >
      <h2>{title}</h2>
      <div className="drawingPanel">
        <div className="pixels">
          <div className="row">
            <Pixel
              color={"#fff"}
              stitchType={FLAT}
              key={-1}
              onChange={() => {}}
            />
            {colorMap[0].map((_, j) => (
              <Pixel
                colArrow
                color={"#ccc"}
                stitchType={FLAT}
                key={j}
                onChange={() => updateCol(j)}
              />
            ))}
          </div>
          {colorMap.map((row, i) => (
            <div className="row" key={i}>
              <Pixel
                rowArrow
                color={"#ccc"}
                stitchType={FLAT}
                onChange={() => updateRow(i)}
              />
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
