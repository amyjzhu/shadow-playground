import React from "react";

export default function Pixel(props) {
  const { color, onChange } = props;

  return (
    <div
      style={{ backgroundColor: color, border: "1px solid #D3D3D3" }}
      className="pixel"
      onClick={onChange}
    />
  );
}
