"use client";

import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

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
          newTokens -= 1;
        } else if (type === "sleep") {
          newMetrics.sleep += 1;
          newTokens -= 1;
        } else if (type === "feed") {
          newMetrics.hunger += 1;
          newMetrics.energy += 1;
          newTokens -= 1;
        } else if (type === "vet" && newTokens >= 3) {
          newMetrics.health = 5;
          newMetrics.happiness = 3;
          newMetrics.sleep = 5;
          newMetrics.energy = 3;
          newTokens -= 3;
        }
      }
      return { ...state, metrics: newMetrics, tokens: newTokens };
    }

    case "TICK": {
      if (!state.setupCompleted) return state;

      const { metrics, growthDays, stage, tokens } = state;
      const { metric } = action.payload;
      let newMetrics = { ...metrics };
      let newGrowthDays = growthDays;
      let newTokens = tokens;

      // Metrics Decrease
      switch (metric) {
        case "sleep":
          newMetrics.sleep = Math.max(0, newMetrics.sleep - 1);
          break;

        case "hunger":
          newMetrics.hunger = Math.max(0, newMetrics.hunger - 1);
          break;

        case "happiness_if_hunger_low":
          if (newMetrics.hunger < 3) {
            newMetrics.happiness = Math.max(0, newMetrics.happiness - 1);
          }
          break;

        case "health_if_sleep_low":
          if (newMetrics.sleep <= 2) {
            newMetrics.health = Math.max(0, newMetrics.health - 1);
          }
          break;

        default:
          break;
      }

      // Token Refill
      if (metric === "reset_tokens") {
        newTokens = 10;
      }

      // Check for Growth
      if (metric === "validate_growth") {
        if (
          newMetrics.health >= 4 &&
          newMetrics.happiness >= 3 &&
          newMetrics.sleep >= 4 &&
          newMetrics.energy >= 3
        ) {
          newGrowthDays += 1;
        }
      }

      // Stage Progression
      const growthStages = ["Baby", "Toddler", "Teenager", "Adult"];
      const currentStageIndex = growthStages.indexOf(stage);
      let newStage = stage;

      if (newGrowthDays >= 10 && currentStageIndex < growthStages.length - 1) {
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
  const router = useRouter();

  useEffect(() => {
    let tickCounter = 0;

    const interval = setInterval(() => {
      tickCounter += 1;

      if (tickCounter % 24 === 0) {
        // Decrement sleep daily
        dispatch({ type: "TICK", payload: { metric: "sleep" } });
        dispatch({ type: "TICK", payload: { metric: "reset_tokens" } });
        dispatch({ type: "TICK", payload: { metric: "validate_growth" } });
      }

      if (tickCounter % 12 === 0) {
        // Decrement hunger every 12 hours
        dispatch({ type: "TICK", payload: { metric: "hunger" } });
      }

      if (tickCounter % 6 === 0) {
        // Decrease happiness if hunger < 3 every 6 hours
        dispatch({
          type: "TICK",
          payload: { metric: "happiness_if_hunger_low" },
        });
      }

      if (tickCounter % 12 === 0 && state.metrics.sleep <= 2) {
        // Decrease health if sleep <= 2 every 12 hours
        dispatch({ type: "TICK", payload: { metric: "health_if_sleep_low" } });
      }
    }, 1000 * 60 * 60); // For demonstration: 1000 milliseconds x 60 seconds x 60 min = 1 hour

    return () => clearInterval(interval);
  }, [state.metrics.sleep, state.metrics.hunger, dispatch]);

  // Naviagte back to setup if pet dies
  useEffect(() => {
    if (state.metrics.health === 0) {
      localStorage.removeItem("petData");
      dispatch({ type: "RESET" });
      router.push("/setup/animal_select");
    }
  }, [state.metrics.health, router]);

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
