import { BarGroup } from "./BarGroup";
import { Lock } from "lucide-react";

type BlockMode = {
  mode: "block";
  blockedCells: number[][];
  onClickBlockCell: (rowIndex: number, colIndex: number) => void;
};

type TickMode = {
  mode: "tick";
  blockedCells: number[][];
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
};

type SolveMode = {
  mode: "solve";
  blockedCells: number[][];
  handleClickBar: (
    direction: "top" | "left",
    rowIndex: number,
    colIndex: number,
    barIndex: number,
  ) => void;
  filledCells?: number[][];
  pieceLocations?: { cells: [number, number][] }[];
  solved?: boolean | null;
};

type PuzzleGridProps = {
  gridSize: { rows: number; cols: number };
  gridTics: [number[], number[]];
} & (BlockMode | TickMode | SolveMode);

function PuzzleGrid(props: PuzzleGridProps) {
  const { gridSize, mode, blockedCells, gridTics } = props;

  const handleClickBar = mode !== "block" ? props.handleClickBar : undefined;
  const onClickBlockCell =
    mode === "block" ? props.onClickBlockCell : undefined;
  const filledCells = mode === "solve" ? props.filledCells : undefined;
  const pieceLocations = mode === "solve" ? props.pieceLocations : undefined;
  const solved = mode === "solve" ? props.solved : undefined;

  const showBars = mode !== "block";

  return (
    <div
      className="flex flex-col gap-y-1"
      style={{ paddingTop: showBars ? `${gridSize.rows * 24 + 16}px` : 0 }}
    >
      {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="relative flex gap-x-1">
          {showBars && gridTics && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-row gap-x-2 mr-4">
              <BarGroup
                barLocation="left"
                gridSize={gridSize}
                gridTics={gridTics}
                rowColIndex={rowIndex}
                handleClickBar={handleClickBar!}
              />
            </div>
          )}

          {rowIndex === 0 && showBars && gridTics && (
            <div className="absolute bottom-full left-0 flex gap-x-1 mb-4">
              {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="w-16 flex flex-col items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BarGroup
                    barLocation="top"
                    gridSize={gridSize}
                    gridTics={gridTics}
                    rowColIndex={colIndex}
                    handleClickBar={handleClickBar!}
                  />
                </div>
              ))}
            </div>
          )}

          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`relative w-16 h-16 backdrop-blur-2xl ${mode === "tick" ? "opacity-30" : ""} ${filledCells?.[rowIndex]?.[colIndex] ? "bg-green-800" : "bg-transparent"}`}
              onClick={() => onClickBlockCell?.(rowIndex, colIndex)}
            >
              <CellMarkings
                blocked={blockedCells?.[rowIndex]?.[colIndex] === 1}
              />

              {solved && pieceLocations && (
                <ShowSolution
                  pieceLocations={pieceLocations}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  solved={solved}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const ShowSolution = ({
  pieceLocations,
  rowIndex,
  colIndex,
  solved,
}: {
  pieceLocations: { cells: [number, number][] }[];
  rowIndex: number;
  colIndex: number;
  solved: boolean | null;
}) => {
  const matchedPiece = pieceLocations.find(({ cells }) =>
    cells.some(([r, c]) => r === rowIndex && c === colIndex),
  );
  const inPiece = solved && !!matchedPiece;
  const cells = matchedPiece?.cells ?? [];
  const has = (dr: number, dc: number) =>
    cells.some(([r, c]) => r === rowIndex + dr && c === colIndex + dc);

  const nLeft = has(0, -1);
  const nRight = has(0, 1);
  const nTop = has(-1, 0);
  const nBottom = has(1, 0);
  const dTopLeft = has(-1, -1);
  const dTopRight = has(-1, 1);
  const dBottomLeft = has(1, -1);
  const dBottomRight = has(1, 1);

  return (
    <>
      {inPiece && (
        <>
          <div
            className={`absolute top-2 bottom-2 bg-green-400 ${nLeft ? "left-0" : "left-2"} ${nRight ? "right-0" : "right-2"}`}
          />
          <div
            className={`absolute left-2 right-2 bg-green-400 ${nTop ? "top-0" : "top-2"} ${nBottom ? "bottom-0" : "bottom-2"}`}
          />
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
    </>
  );
};

const CellMarkings = ({ blocked }: { blocked: boolean }) => {
  return (
    <>
      {blocked ? (
        <div className="absolute top-0 left-0 border-4 border-green-400 w-full h-full">
          <div className="w-12 h-12 absolute inset-0 m-auto bg-green-400/40" />
          <div className="w-3 h-1 bg-green-400/50 absolute top-1/4 left-1/4 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="w-3 h-1 bg-green-400/50 absolute top-1/4 right-1/4 rounded-full translate-x-1/2 -translate-y-1/2 rotate-135" />
          <div className="w-3 h-1 bg-green-400/50 absolute bottom-1/4 left-1/4 rounded-full -translate-x-1/2 translate-y-1/2 rotate-135" />
          <div className="w-3 h-1 bg-green-400/50 absolute bottom-1/4 right-1/4 rounded-full translate-x-1/2 translate-y-1/2 rotate-45" />
          <Lock
            className="absolute inset-0 m-auto"
            style={{ color: "#05df72" }}
            fill="#05df72"
          />
        </div>
      ) : (
        <>
          <div className="w-1 h-1 bg-white/50 absolute inset-0 m-auto rounded-full" />
          <div className="w-6 h-1 bg-white/50 absolute top-1/4 left-1/4 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="w-6 h-1 bg-white/50 absolute top-1/4 right-1/4 rounded-full translate-x-1/2 -translate-y-1/2 rotate-135" />
          <div className="w-6 h-1 bg-white/50 absolute bottom-1/4 left-1/4 rounded-full -translate-x-1/2 translate-y-1/2 rotate-135" />
          <div className="w-6 h-1 bg-white/50 absolute bottom-1/4 right-1/4 rounded-full translate-x-1/2 translate-y-1/2 rotate-45" />
        </>
      )}
    </>
  );
};

export default PuzzleGrid;
