import { useState } from "react";

const History = ({ initialGrid, onGridChange }) => {
  const [history, setHistory] = useState([initialGrid]);
  const [currentStep, setCurrentStep] = useState(0);
  const [redoStack, setRedoStack] = useState([]);
    
  const updateGrid = (newGrid) => {
    const newHistory = history.slice(0, currentStep + 1); // Discard redo history
    setHistory([...newHistory, newGrid]);
    setCurrentStep(newHistory.length);
    setRedoStack([]);
    onGridChange(newGrid); // Inform parent about the grid change
  };

  // Undo the last action
  const handleUndo = () => {
    if (currentStep > 0) {
      const prevGrid = history[currentStep - 1];
      setRedoStack([history[currentStep], ...redoStack]);
      setCurrentStep(currentStep - 1);
      onGridChange(prevGrid);
    }
  };

  // Redo the last undone action
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextGrid = redoStack[0];
      setHistory([...history.slice(0, currentStep + 1), nextGrid]);
      setCurrentStep(currentStep + 1);
      setRedoStack(redoStack.slice(1));
      onGridChange(nextGrid);
    }
  };

  // Reset the history to the initial state
  const resetHistory = () => {
    setHistory([initialGrid]);
    setCurrentStep(0);
    setRedoStack([]);
  };

  return {
    updateGrid,
    handleUndo,
    handleRedo,
    currentStep,
    redoStack,
    resetHistory,
  };
};

export default History;
