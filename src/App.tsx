import React, { useState } from 'react';
import { Pokemon, getRandomPokemon } from './apiService';
import Battle from './components/Battle';

const App: React.FC = () => {
  const [pokemonA, setPokemonA] = useState<Pokemon | null>(null);
  const [pokemonB, setPokemonB] = useState<Pokemon | null>(null);

  const fetchRandomPokemon = async () => {
    const [pokemon1, pokemon2] = await getRandomPokemon();
    setPokemonA(pokemon1);
    setPokemonB(pokemon2);
  };

  return (
    <div className='container mx-auto max-w-xl mt-5 px-5 pb-5 rounded border border-black'>
      <button
        className='block mx-auto my-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        onClick={fetchRandomPokemon}
      >
        Select Pokémon
      </button>
      <Battle pokemonA={pokemonA} pokemonB={pokemonB} />
    </div>
  );
};

export default App;
