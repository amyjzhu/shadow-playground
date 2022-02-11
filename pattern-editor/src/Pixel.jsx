import React from "react";
import { DARK, LIGHT } from "./constants";

export default function Pixel(props) {
  const { color, readOnly, setColor } = props;

  // TODO: Make this work for click and drag
  function onChange() {
    if (readOnly) {
      return;
    }

    setColor(color === DARK ? LIGHT : DARK); // toggle
  }

  return (
    <div
      style={{ backgroundColor: color, border: "1px solid #D3D3D3" }}
      className="pixel"
      onClick={onChange}
    />
  );
}
