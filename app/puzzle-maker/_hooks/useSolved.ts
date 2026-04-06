import { solveHardPuzzle } from "@/lib/hardPuzzleSolver";
import { ex1_pieces } from "@/lib/puzzleData";
import { useEffect, useState } from "react";
import { usePieceLocations } from "./usePieceLocations";

export function useSolved({
  gridSize,
  availablePieces,
  gridTics,
}: {
  gridSize: { rows: number; cols: number };
  availablePieces: number[][][];
  gridTics: [number[], number[]];
}) {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const [solved, setSolved] = useState<boolean | null>(null);

  const [filledCells, setFilledCells] = useState<number[][] | null>(null);

  const handleSolvePuzzle = () => {
    const baseEmptyGrid = Array.from({ length: gridSize?.rows ?? 0 }, () =>
      Array.from({ length: gridSize?.cols ?? 0 }, () => 0),
    );
    const baseBarTics = [
      Array.from({ length: gridSize?.cols ?? 0 }, () => 0),
      Array.from({ length: gridSize?.rows ?? 0 }, () => 0),
    ];
    const start = performance.now();
    const result = solveHardPuzzle({
      emptyGrid: baseEmptyGrid,
      barTick: baseBarTics,
      userTick: gridTics,
      pieces: availablePieces,
      addPieceLocation,
      removePieceLocation,
    });
    setElapsedMs(performance.now() - start);
    if (result) {
      console.log("Puzzle solved");
      setSolved(true);
      setFilledCells(baseEmptyGrid); //Empty grid is mutated with correct solution. Save to state to store solution.
    } else {
      console.log("No solution found");
      setSolved(false);
    }
  };
  useEffect(() => {
    if (solved) {
      console.table(filledCells);
    }
  }, [solved]);

  const { pieceLocations, addPieceLocation, removePieceLocation } =
    usePieceLocations(gridSize);

  const handleClearPuzzle = () => {
    setSolved(null);
    setFilledCells(null);
    setElapsedMs(null);
    pieceLocations.forEach((location) => removePieceLocation(location));
  };

  return {
    solved,
    elapsedMs,
    pieceLocations,
    filledCells,
    handleSolvePuzzle,
    handleClearPuzzle,
  };
}
