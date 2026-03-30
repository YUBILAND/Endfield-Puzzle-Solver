function canPlacePiece(
  tiling: number[][],
  piece: number[][],
  row: number,
  col: number,
): boolean {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] === 1) {
        // Map the piece coordinates to the tiling coordinates
        const tilingRow = row + i;
        const tilingCol = col + j;
        if (
          tilingRow >= tiling.length ||
          tilingCol >= tiling[0].length ||
          tiling[tilingRow][tilingCol] !== 1
        ) {
          // Out of bounds or overlapping with a non-empty cell
          return false;
        }
      }
    }
  }
  return true;
}
function placePiece(
  tiling: number[][],
  piece: number[][],
  row: number,
  col: number,
  addPieceLocation: (location: {
    piece: number[][];
    cells: [number, number][];
  }) => void,
): { piece: number[][]; cells: [number, number][] } {
  const cells: [number, number][] = [];
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] === 1) {
        tiling[row + i][col + j] = 2; // Mark the cell as occupied by the piece
        cells.push([row + i, col + j]);
      }
    }
  }
  const location = { piece, cells };
  addPieceLocation(location);
  return location;
}

function removePiece(
  tiling: number[][],
  piece: number[][],
  row: number,
  col: number,
  removePieceLocation: (location: {
    piece: number[][];
    cells: [number, number][];
  }) => void,
  location: { piece: number[][]; cells: [number, number][] },
): void {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] === 1) {
        tiling[row + i][col + j] = 1; // Reset the cell back to filled
      }
    }
  }
  removePieceLocation(location);
}

// Rotates the piece 90 degrees clockwise
function rotatePiece(piece: number[][]): number[][] {
  const rows = piece.length;
  const cols = piece[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(0),
  );
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = piece[i][j];
    }
  }
  return rotated;
}

export function getAllRotations(piece: number[][]): number[][][] {
  const rotations: number[][][] = [];
  let current = piece;
  for (let i = 0; i < 4; i++) {
    rotations.push(current);
    current = rotatePiece(current);
  }
  return rotations;
}

type PuzzleSolver = {
  tiling: number[][];
  pieces: number[][][];
  addPieceLocation: (location: {
    piece: number[][];
    cells: [number, number][];
  }) => void;
  removePieceLocation: (location: {
    piece: number[][];
    cells: [number, number][];
  }) => void;
};

export function solvePuzzle({
  tiling,
  pieces,
  addPieceLocation,
  removePieceLocation,
}: PuzzleSolver): boolean {
  // Find filled cells in the tiling
  const filledCells: [number, number][] = [];
  for (let i = 0; i < tiling.length; i++) {
    for (let j = 0; j < tiling[i].length; j++) {
      if (tiling[i][j] === 1) {
        filledCells.push([i, j]);
      }
    }
  }

  // Base case: if no filled cells remain, puzzle is solved
  if (filledCells.length === 0) {
    return true;
  }

  for (const [i, j] of filledCells) {
    // Try to place each piece at the current filled cell
    for (let pieceIdx = 0; pieceIdx < pieces.length; pieceIdx++) {
      const piece = pieces[pieceIdx];
      const remainingPieces = pieces.filter((_, idx) => idx !== pieceIdx);
      for (const rotated of getAllRotations(piece)) {
        if (canPlacePiece(tiling, rotated, i, j)) {
          const location = placePiece(tiling, rotated, i, j, addPieceLocation);
          if (
            solvePuzzle({
              tiling,
              pieces: remainingPieces,
              addPieceLocation,
              removePieceLocation,
            })
          ) {
            return true;
          }
          removePiece(tiling, rotated, i, j, removePieceLocation, location);
        }
      }
    }
  }
  return false;
}
