import React from "react";

export default function Pixel(props) {
  const {
    colour,
    onChange,
    rowArrow,
    colArrow,
    canEdit,
    isMouseDown,
    setMouseDown,
  } = props;

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
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseOver={() => isMouseDown && onChange()}
    >
      {rowArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-right"></i>
      )}
      {colArrow && (
        <i style={{ paddingTop: 5 }} className="fa fa-angle-down"></i>
      )}
    </div>
  );
}
