"use client"; // Client Component for interactive placeholders

import Button from "./components/Button";
import MetricBar from "./components/MetricBar";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <button
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        RESET
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Tony Soprano</h1>
        <p className="text-lg">Toddler</p>
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
