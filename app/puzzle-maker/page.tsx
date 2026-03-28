"use client";
import React, { useState } from "react";
import { ex1_pieces, ex1_tiling } from "@/lib/puzzleData";
import { GridSelect } from "react-grid-select";
function PuzzleMaker() {
  const currentTiling = ex1_tiling;
  const currentPieces = ex1_pieces;

  const [gridSize, setGridSize] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const [selectedArea, setSelectedArea] = useState({
    width: null,
    height: null,
  });

  const handleDone = () => {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex flex-col basis-3/5 items-center justify-center">
        {!gridSize && (
          <div>
            <div>Select Grid Size</div>

            <div>
              {selectedArea.width} x {selectedArea.height}
            </div>
            <GridSelect
              cols={5}
              rows={5}
              onRegionUpdate={setSelectedArea}
              styles={{
                active: { background: "#1d7d28", border: "1px solid #1d7d28" },
                hover: { background: "#2eb83e", border: undefined },
              }}
            />
            <button onClick={() => handleDone}>Done</button>
          </div>
        )}

        {/* Puzzle Grid */}
        {/* {currentTiling.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              return (
                <div
                  key={colIndex}
                  className={`relative w-16 h-16 border ${cell ? "bg-green-800" : "bg-transparent"}`}
                ></div>
              );
            })}
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default PuzzleMaker;
