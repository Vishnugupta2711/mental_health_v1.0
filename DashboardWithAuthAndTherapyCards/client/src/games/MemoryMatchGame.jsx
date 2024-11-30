import { useState } from "react";

const MemoryMatchGame = ({ onClose }) => {
  const [cards, setCards] = useState([
    { id: 1, pairId: 1, revealed: false },
    { id: 2, pairId: 1, revealed: false },
    { id: 3, pairId: 2, revealed: false },
    { id: 4, pairId: 2, revealed: false },
    // Add more cards here
  ]);
  const [revealedCards, setRevealedCards] = useState([]);

  const revealCard = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, revealed: !card.revealed } : card
      )
    );

    setRevealedCards((prev) => [...prev, id]);

    // Logic to check for a match
    if (revealedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === revealedCards[0]);
      const secondCard = cards.find((card) => card.id === id);
      if (firstCard.pairId === secondCard.pairId) {
        // Match found
      } else {
        // No match, flip cards back after a delay
      }
    }
  };

  return (
    <div className="memory-game flex flex-wrap gap-4 p-4 bg-white rounded-2xl shadow-lg">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => revealCard(card.id)}
          className={`w-16 h-16 ${
            card.revealed ? "bg-green-300" : "bg-gray-300"
          } rounded-lg`}
        ></div>
      ))}
    </div>
  );
};

export default MemoryMatchGame;
