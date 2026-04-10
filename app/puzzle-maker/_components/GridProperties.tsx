import { useState } from "react";
import { GridSelect } from "react-grid-select";

type GridSelectArea = {
  width: number | null;
  height: number | null;
};

const GridProperties = ({
  onDone,
}: {
  onDone: (selectedArea: GridSelectArea) => void;
}) => {
  const [selectedArea, setSelectedArea] = useState<GridSelectArea>({
    width: null,
    height: null,
  });

  const handleUpdateRegion = (area: GridSelectArea) => {
    setSelectedArea(area);
  };

  const gridSelectStyles = {
    active: {
      background: "#1d7d28",
      border: "1px solid  #1d7d28",
    },
    hover: { background: "#2eb83e", border: undefined },
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8 bg-white/10 rounded-xl backdrop-blur-sm">
        <h2 className="text-white text-xl font-semibold tracking-wide">
          Grid Size
        </h2>

        <div className="text-green-400 text-3xl font-bold">
          {selectedArea.height ?? "-"} x {selectedArea.width ?? "-"}
        </div>

        <GridSelect
          cols={5}
          rows={5}
          onRegionUpdate={handleUpdateRegion}
          styles={gridSelectStyles}
        />

        <button
          className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
          onClick={() => onDone(selectedArea)}
        >
          Done
        </button>
      </div>
    </>
  );
};

export default GridProperties;
