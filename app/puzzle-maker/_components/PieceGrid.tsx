import { Trash2 } from "lucide-react";
import { usePieceEditor } from "../_hooks/usePieceEditor";

export const PieceGrid = ({
  gridSize,
  availablePieces,
  setAvailablePieces,
}: {
  gridSize: { rows: number; cols: number };
  availablePieces: number[][][];
  setAvailablePieces: React.Dispatch<React.SetStateAction<number[][][]>>;
}) => {
  const handleRemovePiece = (pieceIndex: number) => {
    const newAvailablePieces = [...availablePieces];
    newAvailablePieces.splice(pieceIndex, 1);
    setAvailablePieces(newAvailablePieces);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <CreatePiece
        gridSize={gridSize}
        availablePieces={availablePieces}
        setAvailablePieces={setAvailablePieces}
      />

      {availablePieces.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-white/50 text-xs uppercase tracking-widest">
            Added Pieces ({availablePieces.length})
          </span>
          <AvailablePieces
            availablePieces={availablePieces}
            handleRemovePiece={handleRemovePiece}
          />
        </div>
      )}
    </div>
  );
};

const AvailablePieces = ({
  availablePieces,
  handleRemovePiece,
}: {
  availablePieces: number[][][];
  handleRemovePiece: (pieceIndex: number) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {availablePieces.map((piece, pieceIndex) => {
        const pieceWidth = piece[0].length;
        const pieceHeight = piece.length;
        const cellSize = 40 / Math.max(pieceWidth, pieceHeight);

        return (
          <div
            key={pieceIndex}
            className="relative flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
          >
            <button
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors cursor-pointer"
              onClick={() => handleRemovePiece(pieceIndex)}
            >
              <Trash2 size={10} className="text-white" />
            </button>
            <DisplayPiece piece={piece} cellSize={cellSize} />
          </div>
        );
      })}
    </div>
  );
};

const CreatePiece = ({
  gridSize,
  availablePieces,
  setAvailablePieces,
}: {
  gridSize: { rows: number; cols: number };
  availablePieces: number[][][];
  setAvailablePieces: React.Dispatch<React.SetStateAction<number[][][]>>;
}) => {
  const {
    newPiece,
    highlightedCells,
    handleHighlightCells,
    handleAddPiece,
    handleClearPiece,
  } = usePieceEditor({ gridSize, availablePieces, setAvailablePieces });

  return (
    <div className="flex flex-col gap-4">
      <span className="text-white/50 text-xs uppercase tracking-widest">
        Draw a Piece
      </span>
      <CellGrid
        gridSize={gridSize}
        highlightedCells={highlightedCells}
        onClick={handleHighlightCells}
      />
      <div className="flex gap-3">
        <button
          disabled={newPiece.length === 0}
          onClick={handleAddPiece}
          className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors cursor-pointer"
        >
          Add Piece
        </button>
        <button
          onClick={handleClearPiece}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/70 text-sm rounded-lg font-medium transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const DisplayPiece = ({
  piece,
  cellSize,
}: {
  piece: number[][];
  cellSize: number;
}) => {
  return (
    <div className="flex flex-col gap-px">
      {piece.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-px">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={cell ? "bg-green-500 rounded-sm" : "bg-transparent"}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const CellGrid = ({
  gridSize,
  highlightedCells,
  onClick,
}: {
  gridSize: { rows: number; cols: number };
  highlightedCells?: number[][];
  onClick?: (rowIndex: number, colIndex: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              onClick={() => onClick?.(rowIndex, colIndex)}
              className={`w-8 h-8 rounded border cursor-pointer transition-colors
                ${highlightedCells?.[rowIndex]?.[colIndex]
                  ? "bg-green-500/60 border-green-400"
                  : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
