function canPlacePiece(
  emptyGrid: number[][],
  barTick: number[][],
  userTick: number[][],
  piece: number[][],
  row: number,
  col: number,
): boolean {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      const pieceCellExists = piece[i][j] === 1;
      if (pieceCellExists) {
        // Map the piece coordinates to the emptyGrid coordinates
        const emptyGridRow = row + i;
        const emptyGridCol = col + j;

        const outOfBounds =
          emptyGridRow >= emptyGrid.length ||
          emptyGridCol >= emptyGrid[0].length ||
          emptyGrid[emptyGridRow][emptyGridCol] !== 0;

        const hBar = barTick[0];
        const vBar = barTick[1];
        const user_hBar = userTick[0];
        const user_vBar = userTick[1];

        const tickExceeds =
          hBar[emptyGridCol] > user_hBar[emptyGridCol] ||
          vBar[emptyGridRow] > user_vBar[emptyGridRow];

        if (outOfBounds || tickExceeds) {
          // Out of bounds or overlapping with a non-empty cell
          return false;
        }
      }
    }
  }
  return true;
}
function placePiece(
  emptyGrid: number[][],
  barTick: number[][],
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
      const pieceCellExists = piece[i][j] === 1;
      if (pieceCellExists) {
        emptyGrid[row + i][col + j] = 1; // Mark the cell as occupied by the piece
        cells.push([row + i, col + j]);
        barTick[0][col + j]++;
        barTick[1][row + i]++;
      }
    }
  }
  const location = { piece, cells };
  addPieceLocation(location);
  return location;
}

function removePiece(
  emptyGrid: number[][],
  barTick: number[][],
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
        emptyGrid[row + i][col + j] = 0; // Reset the cell back to empty
        barTick[0][col + j]--;
        barTick[1][row + i]--;
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
  emptyGrid: number[][];
  barTick: number[][];
  userTick: number[][];
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

function isSameArray(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export function solveHardPuzzle({
  emptyGrid,
  barTick,
  userTick,
  pieces,
  addPieceLocation,
  removePieceLocation,
}: PuzzleSolver): boolean {
  const ticksMatch =
    isSameArray(barTick[0], userTick[0]) &&
    isSameArray(barTick[1], userTick[1]);
  // Base case: if bar tick count matches user input, puzzle is solved
  if (ticksMatch) {
    return true;
  }

  for (let i = 0; i < emptyGrid.length; i++) {
    for (let j = 0; j < emptyGrid[i].length; j++) {
      // Try to place each piece at the current filled cell
      for (let pieceIdx = 0; pieceIdx < pieces.length; pieceIdx++) {
        const piece = pieces[pieceIdx];
        const remainingPieces = pieces.filter((_, idx) => idx !== pieceIdx);
        for (const rotated of getAllRotations(piece)) {
          if (canPlacePiece(emptyGrid, barTick, userTick, rotated, i, j)) {
            const location = placePiece(
              emptyGrid,
              barTick,
              rotated,
              i,
              j,
              addPieceLocation,
            );
            if (
              solveHardPuzzle({
                emptyGrid,
                barTick,
                userTick,
                pieces: remainingPieces,
                addPieceLocation,
                removePieceLocation,
              })
            ) {
              return true;
            }
            removePiece(
              emptyGrid,
              barTick,
              rotated,
              i,
              j,
              removePieceLocation,
              location,
            );
          }
        }
      }
    }
  }
  return false;
}
