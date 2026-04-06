"use client";
import BarTickAndPiecesStep from "./BarTickAndPiecesStep";
function PuzzleMaker() {
  return (
    <div className="bg-[url('/endfield-logo.png')] bg-cover bg-center">
      <div className="flex flex-row items-center justify-center min-h-screen backdrop-blur-xl bg-black/50">
        <BarTickAndPiecesStep />
      </div>
    </div>
  );
}

export default PuzzleMaker;
