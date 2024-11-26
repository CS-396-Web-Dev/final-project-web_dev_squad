"use client";

import Button from "./components/Button";
import MetricBar from "./components/MetricBar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const petData = localStorage.getItem("petData");
    if (!petData) {
      router.push("/setup/animal_select"); // Added this effect function to check if the pet data is active (if not transition to setup screen)
    }
  }, [router]);

  const handleReset = () => {
    localStorage.removeItem("petData"); // Added the reset logic to remove the pet data from local storage
    router.push("/setup/animal_select"); // Transition to the setup screen
  }

  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <button
        onClick={handleReset} // Attached the reset logic
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        RESET
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Temp</h1>{" "}
        {/* Set this to the Pet's name from the class */}
        <p className="text-lg">Toddler </p>{" "}
        {/* this also probably needs changing */}
      </div>

      <div className="mb-6">
        <img
          src="/assets/cat/toddler_cat.png"
          alt="Tony Soprano the toddler cat (CHANGE THIS)" // this also probably needs changing appropriatly to the pet
          className="w-32 h-auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button text="Feed" onClick={() => alert("Feed clicked")} />
        <Button text="Sleep" onClick={() => alert("Sleep clicked")} />
        <Button text="Play" onClick={() => alert("Play clicked")} />
        <Button text="Vet" onClick={() => alert("Vet clicked")} />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Pet Metrics</h2>
        <div className="space-y-2">
          <MetricBar label="Health" value={3} />
          <MetricBar label="Happiness" value={5} />
          <MetricBar label="Sleep" value={2} />
          <MetricBar label="Energy" value={2} />
        </div>
      </div>
    </div>
  );
}
