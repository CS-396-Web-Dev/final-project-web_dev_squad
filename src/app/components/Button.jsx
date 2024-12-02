"use client";

export default function Button({ text, onClick }) {
    return (
      <button
        className="bg-black text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  