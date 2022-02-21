import React from "react";
import { RAISED } from "./constants";

export default function Pixel(props) {
  const { color, onChange, stitchType, rowArrow, colArrow } = props;

  const dotColor = color === "#ffffff" ? "#ccc" : "#fff";

  return (
    <div
      style={{ backgroundColor: color, border: "1px solid #D3D3D3" }}
      className="pixel"
      onClick={onChange}
      onMouseOver={(e) => {
        if (props.isMouseDown) {
          onChange(e);
        }
      }}
    >
      {rowArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-right"></i>
      )}
      {colArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-down"></i>
      )}
      {stitchType === RAISED && (
        <i
          style={{ color: dotColor, paddingTop: 5, fontSize: 8 }}
          className="fa fa-circle"
        ></i>
      )}
    </div>
  );
}
