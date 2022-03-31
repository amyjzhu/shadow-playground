import React from "react";
import Select, { components } from "react-select";

import { BLACK, RAISED, STITCH_CASES } from "./constants";

// Customize react-select components to display icons in the dropdown
const { Option, ValueContainer } = components;
const IconOption = (props) => (
  <Option {...props}>{getIconForStitch(props.data)}</Option>
);
const IconValueContainer = (props) => {
  const stitch = props.getValue()[0];
  return <ValueContainer {...props}>{getIconForStitch(stitch)}</ValueContainer>;
};

function getIconForStitch(stitch) {
  return (
    <i
      style={{ paddingTop: 5, color: stitch.colour }}
      className={`fa fa-${stitch.type === RAISED ? "cube" : "square"}`}
    />
  );
}

export default function HeuristicEditor() {
  // Stitch can be black/white and raised/flat
  // Front Stitch can be black/white and raised/flat
  // 16 total cases
  const cases = [];
  STITCH_CASES.forEach((stitch) =>
    STITCH_CASES.forEach((frontStitch) => cases.push({ stitch, frontStitch }))
  );

  const options = STITCH_CASES.map((stitch) => ({
    value: `${stitch.type}${stitch.colour}`,
    label: `${stitch.type}${stitch.colour}`,
    colour: stitch.colour,
    type: stitch.type,
  }));

  return (
    <div>
      <table style={{ margin: "auto", marginTop: 20 }}>
        <tbody>
          <tr>
            <td className="border" colSpan="2">
              Input
            </td>
            <td colSpan="2">Output</td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td>Stitch</td>
            <td className="border">Front</td>
            <td>Stitch</td>
            <td>Front</td>
          </tr>
          {cases.map((c, i) => (
            <tr key={i}>
              <td>{getIconForStitch(c.stitch)}</td>
              <td className="border">{getIconForStitch(c.frontStitch)}</td>
              <td>
                <Select
                  options={options}
                  defaultValue={options[0]}
                  components={{
                    Option: IconOption,
                    ValueContainer: IconValueContainer,
                  }}
                />
              </td>
              <td>
                <Select
                  options={options}
                  defaultValue={options[0]}
                  components={{
                    Option: IconOption,
                    ValueContainer: IconValueContainer,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
