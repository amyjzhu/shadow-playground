import React from "react";
import { RAISED } from "./constants";

export default function Pixel(props) {
  const { color, onChange, stitchType } = props;

  const dotColor = color === "#ffffff" ? "#ccc" : "#fff";

  return (
    <div
      style={{ backgroundColor: color, border: "1px solid #D3D3D3" }}
      className="pixel"
      onClick={onChange}
    >
      {stitchType === RAISED && (
        <span style={{ backgroundColor: dotColor }} className="dot" />
      )}
    </div>
  );
}
