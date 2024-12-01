"use client";

import Button from "./components/Button";
import MetricBar from "./components/MetricBar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePet } from "./context/PetContext";

export default function Home() {
  const { state, dispatch } = usePet();
  const router = useRouter();

  useEffect(() => {
    const petData = localStorage.getItem("petData");
    if (!petData) {
      router.push("/setup/animal_select"); // Added this effect function to check if the pet data is active (if not transition to setup screen)
    } else if (!state.setupCompleted) {
      // Only decrease metrics when setup is complete
      dispatch({ type: "SET_SETUP_COMPLETED" });
    }
  }, [router, state.setupCompleted, dispatch]);

  const handleReset = () => {
    localStorage.clear();
    dispatch({ type: "RESET" });
    router.push("/setup/animal_select"); // Transition to the setup screen
  };

  const handleInteract = (actionType) => {
    if (state.tokens > 0) {
      dispatch({ type: "INTERACT", payload: { type: actionType } });
    }
  };

  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <button
        onClick={handleReset} // Attached the reset logic
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        RESET
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">{state.name}</h1>
        <p className="text-lg">{state.stage}</p>
      </div>

      <div className="mb-6">
        {state.selectedPet && (
          <img
            src={`/assets/${
              state.selectedPet.name
            }/${state.stage.toLowerCase()}_${state.selectedPet.name}.png`}
            alt={`${state.name} the ${state.stage.toLowerCase()} ${
              state.selectedPet.name
            }`}
            className="w-32 h-auto"
          />
        )}
      </div>

      {/* integrated button clicks with logic from context provider */}
      <div className="grid grid-cols-2 gap-4">
        <Button text="Feed" onClick={() => handleInteract("feed")} />
        <Button text="Sleep" onClick={() => handleInteract("sleep")} />
        <Button text="Play" onClick={() => handleInteract("play")} />
        <Button text="Vet" onClick={() => handleInteract("vet")} />
      </div>

      {/* displays current state values on each metric bar */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Pet Metrics</h2>
        <div className="space-y-2">
          <MetricBar label="Health" value={state.metrics.health} />
          <MetricBar label="Happiness" value={state.metrics.happiness} />
          <MetricBar label="Sleep" value={state.metrics.sleep} />
          <MetricBar label="Energy" value={state.metrics.energy} />
          <MetricBar label="Hunger" value={state.metrics.hunger} />
        </div>
      </div>

      <div className="mt-6">
        {/* amount of times remaining user can interact with pet */}
        <p className="text-lg font-semibold">Tokens: {state.tokens}</p>
        {/* days sustained in current growth stage */}
        <p className="text-lg font-semibold">Growth Days: {state.growthDays}</p>
      </div>
    </div>
  );
}
