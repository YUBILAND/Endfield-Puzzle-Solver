import { solveHardPuzzle } from "@/lib/hardPuzzleSolver";
import { ex1_pieces } from "@/lib/puzzleData";
import { useEffect, useState } from "react";
import { usePieceLocations } from "./usePieceLocations";

export function useSolved({
  gridSize,
  currentPieces,
}: {
  gridSize: { rows: number; cols: number };
  currentPieces: any[];
}) {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const [solved, setSolved] = useState<boolean | null>(null);

  const [filledCells, setFilledCells] = useState<number[][] | null>(null);

  const emptyGrid = Array.from({ length: gridSize?.rows ?? 0 }, () =>
    Array.from({ length: gridSize?.cols ?? 0 }, () => 0),
  );
  const handleSolvePuzzle = () => {
    const start = performance.now();
    const result = solveHardPuzzle({
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
      setFilledCells(emptyGrid); //Empty grid is mutated with correct solution. Save to state to store solution.
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

  return { solved, elapsedMs, pieceLocations, filledCells, handleSolvePuzzle };
}
