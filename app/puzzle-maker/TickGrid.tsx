"use client";
import { useState } from "react";
import PuzzleGrid from "./_components/PuzzleGrid";
import { useSolved } from "./_hooks/useSolved";

function TickGrid({
  gridSize,
  gridTics,
  blockedCells,
  handleClickBar,
  onDone,
}: {
  gridSize: { rows: number; cols: number };
  gridTics: [number[], number[]];
  blockedCells: number[][];
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
  onDone: () => void;
}) {
  const [availablePieces, setAvailablePieces] = useState<number[][][]>([]);

  const {
    solved,
    elapsedMs,
    pieceLocations,
    filledCells,
    handleSolvePuzzle,
    handleClearPuzzle,
  } = useSolved({
    gridSize: gridSize!,
    availablePieces,
    gridTics,
    blockedCells,
  });
  return (
    <>
      <PuzzleGrid
        gridSize={gridSize}
        gridTics={gridTics}
        blockedCells={blockedCells}
        handleClickBar={handleClickBar}
        mode="tick"
      />
      {/* <PuzzleGrid
        gridSize={gridSize}
        gridTics={gridTics}
        filledCells={filledCells!}
        pieceLocations={pieceLocations}
        solved={solved}
        blockedCells={blockedCells}
        handleClickBar={handleClickBar}
        mode="tick"
      /> */}
      {/* <div className="flex flex-col basis-1/5 ">
        {gridSize && (
          <PieceGrid
            gridSize={gridSize}
            availablePieces={availablePieces}
            setAvailablePieces={setAvailablePieces}
          />
        )}
      </div> */}

      {/* <div className="relative flex justify-center items-center gap-x-8">
        <div className="cursor-pointer" onClick={() => handleSolvePuzzle()}>
          Solve Puzzle
        </div>
        <div className="cursor-pointer" onClick={() => handleClearPuzzle()}>
          Clear Puzzle
        </div>
      </div> */}

      <button
        onClick={() => onDone()}
        className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Done
      </button>
    </>
  );
}

export default TickGrid;
