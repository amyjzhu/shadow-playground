import React from "react";
import { RAISED, WHITE } from "./constants";

export default function Pixel(props) {
  const { colour, onChange, stitchType, rowArrow, colArrow, canEdit } = props;
  const dotColour = colour === WHITE ? "#ccc" : WHITE;

  return (
    <div
      style={{
        opacity: canEdit ? 1 : 0.5,
        backgroundColor: colour,
        border: "1px solid #D3D3D3",
        cursor: canEdit ? "pointer" : "default",
      }}
      className="pixel"
      onClick={canEdit ? onChange : undefined}
    >
      {rowArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-right"></i>
      )}
      {colArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-down"></i>
      )}
      {stitchType === RAISED && (
        <i
          style={{ color: dotColour, paddingTop: 5, fontSize: 8 }}
          className="fa fa-circle"
        />
      )}
    </div>
  );
}
