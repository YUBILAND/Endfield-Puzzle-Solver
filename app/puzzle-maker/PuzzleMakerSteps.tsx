"use client";
import { useState } from "react";
import TickGrid from "./TickGrid";
import PieceMaker from "./PieceMaker";
import ColorSelection from "./_components/ColorSelection";
import LockGrid from "./_components/LockGrid";

export default function PuzzleMakerSteps({
  gridSize,
  currentStep,
  onNextStep,
  blockedCells,
  gridTics,
  handleClickBar,
  onClickBlockCell,
}: {
  gridSize: { rows: number; cols: number };
  currentStep: number;
  onNextStep: () => void;
  blockedCells: number[][];
  gridTics: [number[], number[]];
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
  onClickBlockCell: (rowIndex: number, colIndex: number) => void;
}) {
  const [colors, setColors] = useState<string[]>([]);
  const [availablePieces, setAvailablePieces] = useState<number[][][]>([]);

  if (currentStep === 2) {
    return (
      <ColorSelection
        onDone={(c) => {
          setColors(c);
          onNextStep();
        }}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <LockGrid
        gridSize={gridSize}
        gridTics={gridTics}
        blockedCells={blockedCells}
        onClickBlockCell={onClickBlockCell}
        onDone={onNextStep}
      />
    );
  }

  if (currentStep === 4) {
    return (
      <TickGrid
        gridSize={gridSize}
        gridTics={gridTics}
        blockedCells={blockedCells}
        handleClickBar={handleClickBar}
        onDone={onNextStep}
      />
    );
  }

  if (currentStep === 5) {
    return (
      <PieceMaker
        gridSize={gridSize}
        onDone={(pieces) => {
          setAvailablePieces(pieces);
          onNextStep();
        }}
      />
    );
  }

  return <></>;
}
