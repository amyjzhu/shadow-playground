export const HEIGHT = 10;
export const WIDTH = 10;

export const RAISED = 1;
export const FLAT = 0;

export const WHITE = "#ffffff";
export const GRAY = "#cccccc";
export const BLACK = "#000000";

export const DIRECTION = {
  TOP: "TOP",
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
};

export const DEFAULT_STITCH = { colour: GRAY, type: FLAT };

const RED = "#d70e17";
const YELLOW = "#f0be39";
const GREEN = "#359d73";
const BLUE = "#1887ab";

export const COLOR_MAP = {
  [DIRECTION.TOP]: {
    TOP: RED,
    LEFT: YELLOW,
    BOTTOM: GREEN,
    RIGHT: BLUE,
  },
  [DIRECTION.NORTH]: {
    TOP: GREEN,
    LEFT: BLUE,
    BOTTOM: RED,
    RIGHT: YELLOW,
  },
  [DIRECTION.SOUTH]: {
    TOP: RED,
    LEFT: YELLOW,
    BOTTOM: GREEN,
    RIGHT: BLUE,
  },
  [DIRECTION.EAST]: {
    TOP: YELLOW,
    LEFT: GREEN,
    BOTTOM: BLUE,
    RIGHT: RED,
  },
  [DIRECTION.WEST]: {
    TOP: BLUE,
    LEFT: RED,
    BOTTOM: YELLOW,
    RIGHT: GREEN,
  },
};
