"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PetChooser from "../../components/PetChooser";

export default function AnimalSelect() {
  const [selectedPet, setPetType] = useState(null);
  const router = useRouter();

  const petOptions = [
    { name: "Dog", img: "/assets/dog/baby_dog.png" },
    { name: "Cat", img: "/assets/cat/baby_cat.png" },
    { name: "Fish", img: "/assets/fish/baby_fish.png" },
    { name: "Bird", img: "/assets/chicken/baby_chicken.png" },
    { name: "Turtle", img: "/assets/turtle/baby_turtle.png" },
  ];

  const handleNext = () => {
    if (!selectedPet) {
      alert("Please select a pet!");
      return;
    }
    localStorage.setItem("selectedPet", JSON.stringify(selectedPet));
    router.push("/setup/bio_input"); // This is to progress to the next screen (Entering info about pet)
  };

  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-black mb-6">Pick Your Pet</h1>

      <div className="grid grid-cols-2 text-black sm:grid-cols-3 gap-4 mb-6">
        {petOptions.map((pet) => (
          <PetChooser
            key={pet.name}
            pet={pet}
            isSelected={selectedPet?.name === pet.name}
            onSelect={() => setPetType(pet)}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
