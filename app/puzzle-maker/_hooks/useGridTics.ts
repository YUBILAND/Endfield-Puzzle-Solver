import { useState } from "react";

export function useGridTics(
  gridSize: { rows: number; cols: number },
  blockedCells?: number[][],
) {
  const minTics: [number[], number[]] = blockedCells
    ? [
        Array.from({ length: gridSize.cols }, (_, col) =>
          blockedCells.reduce((sum, row) => sum + (row[col] ?? 0), 0),
        ),
        Array.from({ length: gridSize.rows }, (_, row) =>
          (blockedCells[row] ?? []).reduce((sum, cell) => sum + cell, 0),
        ),
      ]
    : [[], []];
  const [gridTics, setGridTics] = useState<[number[], number[]]>([
    Array.from({ length: gridSize!.cols }, () => 0),
    Array.from({ length: gridSize!.rows }, () => 0),
  ]);

  // console.log("gridtics in state is", gridTics);
  const handleClickBar = (
    position: "top" | "left",
    rowIndex: number,
    colIndex: number,
    index: number,
  ) => {
    if (!gridTics) return;
    const newGridTics = [...gridTics] as [number[], number[]];

    if (position === "top") {
      const min = minTics?.[0][colIndex] ?? 0;
      const current = gridTics[0][colIndex];
      newGridTics[0][colIndex] = current === index + 1 ? min : Math.max(min, index + 1);
    } else if (position === "left") {
      const min = minTics?.[1][rowIndex] ?? 0;
      const current = gridTics[1][rowIndex];
      newGridTics[1][rowIndex] = current === index + 1 ? min : Math.max(min, index + 1);
    }
    setGridTics(newGridTics);
    // console.log(newGridTics);
    // console.log("clicked row", rowIndex, "col", colIndex, " for index", index);
  };
  const handleEraseBar = (position: "top" | "left", index: number) => {
    if (!gridTics) return;
    const newGridTics = [...gridTics] as [number[], number[]];
    if (position === "top") {
      newGridTics[0][index] = minTics?.[0][index] ?? 0;
    } else if (position === "left") {
      newGridTics[1][index] = minTics?.[1][index] ?? 0;
    }
    setGridTics(newGridTics);
  };

  return { gridTics, handleClickBar, handleEraseBar, setGridTics };
}
