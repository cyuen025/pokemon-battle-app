import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Battle from './Battle';
import { Pokemon, Move, getMove } from '../apiService';

jest.mock('../apiService');
const mockedGetMove = getMove as jest.MockedFunction<typeof getMove>;

const mockPokemonA: Pokemon = {
  name: 'bulbasaur',
  moves: [{ move: { name: 'tackle', url: 'move-url-1' } }],
  sprites: { front_default: 'front-url-a', back_default: 'back-url-a' },
};

const mockPokemonB: Pokemon = {
  name: 'charmander',
  moves: [{ move: { name: 'scratch', url: 'move-url-2' } }],
  sprites: { front_default: 'front-url-b', back_default: 'back-url-b' },
};

const mockMoveA: Move = {
  name: 'tackle',
  power: 40,
};

const mockMoveB: Move = {
  name: 'scratch',
  power: 50,
};

describe('Battle component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<Battle pokemonA={mockPokemonA} pokemonB={mockPokemonB} />);

    expect(screen.getByText('Click Start Battle!')).toBeInTheDocument();
    expect(
      screen.queryByText('An error occurred during battle.')
    ).not.toBeInTheDocument();
  });

  it('renders correctly with no Pokemon selected', () => {
    render(<Battle pokemonA={null} pokemonB={null} />);

    expect(screen.getByText('Please click Select Pokémon')).toBeInTheDocument();
  });

  it('renders correctly with Pokemon selected', () => {
    render(<Battle pokemonA={mockPokemonA} pokemonB={mockPokemonB} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.getByAltText('bulbasaur')).toHaveAttribute(
      'src',
      'front-url-a'
    );
    expect(screen.getByAltText('charmander')).toHaveAttribute(
      'src',
      'back-url-b'
    );
    expect(screen.getByText('Click Start Battle!')).toBeInTheDocument();
  });

  it('starts the battle and updates the battle log with the result', async () => {
    mockedGetMove
      .mockResolvedValueOnce(mockMoveA)
      .mockResolvedValueOnce(mockMoveB);

    render(<Battle pokemonA={mockPokemonA} pokemonB={mockPokemonB} />);

    fireEvent.click(screen.getByText('Start Battle!'));

    expect(mockedGetMove).toHaveBeenCalledTimes(2);
    expect(await screen.findByText('tackle: 40')).toBeInTheDocument();
    expect(await screen.findByText('scratch: 50')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'charmander lands a decisive blow with scratch, knocking out bulbasaur!'
      )
    ).toBeInTheDocument();
  });

  it('handles errors during the battle and updates the battle log', async () => {
    mockedGetMove
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockRejectedValueOnce(new Error('Network Error'));

    render(<Battle pokemonA={mockPokemonA} pokemonB={mockPokemonB} />);

    fireEvent.click(screen.getByText('Start Battle!'));

    expect(mockedGetMove).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText('An error occurred during battle.')
    ).toBeInTheDocument();
  });
});
