"use client";

import React, { createContext, useReducer, useContext, useEffect } from "react";

const PetContext = createContext();

const initialState = {
  name: "",
  stage: "Baby",
  metrics: { health: 5, happiness: 5, sleep: 5, energy: 5, hunger: 5 },
  tokens: 10,
  growthDays: 0,
  setupCompleted: false, // Flag to prevent metrics from decreasing before setup
};

function petReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return { ...initialState };

    case "INTERACT": {
      const { type } = action.payload;
      const { metrics, tokens } = state;
      let newMetrics = { ...metrics };
      let newTokens = tokens;

      if (newTokens > 0) {
        if (type === "play") {
          newMetrics.energy -= 1;
          newMetrics.happiness += 1;
        } else if (type === "sleep") {
          newMetrics.sleep += 1;
        } else if (type === "feed") {
          newMetrics.hunger += 1;
          newMetrics.energy += 1;
        } else if (type === "vet") {
          newMetrics.health = 5;
          newMetrics.happiness = 3;
          newMetrics.sleep = 5;
          newMetrics.energy = 3;
        }
        newTokens -= 1;
      }
      return { ...state, metrics: newMetrics, tokens: newTokens };
    }

    case "TICK": {
      if (!state.setupCompleted) return state;

      const { metrics, growthDays, stage, tokens } = state;
      let newMetrics = { ...metrics };
      let newGrowthDays = growthDays;
      let newTokens = tokens;

      // Metrics Decrease
      newMetrics.sleep = Math.max(0, newMetrics.sleep - 1);
      newMetrics.hunger = Math.max(0, newMetrics.hunger - 1);

      if (newMetrics.hunger < 3) {
        newMetrics.happiness = Math.max(0, newMetrics.happiness - 1);
      }
      if (newMetrics.sleep <= 2) {
        newMetrics.health = Math.max(0, newMetrics.health - 1);
      }

      // Token Refill
      if (newTokens < 10) {
        newTokens += 2; // Increase tokens up to a maximum of 10
      }

      // Check for Growth
      if (
        newMetrics.health >= 4 &&
        newMetrics.happiness >= 3 &&
        newMetrics.sleep >= 4 &&
        newMetrics.energy >= 3
      ) {
        newGrowthDays += 1;
      }

      // Stage Progression
      const growthStages = ["Baby", "Toddler", "Teenager", "Adult"];
      const currentStageIndex = growthStages.indexOf(stage);
      let newStage = stage;

      if (newGrowthDays >= 3 && currentStageIndex < growthStages.length - 1) {
        newStage = growthStages[currentStageIndex + 1];
        newGrowthDays = 0; // Reset growth days after stage change
      }

      return {
        ...state,
        metrics: newMetrics,
        growthDays: newGrowthDays,
        stage: newStage,
        tokens: newTokens,
      };
    }

    case "SET_SETUP_COMPLETED":
      return { ...state, setupCompleted: true };

    default:
      return state;
  }
}

function PetProvider({ children }) {
  const [state, dispatch] = useReducer(petReducer, initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 60 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <PetContext.Provider value={{ state, dispatch }}>
      {children}
    </PetContext.Provider>
  );
}

function usePet() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePet must be used within a PetProvider");
  }
  return context;
}

export { PetContext, PetProvider, usePet };