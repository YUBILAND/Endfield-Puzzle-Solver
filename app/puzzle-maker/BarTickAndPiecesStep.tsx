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

function BarTickAndPiecesStep({
  gridSize,
}: {
  gridSize: { rows: number; cols: number };
}) {
  const { gridTics, handleClickBar, handleEraseBar } = useGridTics(gridSize);
  const [availablePieces, setAvailablePieces] = useState<number[][][]>([]);

  const currentPieces = ex1_pieces;
  const { solved, elapsedMs, pieceLocations, filledCells, handleSolvePuzzle } =
    useSolved({
      gridSize,
      currentPieces,
    });

  return (
    <>
      <div className="flex flex-col gap-y-16 w-full px-6">
        <div className="flex flex-row w-full ">
          <div className="flex basis-4/5 items-center justify-center">
            <PuzzleGrid
              gridSize={gridSize}
              gridTics={gridTics}
              filledCells={filledCells!}
              pieceLocations={pieceLocations}
              solved={solved}
              handleClickBar={handleClickBar}
              handleEraseBar={handleEraseBar}
            />
          </div>
          <div className="flex flex-col basis-1/5 ">
            <PieceGrid
              gridSize={gridSize}
              availablePieces={availablePieces}
              setAvailablePieces={setAvailablePieces}
            />
          </div>
        </div>

        <div className="relative ">
          <div onClick={() => handleSolvePuzzle()}>Solve Puzzle</div>
        </div>
      </div>
    </>
  );
}

export default BarTickAndPiecesStep;
