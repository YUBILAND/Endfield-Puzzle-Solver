import { useState } from "react";
import { GridSelect } from "react-grid-select";

type GridSelectArea = {
  width: number | null;
  height: number | null;
};

const GridProperties = ({
  setGridSize,
}: {
  setGridSize: (rows: number, cols: number) => void;
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
      border: "1px solid #1d7d28",
    },
    hover: { background: "#2eb83e", border: undefined },
  };

  const handleFinishGridSelect = () => {
    if (selectedArea.width && selectedArea.height) {
      setGridSize(selectedArea.height, selectedArea.width);
    }
  };
  return (
    <>
      <div>Grid Size</div>

      <div>
        {selectedArea.height} x {selectedArea.width}
      </div>

      <GridSelect
        cols={5}
        rows={5}
        onRegionUpdate={handleUpdateRegion}
        styles={gridSelectStyles}
      />

      <button className="cursor-pointer" onClick={handleFinishGridSelect}>
        Done
      </button>
    </>
  );
};

export default GridProperties;
