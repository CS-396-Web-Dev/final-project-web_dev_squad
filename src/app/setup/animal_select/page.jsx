"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PetChooser from "../../components/PetChooser";

export default function AnimalSelect() {
  const [showLandingPage, setShowLandingPage] = useState(true); // Added a state to show the landing page
  const [selectedPet, setPetType] = useState(null);
  const router = useRouter();

  const petOptions = [
    { name: "dog", img: "/assets/dog/baby_dog.png" },
    { name: "cat", img: "/assets/cat/baby_cat.png" },
    { name: "fish", img: "/assets/fish/baby_fish.png" },
    { name: "chicken", img: "/assets/chicken/baby_chicken.png" },
    { name: "turtle", img: "/assets/turtle/baby_turtle.png" },
  ];

  const handleNextFromLanding = () => {
    setShowLandingPage(false); // Proceed to pet chooser
  };

  const handlePetSelection = (pet) => {
    setPetType(pet);
  };

  const handleNextFromChooser = () => {
    if (!selectedPet) {
      alert("Please select a pet!");
      return;
    }
    localStorage.setItem("selectedPet", JSON.stringify(selectedPet));
    router.push("/setup/bio_input"); // Proceed to the next screen (Entering info about pet)
  };

  // Landing page content
  if (showLandingPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-100">
        <h1 className="text-3xl font-bold mb-4">Welcome to Virtual Pet App!</h1>
        <p className="text-lg mb-8 text-center max-w-md">
          Raise your own virtual pet! Feed it, play with it, and watch it grow.
          Keep your pet's health metrics up to ensure it evolves through its life stages.
        </p>
        <button
          onClick={handleNextFromLanding}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    );
  }

  // Pet chooser content
  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-black mb-6">Pick Your Pet</h1>

      <div className="grid grid-cols-2 text-black sm:grid-cols-3 gap-4 mb-6">
        {petOptions.map((pet) => (
          <PetChooser
            key={pet.name}
            pet={pet}
            isSelected={selectedPet?.name === pet.name}
            onSelect={() => handlePetSelection(pet)}
          />
        ))}
      </div>

      <button
        onClick={handleNextFromChooser}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
