'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameOverModal from '../../components/game-over-modal';
import VictoryModal from '../../components/victory-modal';
import GlassTile from '../../components/glass-tile';

type TileStatus = 'unselected' | 'correct' | 'wrong' | 'current';

interface Tile {
  id: number;
  position: 'left' | 'right';
  isTempered: boolean;
  status: TileStatus;
  ref: React.RefObject<HTMLDivElement | null>;
}

interface ShardProps {
  width: number;
  height: number;
  rotation: number;
  left: number;
  top: number;
  delay: number;
}

export default function GlassBridgeGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [breakingTileId, setBreakingTileId] = useState<number | null>(null);
  const [showShards, setShowShards] = useState(false);
  const [shards, setShards] = useState<ShardProps[]>([]);
  const [breakPosition, setBreakPosition] = useState({ left: 0, top: 0 });
  const [imagePosition, setImagePosition] = useState(0); // Horizontal position of the image
  const [gameTranscript, setGameTranscript] = useState<any[]>([]); // Store the fetched game transcript
  const [transcriptIndex, setTranscriptIndex] = useState(0); // Keep track of current position in the transcript

  const TOTAL_PAIRS = 8;

  // Fetch the game transcript from the API
  const fetchGameTranscript = async () => {
    try {
      const response = await axios.get(
        'https://sentient-struggle-season0-ovv7g.ondigitalocean.app/db/games/3c6ffc89-dffc-479b-860e-c4bee92f4f02/conversation?sort_by=timestamp&sort_order=asc&limit=100&offset=0&round_number=2'
      );
      setGameTranscript(response.data); // Store the response data
    } catch (error) {
      console.error('Error fetching game transcript:', error);
    }
  };

  useEffect(() => {
    fetchGameTranscript(); // Fetch transcript when component loads
  }, []);

  // Process the transcript data and simulate the game flow
  useEffect(() => {
    if (!gameTranscript || gameTranscript.length === 0 || transcriptIndex >= gameTranscript.length)
      return;

    const currentEntry = gameTranscript[transcriptIndex];

    // Check if the current entry exists and has the correct structure
    if (!currentEntry || !currentEntry.message_type) {
      console.error('Invalid transcript entry:', currentEntry); // Debug log for invalid entry
      setTranscriptIndex(transcriptIndex + 1); // Skip invalid entry and move to the next one
      return;
    }

    if (currentEntry.message_type === 'response') {
      const choice = currentEntry.message_data.choice;
      console.log(`Agent's choice: ${choice}`); // Debug log for choice

      // Simulate the choice
      if (choice === 'left') {
        handleTileClick(currentPairIndex * 2); // Simulate left tile selection
      } else if (choice === 'right') {
        handleTileClick(currentPairIndex * 2 + 1); // Simulate right tile selection
      }
    } else if (currentEntry.message_type === 'game_state') {
      const { bridge_pattern, attempt_history } = currentEntry.message_data;
      console.log(`Bridge pattern: ${JSON.stringify(bridge_pattern)}`); // Debug log for the bridge pattern
    }

    // Move to the next entry in the transcript
    if (transcriptIndex < gameTranscript.length - 1) {
      setTranscriptIndex(transcriptIndex + 1); // Move to the next entry
    } else {
      setVictory(true); // End the game once the transcript is finished
    }
  }, [gameTranscript, transcriptIndex]);

  // Initialize the game and reset all values
  const initializeGame = () => {
    const newTiles: Tile[] = [];

    for (let i = 0; i < TOTAL_PAIRS; i++) {
      const isLeftTempered = Math.random() > 0.5;

      newTiles.push({
        id: i * 2,
        position: 'left',
        isTempered: isLeftTempered,
        status: i === 0 ? 'current' : 'unselected',
        ref: React.createRef<HTMLDivElement>(),
      });

      newTiles.push({
        id: i * 2 + 1,
        position: 'right',
        isTempered: !isLeftTempered,
        status: i === 0 ? 'current' : 'unselected',
        ref: React.createRef<HTMLDivElement>(),
      });
    }

    setTiles(newTiles);
    setCurrentPairIndex(0);
    setGameOver(false);
    setVictory(false);
    setScore(0);
    setGameStarted(true);
    setBreakingTileId(null);
    setShowShards(false);
    setShards([]);
    setImagePosition(0); // Reset image position when game starts
  };

  // Handle the tile selection logic
  const handleTileClick = (tileId: number) => {
    if (gameOver || victory || breakingTileId !== null) return;

    const clickedTile = tiles.find((tile) => tile.id === tileId);
    if (!clickedTile || clickedTile.status !== 'current') return;

    const updatedTiles = [...tiles];
    const clickedTileIndex = updatedTiles.findIndex((tile) => tile.id === tileId);

    if (clickedTile.isTempered) {
      updatedTiles[clickedTileIndex].status = 'correct';
      if (currentPairIndex < TOTAL_PAIRS - 1) {
        updatedTiles[2 * (currentPairIndex + 1)].status = 'current';
        updatedTiles[2 * (currentPairIndex + 1) + 1].status = 'current';
        setCurrentPairIndex(currentPairIndex + 1);
      } else {
        setVictory(true);
      }
      setScore(score + 1);
      if (score + 1 > maxScore) setMaxScore(score + 1);
    } else {
      updatedTiles[clickedTileIndex].status = 'wrong';
      setBreakingTileId(tileId);
      if (clickedTile.ref.current) generateShards(clickedTile.ref.current);

      setTimeout(() => {
        setShowShards(true);
        setTimeout(() => {
          setGameOver(true);
        }, 2000);
      }, 300);

      const otherTileInPair = updatedTiles.find(
        (tile) => tile.id !== tileId && Math.floor(tile.id / 2) === Math.floor(tileId / 2)
      );
      if (otherTileInPair) {
        const otherTileIndex = updatedTiles.findIndex((tile) => tile.id === otherTileInPair.id);
        updatedTiles[otherTileIndex].status = 'correct';
      }
    }
    setTiles(updatedTiles);
  };

  // Generate glass shards
  const generateShards = (tileElement: HTMLDivElement) => {
    const rect = tileElement.getBoundingClientRect();
    const containerRect = tileElement.parentElement?.parentElement?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    const left = rect.left - containerRect.left + rect.width / 2;
    const top = rect.top - containerRect.top + rect.height / 2 + 50;
    setBreakPosition({ left, top });

    const newShards: ShardProps[] = [
      { width: 30, height: 40, rotation: 0, left: -20, top: 20, delay: 0 },
      { width: 35, height: 45, rotation: 30, left: 20, top: 10, delay: 0.05 },
      { width: 25, height: 35, rotation: -15, left: -40, top: 30, delay: 0.1 },
    ];

    setShards(newShards);
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Background image */}
      <div className="game-background"></div>

      {/* Pixelated overlay effect */}
      <div className="pixelated-overlay"></div>

      {/* Display the Geminigma image at the start */}
      <img
        src="Geminigma.png"
        alt="Geminigma"
        style={{
          position: 'absolute',
          top: '10%', // Place it just above the tiles
          left: `calc(50% - 45px)`, // Center horizontally
          transform: `translateX(${imagePosition}%)`, // Move horizontally based on progress
          transition: 'transform 0.5s ease-out',
          width: '90px',
          height: 'auto',
        }}
      />

      {!gameStarted ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
          <h1 className="mb-8 text-5xl font-bold text-green-500">Glass Bridge Challenge</h1>
          <p className="mb-8 max-w-md px-4 text-center text-green-400">
            Choose the correct glass tile to cross the bridge. One tile is tempered and will hold
            your weight, the other will break. Use arrow keys or click to select.
          </p>
          <button
            onClick={initializeGame}
            className="rounded-md bg-green-500 px-8 py-4 text-xl font-bold text-black transition-colors hover:bg-green-400"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
            <div className="text-xl text-green-500">
              <span className="font-bold">Score: </span>
              <span>{score}</span>
            </div>
            <div className="text-xl text-green-500">
              <span className="font-bold">Best: </span>
              <span>{maxScore}</span>
            </div>
          </div>

          <div className="absolute bottom-[30%] w-full max-w-4xl px-4">
            <div className="relative">
              <div className="bridge-container">
                <div className="bridge-row">
                  {Array.from({ length: TOTAL_PAIRS }).map((_, pairIndex) => {
                    const leftTile = tiles.find(
                      (tile) => tile.position === 'left' && Math.floor(tile.id / 2) === pairIndex
                    );
                    return leftTile ? (
                      <GlassTile
                        key={`left-${pairIndex}`}
                        status={leftTile.status}
                        isBreaking={breakingTileId === leftTile.id}
                        ref={leftTile.ref}
                      />
                    ) : null;
                  })}
                </div>
                <div className="bridge-row">
                  {Array.from({ length: TOTAL_PAIRS }).map((_, pairIndex) => {
                    const rightTile = tiles.find(
                      (tile) => tile.position === 'right' && Math.floor(tile.id / 2) === pairIndex
                    );
                    return rightTile ? (
                      <GlassTile
                        key={`right-${pairIndex}`}
                        status={rightTile.status}
                        isBreaking={breakingTileId === rightTile.id}
                        ref={rightTile.ref}
                      />
                    ) : null;
                  })}
                </div>

                {/* Glass shards animation */}
                {showShards && breakingTileId !== null && (
                  <div
                    className="glass-shards-container"
                    style={{
                      left: breakPosition.left,
                      top: breakPosition.top,
                    }}
                  >
                    {shards.map((shard, i) => (
                      <div
                        key={i}
                        className="glass-shard"
                        style={{
                          width: `${shard.width}px`,
                          height: `${shard.height}px`,
                          transform: `rotate(${shard.rotation}deg)`,
                          left: `${shard.left}px`,
                          top: `${shard.top}px`,
                          opacity: 1,
                          transition: `transform 1s ease-out ${shard.delay}s, opacity 1.5s ease-out ${shard.delay + 0.5}s, top 1s ease-out ${shard.delay}s, left 1s ease-out ${shard.delay}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {gameOver && <GameOverModal score={score} onRestart={initializeGame} />}
          {victory && <VictoryModal score={score} onRestart={initializeGame} />}
        </>
      )}
    </div>
  );
}
