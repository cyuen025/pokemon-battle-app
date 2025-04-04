import axios from 'axios';
import { getRandomPokemon, getMove, Pokemon, Move } from './apiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const pokemon1: Pokemon = {
  name: 'bulbasaur',
  moves: [{ move: { name: 'tackle', url: 'move-url-1' } }],
  sprites: { front_default: '', back_default: '' },
};

const pokemon2: Pokemon = {
  name: 'charmander',
  moves: [{ move: { name: 'scratch', url: 'move-url-2' } }],
  sprites: { front_default: '', back_default: '' },
};

const mockMove: Move = {
  name: 'tackle',
  power: 40,
};

describe('apiService', () => {
  it('should fetch two random Pokemon on success', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: pokemon1 });
    mockedAxios.get.mockResolvedValueOnce({ data: pokemon2 });

    const [result1, result2] = await getRandomPokemon();

    expect(result1).toEqual(pokemon1);
    expect(result2).toEqual(pokemon2);
  });

  it('returns [null, null] on failure', async () => {
    const spy = jest.spyOn(console, 'log');

    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    // const result = await getRandomPokemon();

    // expect(result).toEqual([null, null]);

    const [pokemon1, pokemon2] = await getRandomPokemon();

    expect(pokemon1).toBeNull();
    expect(pokemon2).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      'getRandomPokemon FAILED:',
      expect.any(Error)
    );
  });

  it('should fetch move data', async () => {
    const moveData: Move = { name: 'tackle', power: 40 };
    mockedAxios.get.mockResolvedValueOnce({ data: moveData });

    const result = await getMove('url');

    expect(result).toEqual(moveData);
  });
});

describe('getMove', () => {
  it('fetches a move successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockMove });

    const move = await getMove('move-url-1');

    expect(move).toEqual(mockMove);
  });

  it('returns null when an error occurs', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('network error'));

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const move = await getMove('move-url-1');

    expect(move).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'getMove FAILED:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
