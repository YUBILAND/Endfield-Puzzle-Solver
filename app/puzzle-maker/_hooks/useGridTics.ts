import { useState } from "react";

export function useGridTics(gridSize: { rows: number; cols: number }) {
  const [gridTics, setGridTics] = useState<[number[], number[]]>([
    Array.from({ length: gridSize!.cols }, () => 0),
    Array.from({ length: gridSize!.rows }, () => 0),
  ]);
  const handleClickBar = (
    position: "top" | "left",
    rowIndex: number,
    colIndex: number,
    index: number,
  ) => {
    if (!gridTics) return;
    const newGridTics = [...gridTics] as [number[], number[]];

    if (position === "top") {
      newGridTics[0][colIndex] = index + 1;
    } else if (position === "left") {
      newGridTics[1][rowIndex] = index + 1;
    }
    setGridTics(newGridTics);
    // console.log(newGridTics);
    // console.log("clicked row", rowIndex, "col", colIndex, " for index", index);
  };
  const handleEraseBar = (position: "top" | "left", index: number) => {
    if (!gridTics) return;
    const newGridTics = [...gridTics] as [number[], number[]];
    if (position === "top") {
      newGridTics[0][index] = 0;
    } else if (position === "left") {
      newGridTics[1][index] = 0;
    }
    setGridTics(newGridTics);
  };

  return { gridTics, handleClickBar, handleEraseBar };
}
