import { Trash } from "lucide-react";
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
    <>
      {/* Top Widgets */}
      <TopArt />
      <div className="flex flex-col items-center bg-white/40 backdrop-blur-xl p-4 gap-y-8">
        {/* Puzzle Pieces */}
        <AvailablePieces
          availablePieces={availablePieces}
          handleRemovePiece={handleRemovePiece}
        />

        <CreatePiece
          gridSize={gridSize}
          availablePieces={availablePieces}
          setAvailablePieces={setAvailablePieces}
        />
      </div>
      <OsuGradient />
      <BottomArt />
    </>
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
    <div className="grid grid-cols-2 gap-4">
      {availablePieces.map((piece, pieceIndex) => {
        const pieceWidth = piece[0].length;
        const pieceHeight = piece.length;
        const cellSize = 50 / Math.max(pieceWidth, pieceHeight);

        return (
          <div
            key={pieceIndex}
            className="relative flex flex-col items-center justify-center p-4 bg-black/50"
          >
            <PieceDeleteButton onClick={() => handleRemovePiece(pieceIndex)} />
            <PieceCellMarkings />
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
    <>
      <div>Add Pieces</div>
      <CellGrid
        gridSize={gridSize}
        highlightedCells={highlightedCells}
        onClick={(rowIndex, colIndex) =>
          handleHighlightCells(rowIndex, colIndex)
        }
      />
      <div className="flex flex-row items-center justify-center gap-x-4">
        <button
          className={`cursor-pointer ${newPiece.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => handleAddPiece()}
        >
          Add
        </button>
        <button className="cursor-pointer" onClick={() => handleClearPiece()}>
          Clear
        </button>
      </div>
    </>
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
    <div className="flex flex-col">
      {piece.map((row, rowIndex) => (
        <div key={rowIndex} className="flex ">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={` ${cell ? "bg-green-500 border" : "bg-transparent"}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const PieceDeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="absolute top-0 right-0 translate-x-3 -translate-y-3 w-6 h-6 rounded-full bg-red-400 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <Trash size={16} />
    </div>
  );
};

const TopArt = () => {
  return (
    <div className="flex w-full h-20">
      <div className="bg-red-400 w-full h-full"></div>
      <div className="bg-blue-400 w-full h-full"></div>
    </div>
  );
};

const OsuGradient = () => {
  return (
    <div className="flex w-full h-1">
      <div className="bg-purple-400 w-full h-full"></div>
      <div className="bg-red-400 w-full h-full"></div>
      <div className="bg-yellow-400 w-full h-full"></div>
      <div className="bg-purple-400 w-full h-full"></div>
      <div className="bg-green-400 w-full h-full"></div>
    </div>
  );
};

const BottomArt = () => {
  return (
    <div className="flex w-full h-10">
      <div className="bg-gray-500 w-full h-full"></div>
    </div>
  );
};

const PieceCellMarkings = () => {
  return (
    <>
      <div className="w-2 h-1 bg-white/50 absolute top-1/8 left-1/8 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
      <div className="w-2 h-1 bg-white/50 absolute top-1/8 right-1/8 rounded-full translate-x-1/2 -translate-y-1/2 rotate-135" />
      <div className="w-2 h-1 bg-white/50 absolute bottom-1/8 left-1/8 rounded-full -translate-x-1/2 translate-y-1/2 rotate-135" />
      <div className="w-2 h-1 bg-white/50 absolute bottom-1/8 right-1/8 rounded-full translate-x-1/2 translate-y-1/2 rotate-45" />
    </>
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
        <div key={rowIndex} className="relative flex gap-x-1 ">
          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`w-8 h-8 border ${highlightedCells?.[rowIndex]?.[colIndex] ? "bg-green-500" : "bg-transparent"}`}
              onClick={() => onClick?.(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
