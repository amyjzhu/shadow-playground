import React, { useState } from "react";

export default function Text(props) {
  const { pattern, handleLoadPattern } = props;

  return (
    <div>
      <label>Pattern bitmap: </label>
      <br />
      <input
        type="textarea"
        value={JSON.stringify(pattern)}
        onChange={(e) => handleLoadPattern(JSON.parse(e.target.value))}
      />
    </div>
  );
}
