export function hackySerialize(stitch) {
  return `${stitch.colour}|${stitch.type}`;
}

export function hackyDeserialize(stitchString) {
  const parts = stitchString.split("|");
  return {
    colour: parts[0],
    type: parseInt(parts[1]),
  };
}
