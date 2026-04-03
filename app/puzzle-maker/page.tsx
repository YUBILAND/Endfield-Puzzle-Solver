"use client";
import React, { useEffect, useState } from "react";
import { ex1_pieces, ex1_tiling } from "@/lib/puzzleData";
import SizeStep from "./SizeStep";
import BarTickAndPiecesStep from "./BarTickAndPiecesStep";
function PuzzleMaker() {
  const currentTiling = ex1_tiling;
  const currentPieces = ex1_pieces;

  const [gridSize, setGridSize] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleStep1Done = (rows: number, cols: number) => {
    setGridSize({
      rows: rows,
      cols: cols,
    });
    setStep(2);
  };

  const sizeStage = step === 1;
  const barStage = step === 2 && gridSize;

  return (
    <div className="bg-[url('/endfield-logo.png')] bg-cover bg-center">
      <div className="flex flex-row items-center justify-center min-h-screen backdrop-blur-xl bg-black/50">
        {sizeStage ? (
          <SizeStep setGridSize={handleStep1Done} />
        ) : barStage ? (
          <BarTickAndPiecesStep gridSize={gridSize} />
        ) : (
          <div>Step 3 Content</div>
        )}
      </div>
    </div>
  );
}

export default PuzzleMaker;
