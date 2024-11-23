"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BioInput() {
  const [petName, setPetName] = useState("");
  const [hometown, setHometown] = useState("");
  const [bio, setBio] = useState("");
  const [selectedPet, setPetType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const pet = JSON.parse(localStorage.getItem("selectedPet"));
    if (!pet) {
      router.push("/setup/pet-selection"); // Redirect to pet selection if no pet is selected
    }
    setPetType(pet);
  }, [router]);

  const handleSubmit = () => {
    if (!petName || !hometown || !bio) {
      alert("Please make sure to fill each field of your Pet's Bio Data");
      return;
    }

    const petData = {
      selectedPet,
      petName,
      hometown,
      bio,
    };
    // Redirects to main screen to view pet's metrics after setting the pet data (check to see if this works, is buggy rn)
    localStorage.setItem("petData", JSON.stringify(petData));
    router.push("/");
  };

  if (!selectedPet) return null;

  return (
    <div className="flex flex-col items-center bg-green-100 min-h-screen p-6 sm:p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Input your Pet's Information below:
      </h1>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Hometown"
          value={hometown}
          onChange={(e) => setHometown(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <textarea
          placeholder="What is your Pet's origin story?"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
