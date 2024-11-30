import { useNavigate } from "react-router-dom";

const GamesSelectionPage = () => {
  const navigate = useNavigate();

  const games = [
    { name: "Whack Mole", path: "/games/whack-mole" },
    { name: "Collect & Calm", path: "/games/collect" },
    { name: "Memory Match", path: "/games/memory-match" }, // New game
    { name: "Reaction Speed", path: "/games/reaction-speed" }, // New game
  ];

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose a Game</h1>
      <div className="grid grid-cols-2 gap-4">
        {games.map((game) => (
          <button
            key={game.name}
            onClick={() => navigate(game.path)}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold transition duration-200 hover:bg-blue-700"
          >
            {game.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamesSelectionPage;
