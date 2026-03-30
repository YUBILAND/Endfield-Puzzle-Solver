"use client";
import React, { useEffect, useState } from "react";
import { ex1_pieces, ex1_tiling } from "@/lib/puzzleData";
import { GridSelect } from "react-grid-select";
import { Trash } from "lucide-react";
import { solvePuzzle } from "@/lib/hardPuzzleSolver";
function PuzzleMaker() {
  const currentTiling = ex1_tiling;
  const currentPieces = ex1_pieces;

  const [gridSize, setGridSize] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const [selectedArea, setSelectedArea] = useState({
    width: null,
    height: null,
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleDone = () => {
    setGridSize({
      rows: selectedArea.height!,
      cols: selectedArea.width!,
    });
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const [filledCells, setFilledCells] = useState<boolean[][] | null>(null);

  const [gridTics, setGridTics] = useState<[number[], number[]] | null>(null);

  useEffect(() => {
    step === 2 &&
      setGridTics([
        Array.from({ length: gridSize!.cols }, () => 0),
        Array.from({ length: gridSize!.rows }, () => 0),
      ]);
  }, [step, gridSize]);

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
    console.log(newGridTics);
    console.log("clicked row", rowIndex, "col", colIndex, " for index", index);
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

  const sizeStage = step === 1;

  const barStage = step === 2 && gridSize && gridTics;

  const calculateFillCells = () => {
    if (!gridSize || !gridTics) return;

    console.log(gridTics[0]);
    console.log(gridTics[1]);
  };

  const [solved, setSolved] = useState<boolean | null>(null);

  const emptyGrid = Array.from({ length: gridSize?.rows ?? 0 }, () =>
    Array.from({ length: gridSize?.cols ?? 0 }, () => 0),
  );

  const [pieceLocations, setPieceLocations] = useState<
    { piece: number[][]; cells: [number, number][] }[]
  >([]);
  const addPieceLocation = (location: {
    piece: number[][];
    cells: [number, number][];
  }) => {
    setPieceLocations((prev) => [...prev, location]);
  };
  const removePieceLocation = (location: {
    piece: number[][];
    cells: [number, number][];
  }) => {
    setPieceLocations((prev) => prev.slice(0, -1));
  };

  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const handleSolvePuzzle = () => {
    const start = performance.now();
    const result = solvePuzzle({
      emptyGrid: emptyGrid,
      barTick: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      userTick: [
        [5, 4, 3, 2, 1],
        [5, 4, 3, 2, 1],
      ],
      pieces: currentPieces,
      addPieceLocation,
      removePieceLocation,
    });
    setElapsedMs(performance.now() - start);
    if (result) {
      console.log("Puzzle solved");
      setSolved(true);
      console.table(emptyGrid);
    } else {
      console.log("No solution found");
      setSolved(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex flex-col basis-3/5 items-center justify-center">
        <div>
          {sizeStage ? (
            <div>
              <div>Select Grid Size</div>

              <div>
                {selectedArea.width} x {selectedArea.height}
              </div>
              <GridSelect
                cols={5}
                rows={5}
                onRegionUpdate={setSelectedArea}
                styles={{
                  active: {
                    background: "#1d7d28",
                    border: "1px solid #1d7d28",
                  },
                  hover: { background: "#2eb83e", border: undefined },
                }}
              />
            </div>
          ) : barStage ? (
            <div className="relative">
              <PuzzleGrid
                gridSize={gridSize}
                gridTics={gridTics}
                filledCells={filledCells!}
                handleClickBar={handleClickBar}
                handleEraseBar={handleEraseBar}
              />
              <div onClick={() => handleSolvePuzzle()}>Solve Puzzle</div>
            </div>
          ) : (
            <div>Step 3 Content</div>
          )}
          <button onClick={() => handleDone()}>Done</button>
          {barStage && (
            <button onClick={() => calculateFillCells()}>Calculate</button>
          )}
        </div>
        <div>Add Pieces</div>
        <div>
          <div className="grid grid-cols-2 gap-8 place-items-center ">
            {/* Right Side */}
            {gridSize && <CellGrid gridSize={gridSize} />}
            {/* Puzzle Pieces */}
            {/* {currentPieces.map((piece, pieceIndex) => (
              <div key={pieceIndex} className="border-2 p-8 ">
                {piece.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className={`w-8 h-8  ${cell ? "bg-green-500 border" : "bg-transparent"}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

const CellGrid = ({
  gridSize,
}: {
  gridSize: { rows: number; cols: number };
}) => {
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 gap-1">
          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div key={colIndex} className="w-8 h-8 border" />
          ))}
        </div>
      ))}
    </div>
  );
};

const TopBarGroup = ({
  gridSize,
  colIndex,
  rowIndex,
  gridTics,
  handleClickBar,
  handleEraseBar,
}: {
  gridSize: { rows: number; cols: number };
  colIndex: number;
  rowIndex: number;
  gridTics: [number[], number[]];
  handleClickBar: (
    position: "top" | "left",
    rowIndex: number,
    colIndex: number,
    index: number,
  ) => void;
  handleEraseBar: (position: "top" | "left", index: number) => void;
}) => {
  return (
    <>
      {Array.from(
        { length: gridSize!.rows },
        (_, i) => gridSize!.rows - 1 - i,
      ).map((barIndex) => (
        <HorizontalBars
          key={barIndex}
          barIndex={barIndex}
          colIndex={colIndex}
          onClick={() => handleClickBar("top", rowIndex, colIndex, barIndex)}
          topGridTics={gridTics[0]}
        />
      ))}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 cursor-pointer"
        onClick={() => handleEraseBar("top", colIndex)}
      >
        {gridTics[0][colIndex] > 0 && (
          <div className="w-6 h-2 border-2 border-red-400 rounded-2xl" />
        )}
      </div>
    </>
  );
};

const LeftBarGroup = ({
  gridSize,
  rowIndex,
  gridTics,
  handleClickBar,
  handleEraseBar,
}: {
  gridSize: { rows: number; cols: number };
  rowIndex: number;
  gridTics: [number[], number[]];
  handleClickBar: (
    position: "top" | "left",
    rowIndex: number,
    colIndex: number,
    index: number,
  ) => void;
  handleEraseBar: (position: "top" | "left", index: number) => void;
}) => {
  return (
    <>
      {Array.from(
        { length: gridSize.cols },
        (_, i) => gridSize!.cols - 1 - i,
      ).map((colIndex) => (
        <VerticalBars
          key={colIndex}
          barIndex={colIndex}
          rowIndex={rowIndex}
          leftGridTics={gridTics[1]}
          onClick={() => handleClickBar("left", rowIndex, colIndex, colIndex)}
        />
      ))}
      <div
        className="absolute left-full top-1/2 -translate-y-1/2 ml-1 cursor-pointer"
        onClick={() => handleEraseBar("left", rowIndex)}
      >
        {gridTics[1][rowIndex] > 0 && (
          <div className="w-2 h-6 border-2 border-red-400 rounded-2xl" />
        )}
      </div>
    </>
  );
};

const PuzzleGrid = ({
  gridSize,
  gridTics,
  filledCells,
  handleClickBar,
  handleEraseBar,
  hideBars = { top: false, left: false },
}: {
  gridSize: { rows: number; cols: number };
  gridTics: [number[], number[]];
  filledCells: boolean[][];
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
  handleEraseBar: (direction: "top" | "left", index: number) => void;
  hideBars?: {
    top?: boolean;
    left?: boolean;
  };
}) => {
  return Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
    <div key={rowIndex} className="relative flex">
      {!hideBars.left && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-row gap-x-2 mr-4">
          <LeftBarGroup
            gridSize={gridSize}
            rowIndex={rowIndex}
            gridTics={gridTics}
            handleClickBar={handleClickBar}
            handleEraseBar={handleEraseBar}
          />
        </div>
      )}

      {Array.from({ length: gridSize.cols }).map((_, colIndex) => {
        return (
          <div
            key={colIndex}
            className={`relative w-16 h-16 border ${filledCells?.[rowIndex]?.[colIndex] ? "bg-green-800" : "bg-transparent"}`}
          >
            {rowIndex === 0 && (
              <>
                {!hideBars.top && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 gap-2 flex flex-col">
                    <TopBarGroup
                      gridSize={gridSize}
                      colIndex={colIndex}
                      rowIndex={rowIndex}
                      gridTics={gridTics}
                      handleClickBar={handleClickBar}
                      handleEraseBar={handleEraseBar}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  ));
};
const VerticalBars = ({
  onClick,
  leftGridTics,
  barIndex,
  rowIndex,
}: {
  onClick: () => void;
  leftGridTics: number[] | null;
  barIndex: number;
  rowIndex: number;
}) => {
  return (
    <div
      onClick={() => onClick()}
      className={`peer w-4 h-10 border-3 border-white rounded-lg opacity-50 cursor-pointer hover:bg-green-600 hover:opacity-100 [&:hover~.peer]:bg-green-600 [&:hover~.peer]:opacity-100 ${
        leftGridTics && leftGridTics[rowIndex] >= barIndex + 1
          ? "bg-green-600 opacity-100"
          : ""
      }`}
    />
  );
};

const HorizontalBars = ({
  onClick,
  topGridTics,
  barIndex,
  colIndex,
}: {
  onClick: () => void;
  topGridTics: number[] | null;
  barIndex: number;
  colIndex: number;
}) => {
  return (
    <div
      onClick={() => onClick()}
      className={`peer w-10 h-4 border-3 border-white rounded-lg opacity-50 cursor-pointer hover:bg-green-600 hover:opacity-100 [&:hover~.peer]:bg-green-600 [&:hover~.peer]:opacity-100 ${
        topGridTics && topGridTics[colIndex] >= barIndex + 1
          ? "bg-green-600 opacity-100"
          : ""
      }`}
    />
  );
};

export default PuzzleMaker;
