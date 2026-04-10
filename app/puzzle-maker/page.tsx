"use client";
import { useState } from "react";
import GridProperties from "./_components/GridProperties";
import PuzzleGrid from "./_components/PuzzleGrid";
import PuzzleMakerSteps from "./PuzzleMakerSteps";
import { useGridTics } from "./_hooks/useGridTics";

const steps = [
  { label: "Select Grid Size", step: 1 },
  { label: "Select Colors", step: 2 },
  { label: "Add Blocks", step: 3 },
  { label: "Add Cells", step: 4 },
  { label: "Add Pieces", step: 5 },
  { label: "Solve", step: 6 },
];

function PuzzleMaker() {
  const [currentStep, setCurrentStep] = useState(1);
  const [gridSize, setGridSize] = useState<{
    rows: number;
    cols: number;
  } | null>(null);
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);

  const onDone = (selectedArea: {
    width: number | null;
    height: number | null;
  }) => {
    if (selectedArea.width && selectedArea.height) {
      setGridSize({ rows: selectedArea.height, cols: selectedArea.width });
      handleNextStep();
    }
  };

  return (
    <BackgroundImage image="/endfield-logo.png">
      <BackgroundBlur blur="20px">
        <ContentContainer>
          <FlexRowContainer>
            <LeftFlexChildContainer>
              <StepSelector currentStep={currentStep} />
            </LeftFlexChildContainer>
            {currentStep === 1 ? (
              <div className="flex flex-col basis-3/5 items-center justify-center">
                <GridProperties onDone={onDone} />
              </div>
            ) : gridSize ? (
              <PuzzleMakerColumns
                gridSize={gridSize}
                currentStep={currentStep}
                onNextStep={handleNextStep}
              />
            ) : null}
          </FlexRowContainer>
        </ContentContainer>
      </BackgroundBlur>
    </BackgroundImage>
  );
}

const PuzzleMakerColumns = ({
  gridSize,
  currentStep,
  onNextStep,
}: {
  gridSize: { rows: number; cols: number };
  currentStep: number;
  onNextStep: () => void;
}) => {
  const [blockedCells, setBlockedCells] = useState<number[][]>(() =>
    Array.from({ length: gridSize.rows }, () =>
      Array.from({ length: gridSize.cols }, () => 0),
    ),
  );

  const { gridTics, handleClickBar, setGridTics } = useGridTics(
    gridSize,
    blockedCells,
  );

  const handleClickBlockCell = (rowIndex: number, colIndex: number) => {
    const newBlockedCells = blockedCells.map((row) => [...row]);
    const newGridTics = [[...gridTics[0]], [...gridTics[1]]] as [
      number[],
      number[],
    ];

    if (blockedCells[rowIndex][colIndex] === 0) {
      newBlockedCells[rowIndex][colIndex] = 1;
      newGridTics[0][colIndex]++;
      newGridTics[1][rowIndex]++;
    } else {
      newBlockedCells[rowIndex][colIndex] = 0;
      newGridTics[0][colIndex]--;
      newGridTics[1][rowIndex]--;
    }

    setBlockedCells(newBlockedCells);
    setGridTics(newGridTics);
  };

  return (
    <>
      <div className="flex flex-col basis-3/5 items-center justify-center">
        <PuzzleMakerSteps
          gridSize={gridSize}
          currentStep={currentStep}
          onNextStep={onNextStep}
          blockedCells={blockedCells}
          gridTics={gridTics}
          handleClickBar={handleClickBar}
          onClickBlockCell={handleClickBlockCell}
        />
      </div>
      <div className="flex flex-col basis-1/5 items-center justify-center">
        {currentStep === 5 && (
          <>
            <span className="text-white/50 text-sm mb-4">Reference</span>
            <PuzzleGrid
              gridSize={gridSize}
              gridTics={gridTics}
              blockedCells={blockedCells}
              handleClickBar={handleClickBar}
              mode="tick"
            />
          </>
        )}
      </div>
    </>
  );
};

const BackgroundImage = ({
  children,
  image,
}: {
  children: React.ReactNode;
  image: string;
}) => (
  <div
    style={{ backgroundImage: `url('${image}')` }}
    className="bg-cover bg-center"
  >
    {children}
  </div>
);

const BackgroundBlur = ({
  children,
  blur = "20px",
}: {
  children: React.ReactNode;
  blur?: string;
}) => (
  <div
    className="bg-black/50 min-h-screen flex items-center justify-center"
    style={{ backdropFilter: `blur(${blur})` }}
  >
    {children}
  </div>
);

const ContentContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full px-6 py-12">
    <div className="bg-white/10 rounded-lg p-6">{children}</div>
  </div>
);

const FlexRowContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row w-full">{children}</div>
);

const LeftFlexChildContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="flex flex-col basis-1/5 items-center justify-center">
    {children}
  </div>
);

const StepSelector = ({ currentStep }: { currentStep: number }) => (
  <div className="flex flex-col gap-2 w-full">
    {steps.map(({ label, step: s }) => (
      <div
        key={s}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${currentStep === s ? "bg-green-700 text-white" : "bg-white/10 text-white/50"}`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep === s ? "bg-white text-green-700" : "bg-white/20 text-white/50"}`}
        >
          {s}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    ))}
  </div>
);

export default PuzzleMaker;
