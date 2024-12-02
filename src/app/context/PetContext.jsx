"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

const PetContext = createContext();

const initialState = {
  name: "",
  stage: "Baby",
  metrics: { health: 5, happiness: 5, sleep: 5, energy: 5, hunger: 5 },
  tokens: 10,
  growthDays: 0,
  setupCompleted: false,
  selectedPet: null,
};

function petReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE_PET":
      return {
        ...state,
        name: action.payload.petName,
        selectedPet: action.payload.selectedPet,
        setupCompleted: true,
      };

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

      // Metric changes logic
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

        case "reset_tokens":
          newTokens = 10;
          break;

        case "validate_growth":
          if (
            newMetrics.health >= 4 &&
            newMetrics.happiness >= 3 &&
            newMetrics.sleep >= 4 &&
            newMetrics.energy >= 3
          ) {
            newGrowthDays += 1;
          }
          break;

        default:
          break;
      }

      // Stage Progression
      const growthStages = ["Baby", "Toddler", "Teenager", "Adult"];
      const currentStageIndex = growthStages.indexOf(stage);
      let newStage = stage;

      if (newGrowthDays >= 5 && currentStageIndex < growthStages.length - 1) {
        newStage = growthStages[currentStageIndex + 1];
        newGrowthDays = 0;
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
  const stateRef = useRef(state);

  // Update the ref whenever the state changes (need this for the intervaks to not reset)
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize pet data from localStorage
  useEffect(() => {
    if (!state.setupCompleted || !state.name || !state.selectedPet) {
      const storedPetData = JSON.parse(localStorage.getItem("petData"));
      if (storedPetData) {
        dispatch({ type: "INITIALIZE_PET", payload: storedPetData });
      }
    }
  }, [state.setupCompleted, state.name, state.selectedPet]);

  useEffect(() => {
    let tickCounter = 0;

    // Set up the interval for TICK actions
    const interval = setInterval(() => {
      tickCounter += 1;
      const currentState = stateRef.current;

      if (tickCounter % 24 === 0) {
        dispatch({ type: "TICK", payload: { metric: "reset_tokens" } });
        dispatch({ type: "TICK", payload: { metric: "validate_growth" } });
      }

      if (tickCounter % 12 === 0) {
        dispatch({ type: "TICK", payload: { metric: "hunger" } });
        dispatch({ type: "TICK", payload: { metric: "sleep" } });
      }

      if (tickCounter % 6 === 0) {
        dispatch({
          type: "TICK",
          payload: { metric: "happiness_if_hunger_low" },
        });
      }

      if (tickCounter % 12 === 0 && currentState.metrics.sleep <= 2) {
        dispatch({ type: "TICK", payload: { metric: "health_if_sleep_low" } });
      }
    }, 1000 * 60 * 60); // Interval runs every 1 hour currently (can cahnge to 1000 for each second interval)

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures interval is set up only once (GPT help used for this)

  // Navigate back to setup if pet dies
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
