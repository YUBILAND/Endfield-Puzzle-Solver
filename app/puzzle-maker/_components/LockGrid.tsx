"use client";
import PuzzleGrid from "./PuzzleGrid";

function LockGrid({
  gridSize,
  gridTics,
  onDone,
  blockedCells,
  onClickBlockCell,
}: {
  gridSize: { rows: number; cols: number };
  gridTics: [number[], number[]];
  onDone: () => void;
  blockedCells: number[][];
  onClickBlockCell: (rowIndex: number, colIndex: number) => void;
}) {
  return (
    <>
      <PuzzleGrid
        gridSize={gridSize}
        gridTics={gridTics}
        blockedCells={blockedCells}
        onClickBlockCell={onClickBlockCell}
        mode="block"
      />

      <button
        onClick={() => onDone()}
        className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Done
      </button>
    </>
  );
}

export default LockGrid;
