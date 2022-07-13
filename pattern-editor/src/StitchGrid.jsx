import React from "react";
import { FLAT, GRAY, COLOR_MAP } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  const updateRow = props.updateRow;
  const updateCol = props.updateCol;

  function placeholder(key) {
    return (
      <Pixel
        key={key}
        colour={"#fff"}
        stitchType={FLAT}
        canEdit={false}
        noBorder
      />
    );
  }

  function makeRow(label, side) {
    const row = [placeholder("a")];
    if (updateRow) {
      row.push(placeholder("b"));
    }

    props.pattern[0].forEach((_, i) => {
      row.push(
        <Pixel
          key={i}
          colour={COLOR_MAP[label][side]}
          stitchType={FLAT}
          canEdit={false}
          noBorder
        />
      );
    });
    return row;
  }

  return (
    <div className="stitch-grid">
      <h2 style={{ marginTop: 0 }}>{props.label}</h2>
      <div className="pixels">
        {updateCol && (
          <div className="row">
            {placeholder("first")}
            {placeholder("second")}
            {props.pattern[0].map((_, j) => (
              <Pixel
                colArrow
                colour={GRAY}
                stitchType={FLAT}
                key={j}
                onChange={(e) => props.updateCol(j, e.shiftKey)}
                canEdit={props.canEdit}
              />
            ))}
          </div>
        )}
        <div className="row" key="top">
          {makeRow(props.label, "TOP")}
        </div>
        {props.pattern.map((row, i) => (
          <div className="row" key={i}>
            {updateRow && (
              <Pixel
                rowArrow
                colour={GRAY}
                stitchType={FLAT}
                onChange={(e) => props.updateRow(i, e.shiftKey)}
                canEdit={props.canEdit}
              />
            )}
            <Pixel
              key={"left"}
              colour={COLOR_MAP[props.label]["LEFT"]}
              stitchType={FLAT}
              canEdit={false}
              noBorder
            />
            {row.map((pixel, j) => (
              <Pixel
                key={j}
                colour={props.pattern[i][j].colour}
                stitchType={props.allFlat ? FLAT : props.pattern[i][j].type}
                onChange={(e) => props.updatePixel(i, j, e.shiftKey)}
                canEdit={props.canEdit}
              />
            ))}
            <Pixel
              key={"right"}
              colour={COLOR_MAP[props.label]["RIGHT"]}
              stitchType={FLAT}
              canEdit={false}
              noBorder
            />
          </div>
        ))}
        <div className="row" key="bottom">
          {makeRow(props.label, "BOTTOM")}
        </div>
      </div>
    </div>
  );
}
