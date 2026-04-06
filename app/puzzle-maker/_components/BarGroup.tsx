export const BarGroup = ({
  barLocation,
  gridSize,
  rowColIndex,
  gridTics,
  handleClickBar,
  handleEraseBar,
}: {
  barLocation: "top" | "left";
  gridSize: { rows: number; cols: number };
  rowColIndex: number;
  gridTics: number[][];
  handleClickBar: (
    position: "top" | "left",
    rowIndex: number,
    colIndex: number,
    index: number,
  ) => void;
  handleEraseBar: (position: "top" | "left", index: number) => void;
}) => {
  return barLocation === "top" ? (
    <>
      {Array.from(
        { length: gridSize!.rows },
        (_, i) => gridSize!.rows - 1 - i,
      ).map((barIndex) => (
        <Bars
          barLocation="top"
          key={barIndex}
          barIndex={barIndex}
          onClick={() => handleClickBar("top", barIndex, rowColIndex, barIndex)}
          cellIndex={rowColIndex}
          gridTics={gridTics[0]}
        />
      ))}

      <BarDelete
        barLocation="top"
        gridTics={gridTics[0]}
        barIndex={rowColIndex}
        handleEraseBar={handleEraseBar}
      />
    </>
  ) : (
    <>
      {Array.from(
        { length: gridSize.cols },
        (_, i) => gridSize!.cols - 1 - i,
      ).map((colIndex) => (
        <Bars
          key={colIndex}
          barLocation="left"
          barIndex={colIndex}
          cellIndex={rowColIndex}
          gridTics={gridTics[1]}
          onClick={() =>
            handleClickBar("left", rowColIndex, colIndex, colIndex)
          }
        />
      ))}
      <BarDelete
        barLocation="left"
        gridTics={gridTics[1]}
        barIndex={rowColIndex}
        handleEraseBar={handleEraseBar}
      />
    </>
  );
};

const BarDelete = ({
  barLocation,
  gridTics,
  barIndex,
  handleEraseBar,
}: {
  barLocation: "top" | "left";
  gridTics: number[];
  barIndex: number;
  handleEraseBar: (position: "top" | "left", index: number) => void;
}) => {
  return barLocation === "top" ? (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 cursor-pointer"
      onClick={() => handleEraseBar("top", barIndex)}
    >
      {gridTics[barIndex] > 0 && (
        <div className="w-12 h-2 bg-red-400 rounded-2xl" />
      )}
    </div>
  ) : (
    <div
      className="absolute left-full top-1/2 -translate-y-1/2 ml-1 cursor-pointer"
      onClick={() => handleEraseBar("left", barIndex)}
    >
      {gridTics[barIndex] > 0 && (
        <div className="w-2 h-12 bg-red-400 rounded-2xl" />
      )}
    </div>
  );
};

const Bars = ({
  barLocation,
  onClick,
  gridTics,
  barIndex,
  cellIndex,
}: {
  barLocation: "top" | "left";
  onClick: () => void;
  gridTics: number[] | null;
  barIndex: number;
  cellIndex: number;
}) => {
  return barLocation === "top" ? (
    <div
      onClick={() => onClick()}
      className={`peer w-10 h-4 border border-white opacity-50 cursor-pointer hover:bg-green-600 hover:opacity-100 [&:hover~.peer]:bg-green-600 [&:hover~.peer]:opacity-100 ${
        gridTics && gridTics[cellIndex] >= barIndex + 1
          ? "bg-green-600 opacity-100"
          : "opacity-50"
      }`}
    />
  ) : (
    <div
      onClick={() => onClick()}
      className={`peer w-4 h-10 border border-white opacity-50 cursor-pointer hover:bg-green-600 hover:opacity-100 [&:hover~.peer]:bg-green-600 [&:hover~.peer]:opacity-100 ${
        gridTics && gridTics[cellIndex] >= barIndex + 1
          ? "bg-green-600 opacity-100"
          : "opacity-50"
      }`}
    />
  );
};
