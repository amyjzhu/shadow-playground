
import React, { useState } from "react";
import Pixel from "./Pixel";
import { RAISED, FLAT } from "./constants";

export default function ViewEditor(props) {
    const { pattern, updatePixelSpecific, selectedColour, direction, title } = props;
    let [isMouseDown, setMouseDown] = useState(false);
    let rotated = [...Array(pattern.length)].map(x => [...Array(pattern[0].length)]);
    let order = generateOrder(direction);
    let view = calculateView(order, pattern);

    let rules = [];
    populateRules();
    let cycle = 0;


    function generateOrder(direction) {
        // 0 1 2 3
        // 4 5 6 7
        // 8 9 10 11

        let order = [];
        let height = pattern.length;
        let width = pattern[0].length; 
        // reorder the viewed
        if (direction == 0) {
            // from the south
            for (let i = height - 1; i >= 0; i--) {
                let curr_row = [];
                for (let j = 0; j < width; j++) {
                    curr_row.push([i,j]);
                }
                order.push(curr_row);
            }
        } else if (direction == 1) {
            // from the west side
            for (let j = 0; j < width; j++) {  
                let curr_row = [];  
                for (let i = 0; i < height; i++) {
                    curr_row.push([i, j]);
                }
                order.push(curr_row);
            }
        } else if (direction == 2) {
            // from north side
            for (let i = 0; i < height; i++) {
                let curr_row = [];
                for (let j = width - 1; j >= 0; j--) {
                    curr_row.push([i,j]);
                }
                order.push(curr_row);
            }
            
        } else if (direction == 3) {
            // from east side
            // 3 7 11
            
            for (let j = width - 1; j >= 0; j--) {
                let curr_row = [];
                for (let i = height - 1; i >= 0; i--) {
                    curr_row.push([i,j]);
                }
                order.push(curr_row);
            }
        }

        order.reverse();
        return order;
    }

    function calculateView(order, _pattern) {

        let height = order.length;
        let width = order[0].length;
        
        let pattern_r = _pattern;
        pattern_r.reverse();
        
        
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let order_elt = order[i][j];
                rotated[i][j] = pattern[order_elt[0]][order_elt[1]];
                // if (direction == 1) {
                    // console.log(i + ", " + j + " grabbing from " + order_elt[0] + ", " + order_elt[1]);
                // }
            }
        }
        // console.log(rotated);
        // rotated.reverse();
        // we should start by properly reorienting each piece...


        let view = JSON.parse(JSON.stringify(rotated));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                // the original location of the pixel
                // console.log(order[i1][j1]);
                // now, if it's raised, fill this one and the next one
                // it should overwrite by itself 
                if (rotated[i][j].type == RAISED) {
                    view[i][j].type = RAISED;
                    view[i][j].type = rotated[i][j].color;
                    // if (i + 1 < height) {
                    if (i - 1 >= 0) {
                        // view[i-1][j].type = RAISED;
                        view[i-1][j].color = rotated[i][j].color;
                    }
                }
            }

        }

        return view;
    }

    // okay, now how do we decompile a pattern?
    // step 1 is to add a flat row after each row in the pattern
    function decompile_image_to_pattern(image) {
        let width = image[0].length;
        let base_pattern = image.reduce((acc, r) => { acc.push(r); acc.push([...Array(width)]); return acc }, []);
        // just make this every other 
        return base_pattern;
    }

    function populateRules() {
        
        let doNothing = (prev_row, prev_col, row, col, pattern, desired) => {};
        rules.push({
            pred: (prev_row, prev_col, row, col, pattern, desired) => {
                if (pattern[row][col].color == desired) {
                    return pattern[row][col].type == RAISED;
                }
            },
            action: doNothing,
        });

        rules.push({
            pred: (prev_row, prev_col, row, col, pattern, desired) => {
                if (pattern[row][col].color == desired) {
                    return !pattern[row][col].type == RAISED;
                }
            },
            action: (prev_row, prev_col, row, col, pattern, desired) => {
                updatePixelSpecific(row, col, RAISED);
            },
        });

        rules.push({
            pred: (prev_row, prev_col, row, col, pattern, desired) => {
                if (pattern[prev_row][prev_col].color == desired) {
                    return !pattern[row][col].type == RAISED;
                }
            },
            action: (prev_row, prev_col, row, col, pattern, desired) => {
                updatePixelSpecific(prev_row[0], prev_row[1], RAISED);
            },
        });

        rules.push({
            pred: (prev_row, prev_col, row, col, pattern, desired) => {
                return (pattern[prev_row][prev_col].color !== desired
                    && pattern[row][col].color !== desired);
            },
            action: (prev_row, prev_col, row, col, pattern, desired) => {
                updatePixelSpecific(row, col, RAISED, desired);
            },
        });
    }

    function modify_pixel(i, j, desired) {
        // TODO need to account for "reversed"? no... Idk
        let width = pattern[0].length;
        let height = pattern.length;
        
        let row = order.findIndex(x => x.some(ele => ele[0] == i && ele[1] == j));
        let col = order[row].findIndex(ele => ele[0] == i && ele[1] == j);
        // let row = height - rev_row;
        // is this necessary because row is already flip-adjusted or something?
        // 0 col should be same for both
        // col = width - col;
        
        // let row = j;
        // let col = i;

        if (row === -1 || col === -1) {
            console.log(`failed to find ${i}, ${j}`);
            console.log(order);
            return;
        }

        console.log(`used ${i}, ${j} to find ${row}, ${col}`);
        // let row = order[i][j][0];
        // let col = order[i][j][1];

        // we wanted to modify i, j 
        // but what does that correspond to on the 
        // follow this series of instructions 
// 0. Raised pixel is correct colour. No action needed.
// 1. Flat pixel is correct colour. Raise the flat pixel.
// 2. Flat pixel is correct colour. Flatten the pixel in front. (same as above, but maybe difference can help avoid future conflict. E.g. if you apply 1 and 2 to adjacent pixels, you’ve messed up)
// 3. Flat pixel is incorrect colour. Front pixel is correct colour. Flatten flat pixel and raise front pixel.
// 4. Flat pixel is incorrect colour and front pixel is incorrect colour. Change colour of one of them and apply one of 0-3. (Can’t keep both lowered – then both are visible)

// TODO: this is a simplified view of the above.
// 0. raised pixel is correct
// 1. flat pixel is correct, raise. 
// 2. front pixel is correct. flatten current, raise front
// 3. both incorrect. change flat and rise.
// supply correct prev row given view 

        
        let prev_row;
        if (direction == 0) {
            if (row - 1 >= 0) {
                prev_row = [row - 1,col];
            }
        } else if (direction == 1) {
            row = height - row - 1;
            col = width - col - 1;
            if (col - 1 >= 0) {
                prev_row = [row, col - 1];
            }
        } else if (direction == 2) {
            if (row + 1 < height) {
                prev_row = [row + 1, col];
            }
        } else if (direction == 3) {
            // why?? do we need to do this for east and west and not n/s?
            // I guess that it has to do with the fact that rows are reversed
            // and that the varying direction must be reversed, so it's cancelled out for n/s
            // but e/w doesn't reverse cols, and also doesn't reverse rows... 
            row = height - row - 1;
            col = width - col - 1;
            if (col + 1 < width) {
                prev_row = [row, col+1];
            }
        } else {
            prev_row = undefined
        }
        // when rules get updated, cycle does also. 

        let in_cycle = 0;
        for (let rule of rules) {
            if (rule.pred(prev_row[0], prev_row[1], row, col, pattern, desired)) {
                console.log("trying rule, cycle is " + in_cycle);
                if (in_cycle == cycle) {
                    rule.action(prev_row[0], prev_row[1], row, col, pattern, desired)
                } else {
                    in_cycle++;
                }
            }
        }

/*
        if (prev_row != undefined) {
            let pixel = pattern[row][col].color;
            if (pixel == desired) {
                if (pattern[row][col].type == RAISED) {
                    // no action needed
                    // alternative: make sure pixel in front is lowered 
                } else {
                    // raise the flat pixel 
                    pattern[row][col].type = RAISED;
                    updatePixelSpecific(row, col, RAISED);
                }
                // option 1: raise the desired pixel
                // option 2: flatten the desired pixel and the pixel in front
            } else if (pattern[prev_row[0], prev_row[1]].color == selectedColour) { 
                // pixel in front is the correct colour
                // 
                pattern[row][col].type = FLAT;
                pattern[prev_row[0], prev_row[1]].type = RAISED;
                updatePixelSpecific(row, col, RAISED);
                updatePixelSpecific(prev_row[0], prev_row[1], RAISED);
            } else {
                // we must sacrifice
                pattern[row][col].color = desired;
                pattern[row][col].type = RAISED;
                updatePixelSpecific(row, col, RAISED, desired);
                // try making some kind of naive/basic loop that uses simple heuristic order
                // which image to put down first?
                // what about considering the constraints on the other views?

                // actions:
                // 1. quantify and understand impact of cases
                // 2. try looping over the image and inputs e.g. 10x 
                // ILP comparison (look at the cost) with GA 
                // 3. look through different options (cycle on click)
                // 3.5 editing the heuristic on the UI
                // 4. Do this but think about other views (in theory)
            }
        } // todo: do something smarter with edges... 
        else {
            // we must sacrifice
            pattern[row][col].color = desired;

            // let's try just keeping it lowered and lowering the front one 
            // pattern[row][col].type = FLAT;
            // pattern[prev_row[0], prev_row[1]].type = FLAT;
            updatePixelSpecific(row, col, FLAT, desired);
            updatePixelSpecific(prev_row[0], prev_row[1], FLAT, desired);
            console.log("keeping it flat at " + row, + ", " + col);
        }*/
    }


    return (
        <div
            style={{ overflow: "scroll" }}
            className="editor"
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
        >
            <h2>{title}</h2>
            <div className="drawingPanel">
                <div className="pixels">
                    {pattern.map((row, i) => (
                        <div className="row" key={i}>
                            {row.map((pixel, j) => (
                                <Pixel
                                    // color={view[i][j].color}
                                    // stitchType={view[i][j].type}
                                    color={view[i][j].color}
                                    stitchType={view[i][j].type}
                                    key={j}
                                    onChange={() => modify_pixel(i, j)}
                                    isMouseDown={isMouseDown}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// function generateOrder(direction) {
//     // 8 9 10 11
//     // 4 5 6 7
//     // 0 1 2 3 

//     let order = [];
//     let height = pattern.length;
//     let width = pattern[0].length; 
//     // reorder the viewed
//     if (direction == 0) {
//         // from the bottom
//         for (let i = 0; i < height; i++) {
//             let curr_row = [];
//             for (let j = 0; j < width; j++) {
//                 curr_row.push([i,j]);
//             }
//             order.push(curr_row);
//         }
//     } else if (direction == 1) {
//         // from the west side
//         // start with top 
//         for (let j = 0; j < width; j++) {  
//             let curr_row = [];  
//             for (let i = height - 1; i >= 0; i--) {
//                 curr_row.push([i, j]);
//             }
//             order.push(curr_row);
//         }
//     } else if (direction == 2) {
//         // from north side
//         // start with 8...11
//         // 11 is first then subtract 
//         for (let i = height - 1; i >= 0; i--) {
//             let curr_row = [];
//             for (let j = width - 1; j >= 0; j--) {
//                 curr_row.push([i,j]);
//             }
//             order.push(curr_row);
//         }
//     } else if (direction == 3) {
//         // from east side
//         // 3 7 11
        
//         for (let j = width - 1; j >= 0; j--) {
//             let curr_row = [];
//             for (let i = 0; i < height; i++) {
//                 curr_row.push([i,j]);
//             }
//             order.push(curr_row);
//         }
//     }

//     return order;
// }