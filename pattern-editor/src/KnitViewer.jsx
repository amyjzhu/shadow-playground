import React from "react";
import DrawingPanel from "./DrawingPanel";
import Viewer from "./Viewer";

import { DARK, LIGHT, DARK_VALLEY, LIGHT_RIDGE } from "./constants";

// TODO: Might be nice to show multiple view angles on this
export default function KnitViewer(props) {
  const { rows } = props;

  // TODO: Add support for multiple colors
  function mapToKnitRows(rows) {
    const knitRows = [];
    rows.forEach((row) => {
      const dark = [];
      const light = [];
      row.forEach((pixel) => {
        dark.push(pixel === DARK ? DARK : DARK_VALLEY);
        light.push(pixel === LIGHT ? LIGHT_RIDGE : LIGHT);
      });
      knitRows.push(dark);
      knitRows.push(light);
    });
    return knitRows;
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
      <DrawingPanel rows={mapToKnitRows(rows)} title={"Viewer"} readOnly />
      </div>
      <div id="viewer">
        <Viewer style={{ float: "right" }} rows={ mapToKnitRows(rows) } />
      </div>
    </div>
  );
}
