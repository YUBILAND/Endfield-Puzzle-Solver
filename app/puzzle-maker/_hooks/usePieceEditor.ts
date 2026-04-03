import { useState } from "react";

export function usePieceEditor({
  gridSize,
  availablePieces,
  setAvailablePieces,
}: {
  gridSize: { rows: number; cols: number };
  availablePieces: number[][][];
  setAvailablePieces: React.Dispatch<React.SetStateAction<number[][][]>>;
}) {
  const [newPiece, setNewPiece] = useState<[number, number][]>([]);
  const [highlightedCells, setHighlightedCells] = useState<number[][]>(
    Array.from(
      { length: Array.from({ length: gridSize?.rows ?? 0 }, () => 0).length },
      () =>
        Array.from(
          {
            length: Array.from({ length: gridSize?.cols ?? 0 }, () => 0).length,
          },
          () => 0,
        ),
    ),
  );

  const handleAddPiece = () => {
    if (newPiece.length === 0) return;

    const { preparedPiece } = alignToTopLeft(newPiece);

    console.log("Prepared piece:");
    console.table(preparedPiece);

    setAvailablePieces((prev) => [...prev, preparedPiece]);
  };
  const handleClearPiece = () => {
    setNewPiece([]);
    setHighlightedCells((prev) => prev.map((row) => row.map(() => 0)));
  };

  const handleHighlightCells = (rowIndex: number, colIndex: number) => {
    setHighlightedCells((prev) => {
      const newHighlighted = prev.map((row) => [...row]); // Makes deep copy of the 2D array
      newHighlighted[rowIndex][colIndex] = !newHighlighted[rowIndex][colIndex]
        ? 1
        : 0;
      return newHighlighted;
    });

    setNewPiece((prev) => {
      const exists = prev.some(([r, c]) => r === rowIndex && c === colIndex);
      const removePieceIndex = prev.filter(
        ([r, c]) => r !== rowIndex || c !== colIndex,
      ) as [number, number][];
      const addPieceIndex = [...prev, [rowIndex, colIndex]] as [
        number,
        number,
      ][];

      return exists ? removePieceIndex : addPieceIndex;
    });
  };

  return {
    newPiece,
    highlightedCells,
    handleHighlightCells,
    handleAddPiece,
    handleClearPiece,
  };
}

const alignToTopLeft = (newPiece: [number, number][]) => {
  const getMinMaxPieceCoords = (piece: [number, number][]) => {
    const rows = piece.map(([_, rowIndex]) => rowIndex);
    const cols = piece.map(([colIndex, _]) => colIndex);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    return { minRow, maxRow, minCol, maxCol };
  };
  const { minRow, maxRow, minCol, maxCol } = getMinMaxPieceCoords(newPiece);
  // console.log("Added piece:", newPiece);
  // console.log("Get coordinates from", { minCol, minRow }, "to", {
  //   maxCol,
  //   maxRow,
  // });
  const offset = { col: minCol, row: minRow };

  //Initialize empty piece grid. Aligned to top-left corner of the piece's bounding box.
  const preparedPiece = Array.from({ length: maxRow - minRow + 1 }, () =>
    Array.from({ length: maxCol - minCol + 1 }, () => 0),
  );
  // Fill in the cells of the new piece in the new coordinate system
  newPiece.forEach(([col, row]) => {
    preparedPiece[row - offset.row][col - offset.col] = 1;
  });

  return { preparedPiece };
};
