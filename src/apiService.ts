import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export interface Pokemon {
  name: string;
  moves: { move: { name: string; url: string } }[];
  sprites: { front_default: string; back_default: string };
}

export interface Move {
  name: string;
  power: number;
}

// Generate random Gen 1 ID
const getRandomId = (): number => {
  return Math.floor(Math.random() * 151) + 1;
};

// Fetch two random Pokemon from the API
export const getRandomPokemon = async (): Promise<
  [Pokemon | null, Pokemon | null]
> => {
  try {
    const [pokemon1, pokemon2] = await Promise.all([
      axios.get<Pokemon>(BASE_URL + '/pokemon/' + getRandomId()),
      axios.get<Pokemon>(BASE_URL + '/pokemon/' + getRandomId()),
    ]);
    return [pokemon1.data, pokemon2.data];
  } catch (err) {
    console.log('getRandomPokemon FAILED:', err);
  }

  return [null, null];
};

// Fetch Move from API
export const getMove = async (url: string): Promise<Move | null> => {
  try {
    const response = await axios.get<Move>(url);
    return response.data;
  } catch (err) {
    console.log('getMove FAILED:', err);
  }

  return null;
};
