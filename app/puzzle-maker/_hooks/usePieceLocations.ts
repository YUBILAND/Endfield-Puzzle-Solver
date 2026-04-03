import { useState } from "react";

export function usePieceLocations(gridSize: { rows: number; cols: number }) {
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

  return { pieceLocations, addPieceLocation, removePieceLocation };
}
