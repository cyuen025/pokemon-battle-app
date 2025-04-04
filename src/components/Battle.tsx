import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon, Move, getMove } from '../apiService';

interface BattleProps {
  pokemonA: Pokemon | null;
  pokemonB: Pokemon | null;
}

const Battle: React.FC<BattleProps> = ({ pokemonA, pokemonB }: BattleProps) => {
  const [moveA, setMoveA] = useState<Move | null>(null);
  const [moveB, setMoveB] = useState<Move | null>(null);
  const [battleLog, setBattleLog] = useState<string>('');

  // Reset battle state when new Pokemon are selected
  useEffect(() => {
    setMoveA(null);
    setMoveB(null);
    setBattleLog('');
  }, [pokemonA, pokemonB]);

  // Returns a random move from an array of moves
  const getRandomMove = useCallback(
    (
      moves: { move: { name: string; url: string } }[]
    ): { move: { name: string; url: string } } => {
      const moveIndex = Math.floor(Math.random() * moves.length);
      return moves[moveIndex];
    },
    []
  );

  const startBattle = useCallback(async () => {
    if (pokemonA && pokemonB) {
      const move1 = getRandomMove(pokemonA.moves);
      const move2 = getRandomMove(pokemonB.moves);

      try {
        const [moveAData, moveBData] = await Promise.all([
          getMove(move1.move.url),
          getMove(move2.move.url),
        ]);

        setMoveA(moveAData);
        setMoveB(moveBData);
      } catch (err) {
        setBattleLog('An error occurred during battle.');
      }
    }
  }, [pokemonA, pokemonB, getRandomMove]);

  useEffect(() => {
    if (pokemonA && pokemonB && moveA && moveB) {
      const powerA = moveA.power || 0;
      const powerB = moveB.power || 0;

      // Determine outcome
      if (powerA === powerB) {
        setBattleLog('Draw!');
      } else if (powerA > powerB) {
        setBattleLog(
          `${pokemonA.name} lands a decisive blow with ${moveA.name}, knocking out ${pokemonB.name}!`
        );
      } else {
        setBattleLog(
          `${pokemonB.name} lands a decisive blow with ${moveB.name}, knocking out ${pokemonA.name}!`
        );
      }
    }
  }, [moveA, moveB]);

  if (pokemonA && pokemonB) {
    return (
      <>
        <div className='pokemon-view'>
          <div className='flex justify-center'>
            <div className='bg-slate-100 w-3/4 border border-black rounded flex items-center my-auto px-5 py-3'>
              <div className='capitalize font-bold text-lg'>
                {pokemonA.name}
              </div>
              {moveA && (
                <div className='border rounded-full ml-auto px-2 py-1 text-sm bg-green-300 border-green-500 capitalize'>
                  {moveA.name}: {moveA.power ? moveA.power : 0}
                </div>
              )}
            </div>
            <div className='w-1/4 flex justify-center'>
              <img src={pokemonA.sprites.front_default} alt={pokemonA.name} />
            </div>
          </div>

          <div className='flex'>
            <div className='w-1/4 flex justify-center'>
              <img src={pokemonB.sprites.back_default} alt={pokemonB.name} />
            </div>
            <div className='bg-slate-100 w-3/4 border border-black rounded flex items-center my-auto px-5 py-3'>
              <div className='capitalize font-bold text-lg'>
                {pokemonB.name}
              </div>
              {moveB && (
                <div className='border rounded-full ml-auto px-2 py-1 text-sm bg-green-300 border-green-500 capitalize'>
                  {moveB.name}: {moveB.power ? moveB.power : 0}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='battle-log'>
          <h3 className='font-bold'>Battle Log</h3>
          <div className='flex mt-3'>
            <div className='border rounded border-black w-full mr-3 px-3 py-2 text-sm'>
              {!battleLog && 'Click Start Battle!'}
              {battleLog}
            </div>
            <button
              className='block bg-blue-500 hover:bg-blue-600 text-white font-bold ml-auto py-2 px-3 w-60 rounded'
              onClick={startBattle}
            >
              Start Battle!
            </button>
          </div>
        </div>
      </>
    );
  }

  return <div className='text-center mb-5'>Please click Select Pokémon</div>;
};

export default Battle;
