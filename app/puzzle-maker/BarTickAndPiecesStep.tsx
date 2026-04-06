"use client";
import { solveHardPuzzle } from "@/lib/hardPuzzleSolver";
import { ex1_pieces } from "@/lib/puzzleData";
import React, { useEffect, useState } from "react";
import PuzzleGrid from "./_components/PuzzleGrid";
import { useGridTics } from "./_hooks/useGridTics";
import { usePieceLocations } from "./_hooks/usePieceLocations";
import { useSolved } from "./_hooks/useSolved";
import { usePieceEditor } from "./_hooks/usePieceEditor";
import { PieceGrid } from "./_components/PieceGrid";
import { GridSelect } from "react-grid-select";
import GridProperties from "./_components/GridProperties";

function BarTickAndPiecesStep() {
  const [gridSize, setGridSize] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const { gridTics, handleClickBar, handleEraseBar, setGridTics } = useGridTics(
    gridSize || { rows: 0, cols: 0 },
  );
  const [availablePieces, setAvailablePieces] = useState<number[][][]>([]);

  const {
    solved,
    elapsedMs,
    pieceLocations,
    filledCells,
    handleSolvePuzzle,
    handleClearPuzzle,
  } = useSolved({
    gridSize: gridSize || { rows: 0, cols: 0 },
    availablePieces,
    gridTics,
  });

  useEffect(() => {
    if (gridSize) {
      //Reset grid tics and pieces when grid size changes.
      setGridTics([
        Array.from({ length: gridSize.cols }, () => 0),
        Array.from({ length: gridSize.rows }, () => 0),
      ]);
      setAvailablePieces([]);
    }
  }, [gridSize]);

  return (
    <>
      <div className="flex flex-col gap-y-16 w-full px-6">
        <div className="flex flex-row w-full ">
          <div className="flex flex-col basis-1/5 items-center justify-center">
            <GridProperties
              setGridSize={(rows, cols) => setGridSize({ rows, cols })}
            />
          </div>
          <div className="flex basis-3/5 items-center justify-center">
            {gridSize && (
              <PuzzleGrid
                gridSize={gridSize}
                gridTics={gridTics}
                filledCells={filledCells!}
                pieceLocations={pieceLocations}
                solved={solved}
                handleClickBar={handleClickBar}
                handleEraseBar={handleEraseBar}
              />
            )}
          </div>
          <div className="flex flex-col basis-1/5 ">
            {gridSize && (
              <PieceGrid
                gridSize={gridSize}
                availablePieces={availablePieces}
                setAvailablePieces={setAvailablePieces}
              />
            )}
          </div>
        </div>

        <div className="relative flex justify-center items-center gap-x-8">
          <div className="cursor-pointer" onClick={() => handleSolvePuzzle()}>
            Solve Puzzle
          </div>
          <div className="cursor-pointer" onClick={() => handleClearPuzzle()}>
            Clear Puzzle
          </div>
        </div>
      </div>
    </>
  );
}

export default BarTickAndPiecesStep;
