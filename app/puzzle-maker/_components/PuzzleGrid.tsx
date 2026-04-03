import React from "react";
import { BarGroup } from "./BarGroup";

function PuzzleGrid({
  gridSize,
  gridTics,
  filledCells,
  pieceLocations,
  solved,
  handleClickBar,
  handleEraseBar,
  showBarTicks = { top: true, left: true },
}: {
  gridSize: { rows: number; cols: number };
  gridTics: [number[], number[]];
  filledCells: number[][];
  pieceLocations: { cells: [number, number][] }[];
  solved: boolean | null;
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
  handleEraseBar: (direction: "top" | "left", index: number) => void;
  showBarTicks?: {
    top?: boolean;
    left?: boolean;
  };
}) {
  return (
    <div className="flex flex-col gap-y-1">
      {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="relative flex gap-x-1 ">
          {showBarTicks.left && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-row gap-x-2 mr-4">
              <BarGroup
                barLocation="left"
                gridSize={gridSize}
                gridTics={gridTics[1]}
                rowColIndex={rowIndex}
                handleClickBar={handleClickBar}
                handleEraseBar={handleEraseBar}
              />
            </div>
          )}

          {Array.from({ length: gridSize.cols }).map((_, colIndex) => {
            return (
              <div
                key={colIndex}
                className={`relative w-16 h-16 backdrop-blur-2xl ${filledCells?.[rowIndex]?.[colIndex] ? "bg-green-800" : "bg-transparent"}`}
              >
                <CellMarkings />
                {/* Avoid looping every row for top bars */}
                {rowIndex === 0 && (
                  <>
                    {showBarTicks.top && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 gap-2 flex flex-col">
                        <BarGroup
                          barLocation="top"
                          gridSize={gridSize}
                          gridTics={gridTics[0]}
                          rowColIndex={colIndex}
                          handleClickBar={handleClickBar}
                          handleEraseBar={handleEraseBar}
                        />
                      </div>
                    )}
                  </>
                )}

                {solved && (
                  <ShowSolution
                    pieceLocations={pieceLocations}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    solved={solved}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
const ShowSolution = ({
  pieceLocations,
  rowIndex,
  colIndex,
  solved,
}: {
  pieceLocations: { cells: [number, number][] }[];
  rowIndex: number;
  colIndex: number;
  solved: boolean | null;
}) => {
  const matchedPiece = pieceLocations.find(({ cells }) =>
    cells.some(([r, c]) => r === rowIndex && c === colIndex),
  );
  const inPiece = solved && !!matchedPiece;
  const cells = matchedPiece?.cells ?? [];
  const has = (dr: number, dc: number) =>
    cells.some(([r, c]) => r === rowIndex + dr && c === colIndex + dc);

  // Neighboring cells
  const nLeft = has(0, -1);
  const nRight = has(0, 1);
  const nTop = has(-1, 0); // row - 1 = top
  const nBottom = has(1, 0); // row + 1 = bottom

  // Diagonal neighboring cells
  const dTopLeft = has(-1, -1);
  const dTopRight = has(-1, 1);
  const dBottomLeft = has(1, -1);
  const dBottomRight = has(1, 1);
  return (
    <>
      {inPiece && (
        <>
          {/* horizontal bar */}
          <div
            className={`absolute top-2 bottom-2 bg-green-400 ${nLeft ? "left-0" : "left-2"} ${nRight ? "right-0" : "right-2"}`}
          />
          {/* vertical bar */}
          <div
            className={`absolute left-2 right-2 bg-green-400 ${nTop ? "top-0" : "top-2"} ${nBottom ? "bottom-0" : "bottom-2"}`}
          />
          {/* corner fills — only when both orthogonal neighbors AND the diagonal exist */}
          {nTop && nRight && dTopRight && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-400" />
          )}
          {nTop && nLeft && dTopLeft && (
            <div className="absolute top-0 left-0 w-2 h-2 bg-green-400" />
          )}
          {nBottom && nRight && dBottomRight && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400" />
          )}
          {nBottom && nLeft && dBottomLeft && (
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-400" />
          )}
        </>
      )}
    </>
  );
};

const CellMarkings = () => {
  return (
    <>
      <div className="w-1 h-1 bg-white/50 absolute inset-0 m-auto rounded-full " />
      <div className="w-6 h-1 bg-white/50 absolute top-1/4 left-1/4 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
      <div className="w-6 h-1 bg-white/50 absolute top-1/4 right-1/4 rounded-full translate-x-1/2 -translate-y-1/2 rotate-135" />
      <div className="w-6 h-1 bg-white/50 absolute bottom-1/4 left-1/4 rounded-full -translate-x-1/2 translate-y-1/2 rotate-135" />
      <div className="w-6 h-1 bg-white/50 absolute bottom-1/4 right-1/4 rounded-full translate-x-1/2 translate-y-1/2 rotate-45" />
    </>
  );
};

export default PuzzleGrid;
