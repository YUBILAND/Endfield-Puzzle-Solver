"use client";

import { ex1_pieces, ex1_tiling } from "@/lib/puzzleData";
import { solvePuzzle } from "@/lib/puzzleSolver";
import { useEffect, useState } from "react";

export default function Home() {
  const currentTiling = ex1_tiling;
  const currentPieces = ex1_pieces;

  const [solved, setSolved] = useState<boolean | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [pieceLocations, setPieceLocations] = useState<
    { piece: number[][]; cells: [number, number][] }[]
  >([]);

  const addPieceLocation = (location: {
    piece: number[][];
    cells: [number, number][];
  }) => {
    setPieceLocations((prev) => [...prev, location]);
  };
  const removePieceLocation = (location: {
    piece: number[][];
    cells: [number, number][];
  }) => {
    setPieceLocations((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (solved) {
      console.log("Piece locations:", pieceLocations);
    }
  }, [solved, pieceLocations]);

  const handleSolvePuzzle = () => {
    const start = performance.now();
    const result = solvePuzzle({
      tiling: currentTiling,
      pieces: currentPieces,
      addPieceLocation,
      removePieceLocation,
    });
    setElapsedMs(performance.now() - start);
    if (result) {
      console.log("Puzzle solved");
      setSolved(true);
    } else {
      console.log("No solution found");
      setSolved(false);
    }
  };

  const handleClearPuzzle = () => {
    setPieceLocations([]);
    setSolved(null);
    setElapsedMs(null);
  };

  return (
    <div className="flex flex-row flex-1 min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col basis-3/5 items-center justify-center">
        {/* Puzzle Grid */}
        {currentTiling.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const matchedPiece = pieceLocations.find(({ cells }) =>
                cells.some(([r, c]) => r === rowIndex && c === colIndex),
              );
              const inPiece = solved && !!matchedPiece;
              const cells = matchedPiece?.cells ?? [];
              const has = (dr: number, dc: number) =>
                cells.some(
                  ([r, c]) => r === rowIndex + dr && c === colIndex + dc,
                );

              // Neighboring cells
              const nLeft = has(0, -1);
              const nRight = has(0, 1);
              const nTop = has(-1, 0); // row - 1 = top
              const nBottom = has(1, 0); // row + 1 = bottom

              // Diagonal neighboring cells
              const dTopLeft = has(-1, -1);
              const dTopRight = has(-1, 1);
              const dBottomLeft = has(1, -1);
              const dBottomRight = has(1, 1);

              return (
                <div
                  key={colIndex}
                  className={`relative w-16 h-16 border ${cell ? "bg-green-800" : "bg-transparent"}`}
                >
                  {inPiece && (
                    <>
                      {/* horizontal bar */}
                      <div
                        className={`absolute top-2 bottom-2 bg-green-400 ${nLeft ? "left-0" : "left-2"} ${nRight ? "right-0" : "right-2"}`}
                      />
                      {/* vertical bar */}
                      <div
                        className={`absolute left-2 right-2 bg-green-400 ${nTop ? "top-0" : "top-2"} ${nBottom ? "bottom-0" : "bottom-2"}`}
                      />
                      {/* corner fills — only when both orthogonal neighbors AND the diagonal exist */}
                      {nTop && nRight && dTopRight && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-400" />
                      )}
                      {nTop && nLeft && dTopLeft && (
                        <div className="absolute top-0 left-0 w-2 h-2 bg-green-400" />
                      )}
                      {nBottom && nRight && dBottomRight && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400" />
                      )}
                      {nBottom && nLeft && dBottomLeft && (
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-400" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="basis-2/5 bg-gray-600 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-8">
          {/* Right Side */}
          {/* Puzzle Pieces */}
          {currentPieces.map((piece, pieceIndex) => (
            <div key={pieceIndex} className="border-2 p-8">
              {piece.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-16 h-16 border ${cell ? "bg-green-500" : "bg-transparent"}`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="absolute bottom-0 right-0 mb-4 mr-10 flex space-x-8">
            {elapsedMs !== null && <span>{elapsedMs.toFixed(2)}ms</span>}
            <button onClick={handleSolvePuzzle}>Solve</button>
            <button onClick={handleClearPuzzle}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
