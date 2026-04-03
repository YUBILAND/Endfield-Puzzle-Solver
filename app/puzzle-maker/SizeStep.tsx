"use client";
import React, { useState } from "react";
import { GridSelect } from "react-grid-select";

type GridSelectArea = {
  width: number | null;
  height: number | null;
};

function SizeStep({
  setGridSize,
}: {
  setGridSize: (rows: number, cols: number) => void;
}) {
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
      setGridSize(selectedArea.width, selectedArea.height);
    }
  };

  return (
    <div>
      <div>Select Grid Size</div>

      <div>
        {selectedArea.width} x {selectedArea.height}
      </div>

      <GridSelect
        cols={5}
        rows={5}
        onRegionUpdate={handleUpdateRegion}
        styles={gridSelectStyles}
      />
      <button onClick={handleFinishGridSelect}>Done</button>
    </div>
  );
}

export default SizeStep;
