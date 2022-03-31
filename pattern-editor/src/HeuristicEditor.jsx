import React from "react";
import Select, { components } from "react-select";

import { BLACK, GRAY, RAISED, STITCH_CASES } from "./constants";
import * as utils from "./utils";

// Customize react-select components to display icons in the dropdown
const { Option, ValueContainer } = components;
const IconOption = (props) => (
  <Option {...props}>{getIconForStitch(props.data.value)}</Option>
);
const IconValueContainer = (props) => {
  const stitch = props.getValue()[0].value;
  return <ValueContainer {...props}>{getIconForStitch(stitch)}</ValueContainer>;
};

function getIconForStitch(stitchString) {
  const stitch = utils.hackyDeserialize(stitchString);
  return (
    <i
      style={{ paddingTop: 5, color: stitch.colour === BLACK ? BLACK : GRAY }}
      className={`fa fa-${stitch.type === RAISED ? "cube" : "square"}`}
    />
  );
}

export default function HeuristicEditor(props) {
  const { map, onUpdateHeuristic } = props;

  const cases = [];
  Object.keys(map).forEach((key) => {
    cases.push({
      before: {
        target: key.split(":")[0],
        front: key.split(":")[1],
      },
      after: {
        target: map[key].split(":")[0],
        front: map[key].split(":")[1],
      },
    });
  });

  const options = STITCH_CASES.map((stitch) => {
    const str = utils.hackySerialize(stitch);
    return { value: str };
  });

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
            <td style={{ padding: "0px 8px" }}>Target</td>
            <td className="border" style={{ padding: "0px 8px" }}>
              Front
            </td>
            <td>Target</td>
            <td>Front</td>
          </tr>
          {cases.map((c, i) => (
            <tr key={i}>
              <td>{getIconForStitch(c.before.target)}</td>
              <td className="border">{getIconForStitch(c.before.front)}</td>
              <td>
                <Select
                  options={options}
                  onChange={(opt) =>
                    onUpdateHeuristic(
                      `${c.before.target}:${c.before.front}`,
                      `${opt.value}:${c.after.front}`
                    )
                  }
                  value={{
                    value: c.after.target,
                    label: c.after.target,
                  }}
                  components={{
                    Option: IconOption,
                    ValueContainer: IconValueContainer,
                  }}
                />
              </td>
              <td>
                <Select
                  options={options}
                  onChange={(opt) =>
                    onUpdateHeuristic(
                      `${c.before.target}:${c.before.front}`,
                      `${c.after.target}:${opt.value}`
                    )
                  }
                  value={{
                    value: c.after.front,
                    label: c.after.front,
                  }}
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
