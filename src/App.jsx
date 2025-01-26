import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Grid from "./components/Grid";
import ButtonContainer from "./components/ButtonContainer";
import { sequenceCheck } from "./utils/sequenceCheck";

function App() {
  const gridSize = 50;
  const initialGrid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));

  const [grid, setGrid] = useState(initialGrid);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [cellsToReset, setCellsToReset] = useState([]);
  const [resetHighlight, setResetHighlight] = useState([]);
  const [resetingCells, setResetingCells] = useState(false);
  const [history, setHistory] = useState([initialGrid]);
  const [currentStep, setCurrentStep] = useState(0);
  const [redoStack, setRedoStack] = useState([]);

  const generateSequencesForCheck = useCallback(() => {
    const clearedCells = [];
    for (let row = 0; row < gridSize; row++) {
      const rowSequence = grid[row];
      const rowFoundIndex = sequenceCheck(rowSequence);
      if (rowFoundIndex !== false) {
        for (let c = rowFoundIndex; c < rowFoundIndex + 5; c++) {
          clearedCells.push([row, c]);
        }
      }
    }
    setCellsToReset(clearedCells);
  }, [grid]);

  useEffect(() => {
    generateSequencesForCheck();
  }, [generateSequencesForCheck]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (!resetingCells) {
      const updatedCells = [];
      const newGrid = grid.map((row, i) =>
        row.map((cellValue, j) => {
          if (i === rowIndex || j === colIndex) {
            updatedCells.push([i, j]);
            return cellValue === null ? 1 : cellValue + 1;
          }
          return cellValue;
        })
      );
      updateGrid(newGrid);
      setHighlightedCells(updatedCells);
      setTimeout(() => setHighlightedCells([]), 300);
    }
  };

  const updateGrid = (newGrid) => {
    const newHistory = history.slice(0, currentStep + 1);
    setHistory([...newHistory, newGrid]);
    setCurrentStep(newHistory.length);
    setGrid(newGrid);
    setRedoStack([]);
  };

  const handleResetButton = () => {
    const nullGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null));
    setGrid(nullGrid);
    setHistory([initialGrid]);
    setRedoStack([]);
    setCurrentStep(0);
  };

  return (
    <div className="container">
      <Grid
        grid={grid}
        highlightedCells={highlightedCells}
        resetHighlight={resetHighlight}
        handleCellClick={handleCellClick}
      />
      <ButtonContainer
        handleReset={handleResetButton}
        handleUndo={() => {}}
        handleRedo={() => {}}
        canUndo={currentStep > 0}
        canRedo={redoStack.length > 0}
      />
    </div>
  );
}

export default App;
