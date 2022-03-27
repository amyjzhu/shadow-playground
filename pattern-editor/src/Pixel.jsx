import React from "react";
import { RAISED, WHITE } from "./constants";

export default function Pixel(props) {
  const { colour, onChange, stitchType, rowArrow, colArrow, viewOnly } = props;
  const dotColour = colour === WHITE ? "#ccc" : WHITE;

  return (
    <div
      style={{
        backgroundColor: colour,
        border: "1px solid #D3D3D3",
        cursor: viewOnly ? "default" : "pointer",
      }}
      className="pixel"
      onClick={viewOnly ? undefined : onChange}
    >
      {rowArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-right"></i>
      )}
      {colArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-down"></i>
      )}
      {!viewOnly && stitchType === RAISED && (
        <i
          style={{ color: dotColour, paddingTop: 5, fontSize: 8 }}
          className="fa fa-circle"
        />
      )}
    </div>
  );
}
