import React from "react";
import { FLAT } from "./constants";
import Pixel from "./Pixel";

export default function StitchGrid(props) {
  const { label, pattern } = props;
  return (
    <div className="stitch-grid">
      <h2>{label}</h2>
      <div className="pixels">
        {pattern.map((row, i) => (
          <div className="row" key={i}>
            {row.map((pixel, j) => (
              <Pixel key={j} color={"#fff"} stitchType={FLAT} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
