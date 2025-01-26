import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import History from "../History/History";
import { sequenceCheck } from "../../utils/sequenceCheck";

const Grid = () => {
  const gridSize = 50;
  const initialGrid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));

  const [grid, setGrid] = useState(initialGrid);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [cellsToReset, setCellsToReset] = useState([]);
  const [resetHighlight, setResetHighlight] = useState([]);
  const [resetingCells, setResetingCells] = useState(false);

  // Initialize History component
  const historyManager = History({
    initialGrid,
    onGridChange: (newGrid) => setGrid(newGrid),
  });

  // Function for creating sequences for every row and column
  const generateSequencesForCheck = useCallback(() => {
    const clearedCells = [];

    // Check each row (both left to right and right to left)
    for (let row = 0; row < gridSize; row++) {
      const rowSequence = grid[row];
      const reverseRowSequence = [...rowSequence].reverse();

      // Check for Fibonacci sequence in the row (left to right)
      const rowFoundIndex = sequenceCheck(rowSequence);
      if (rowFoundIndex !== false) {
        for (let c = rowFoundIndex; c < rowFoundIndex + 5; c++) {
          clearedCells.push([row, c]);
        }
      }

      // Check for Fibonacci sequence in the row (right to left)
      const reverseRowFoundIndex = sequenceCheck(reverseRowSequence);
      if (reverseRowFoundIndex !== false) {
        for (
          let c = gridSize - 1 - reverseRowFoundIndex;
          c > gridSize - 6 - reverseRowFoundIndex;
          c--
        ) {
          clearedCells.push([row, c]);
        }
      }
    }

    // Check each column (both top to bottom and bottom to top)
    for (let col = 0; col < gridSize; col++) {
      const colSequence = grid.map((r) => r[col]); // Get the entire column
      const reverseColSequence = [...colSequence].reverse();

      // Check for Fibonacci sequence in the column (top to bottom)
      const colFoundIndex = sequenceCheck(colSequence);
      if (colFoundIndex !== false) {
        for (let r = colFoundIndex; r < colFoundIndex + 5; r++) {
          clearedCells.push([r, col]);
        }
      }

      // Check for Fibonacci sequence in the column (bottom to top)
      const reverseColFoundIndex = sequenceCheck(reverseColSequence);
      if (reverseColFoundIndex !== false) {
        for (
          let r = gridSize - 1 - reverseColFoundIndex;
          r > gridSize - 6 - reverseColFoundIndex;
          r--
        ) {
          clearedCells.push([r, col]);
        }
      }
    }

    setCellsToReset(clearedCells);
  }, [grid]);

  // Check for Fibonacci sequences after every grid change
  useEffect(() => {
    generateSequencesForCheck();
  }, [generateSequencesForCheck]);

  // Highlight and reset cells with Fibonacci sequences
  useEffect(() => {
    if (cellsToReset.length > 0) {
      setResetHighlight(cellsToReset);
      setResetingCells(true);

      setTimeout(() => {
        setGrid((prevGrid) =>
          prevGrid.map((row, rowIndex) =>
            row.map((cellValue, colIndex) =>
              cellsToReset.some(([r, c]) => r === rowIndex && c === colIndex)
                ? null
                : cellValue
            )
          )
        );
        setCellsToReset([]);
        setResetHighlight([]);
        setResetingCells(false);
      }, 1500);
    }
  }, [cellsToReset]);

  // Function to determine whether to highlight certain cell
  const isCellHighlighted = (rowIndex, colIndex) => {
    return (
      highlightedCells.some(([r, c]) => r === rowIndex && c === colIndex) ||
      resetHighlight.some(([r, c]) => r === rowIndex && c === colIndex)
    );
  };

  // Handle cell click to update values
  const handleCellClick = (rowIndex, colIndex) => {
    if (!resetingCells) {
      const updatedCells = [];
      const newGrid = grid.map((row, i) =>
        row.map((cellValue, j) =>
          i === rowIndex || j === colIndex
            ? (updatedCells.push([i, j]),
              cellValue === null ? 1 : cellValue + 1)
            : cellValue
        )
      );

      historyManager.updateGrid(newGrid);
      setHighlightedCells(updatedCells);

      setTimeout(() => {
        setHighlightedCells([]);
      }, 300);
    }
  };

  // Reset the grid to its initial state
  const handleResetButton = () => {
    historyManager.updateGrid(initialGrid);
    historyManager.resetHistory();
    setHighlightedCells([]);
    setResetHighlight([]);
    setResetingCells(false);
  };

  return (
    <div className="container">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cellValue, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${
                  isCellHighlighted(rowIndex, colIndex)
                    ? resetHighlight.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                      )
                      ? "reset-highlight"
                      : "highlight"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cellValue !== null ? cellValue : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button
          className="history-button left"
          onClick={historyManager.handleUndo}
          disabled={historyManager.currentStep === 0 || resetingCells}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="button" onClick={() => handleResetButton()}>
          Reset Grid
        </button>
        <button
          className="history-button right"
          onClick={historyManager.handleRedo}
          disabled={historyManager.redoStack.length === 0 || resetingCells}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>
    </div>
  );
};

export default Grid;
