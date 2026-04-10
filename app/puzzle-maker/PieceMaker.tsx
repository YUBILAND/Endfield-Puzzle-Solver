"use client";
import { useState } from "react";
import { PieceGrid } from "./_components/PieceGrid";

function PieceMaker({
  gridSize,
  onDone,
}: {
  gridSize: { rows: number; cols: number };
  onDone: (availablePieces: number[][][]) => void;
}) {
  const [availablePieces, setAvailablePieces] = useState<number[][][]>([]);

  return (
    <div className="flex flex-col items-center gap-y-4">
      <PieceGrid
        gridSize={gridSize}
        availablePieces={availablePieces}
        setAvailablePieces={setAvailablePieces}
      />
      <button
        onClick={() => onDone(availablePieces)}
        disabled={availablePieces.length === 0}
        className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}

export default PieceMaker;
