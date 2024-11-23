export default function PetChooser({ pet, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center p-4 rounded-lg border-2 shadow-md ${
        isSelected ? "border-blue-500 bg-blue-100" : "border-black-500 bg-white"
      } hover:bg-gray-100 transition`}
    >
      <img src={pet.img} alt={pet.name} className="w-20 h-20 mb-2" />
      <span className="text-lg font-medium">{pet.name}</span>
    </button>
  );
}
