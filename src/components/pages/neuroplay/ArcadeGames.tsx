import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Brain,
  Zap,
  ArrowLeft,
  Timer,
} from 'lucide-react';
import {
  KIDS_ARCADE_GAMES_LIST,
  FOCUS_NUMBERS_ROUNDS,
  BINGO_ROUNDS,
  FINGER_SEQUENCE_STAGES,
} from './kidsArcadeData';
import { playSpeech, stopSpeech } from '../../../utils/translationService';

interface ArcadeGamesProps {
  gameId: string;
  onBackToArcade: () => void;
  onAddXp: (amount: number, gameName: string) => void;
}

export const ArcadeGames: React.FC<ArcadeGamesProps> = ({
  gameId,
  onBackToArcade,
  onAddXp,
}) => {
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const speak = (text: string) => {
    stopSpeech();
    playSpeech(text, 'en', 0.9);
  };

  // ---------------------------------------------------------------------------
  // Game 1: Memory Match (Card Flip Game with 🍎, 🍌, 🍇, 🐶, 🐱, 🦁)
  // ---------------------------------------------------------------------------
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  useEffect(() => {
    if (gameId === 'memory_match') {
      initMemoryMatch();
    } else if (gameId === 'focus_numbers') {
      initFocusNumbers();
    } else if (gameId === 'number_bingo') {
      initBingoRound(0);
    } else if (gameId === 'finger_sequence') {
      initFingerSequence(0);
    }
  }, [gameId]);

  const initMemoryMatch = () => {
    const emojis = ['🍎', '🍌', '🍇', '🐶', '🐱', '🦁'];
    const deck = [...emojis, ...emojis].map((symbol, idx) => ({
      id: idx,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setFeedback(null);
    setIsCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        // Match found!
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setMemoryCards(newCards);
        setFlippedIndices([]);
        speak(`Matched ${newCards[firstIdx].symbol}!`);

        if (newCards.every((c) => c.isMatched)) {
          setIsCompleted(true);
          onAddXp(80, 'Memory Match');
          setFeedback('🎉 Outstanding! You matched all 6 pairs!');
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setMemoryCards(newCards);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Game 2: Focus Numbers (Spot the Target Number)
  // ---------------------------------------------------------------------------
  const [fnTappedIndices, setFnTappedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  const initFocusNumbers = () => {
    setCurrentRound(0);
    setFnTappedIndices([]);
    setTimeLeft(25);
    setIsCompleted(false);
    setFeedback(null);
  };

  useEffect(() => {
    if (gameId !== 'focus_numbers' || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFeedback('Time is up! Tap Restart to try again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameId, currentRound, isCompleted]);

  const fnData = FOCUS_NUMBERS_ROUNDS[currentRound] || FOCUS_NUMBERS_ROUNDS[0];

  const handleFnTap = (idx: number, val: number) => {
    if (fnTappedIndices.includes(idx) || timeLeft === 0) return;
    if (val === fnData.targetDigit) {
      const updated = [...fnTappedIndices, idx];
      setFnTappedIndices(updated);
      speak(`${val}!`);
      if (updated.length === fnData.targetCount) {
        if (currentRound < FOCUS_NUMBERS_ROUNDS.length - 1) {
          setFeedback(`Great focus! Found all ${fnData.targetDigit}s! Advancing...`);
          setTimeout(() => {
            setCurrentRound((r) => r + 1);
            setFnTappedIndices([]);
            setTimeLeft(25);
            setFeedback(null);
          }, 1200);
        } else {
          setIsCompleted(true);
          onAddXp(70, 'Focus Numbers');
          setFeedback('🎉 AMAZING FOCUS! Spot-the-Number completed all 5 rounds!');
        }
      }
    } else {
      setFeedback(`Look closely! Tap only the number ${fnData.targetDigit}.`);
    }
  };

  // ---------------------------------------------------------------------------
  // Game 3: Number Bingo (Audio Stamp Game)
  // ---------------------------------------------------------------------------
  const [bingoStampedIndices, setBingoStampedIndices] = useState<number[]>([]);

  const initBingoRound = (roundIdx: number) => {
    setCurrentRound(roundIdx);
    setBingoStampedIndices([]);
    setFeedback(null);
    setIsCompleted(false);
    const round = BINGO_ROUNDS[roundIdx] || BINGO_ROUNDS[0];
    setTimeout(() => {
      speak(round.audioText);
    }, 400);
  };

  const bingoData = BINGO_ROUNDS[currentRound] || BINGO_ROUNDS[0];

  const handleBingoTap = (idx: number, val: number) => {
    if (val === bingoData.callNumber) {
      if (!bingoStampedIndices.includes(idx)) {
        const updated = [...bingoStampedIndices, idx];
        setBingoStampedIndices(updated);
        speak(`Bingo! Stamped ${val}!`);
        if (currentRound < BINGO_ROUNDS.length - 1) {
          setFeedback(`Bingo! Stamped ${val}! Moving to next number...`);
          setTimeout(() => {
            initBingoRound(currentRound + 1);
          }, 1400);
        } else {
          setIsCompleted(true);
          onAddXp(75, 'Number Bingo');
          setFeedback('🎉 BINGO CHAMPION! Completed all 5 spoken callouts!');
        }
      }
    } else {
      setFeedback(`Listen closely! The called number is: ${bingoData.callNumber}`);
      speak(`Number ${bingoData.callNumber}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Game 4: Finger Sequence (Pattern Follower: 👈, 👆, 👉, 👇)
  // ---------------------------------------------------------------------------
  const [fsUserSeq, setFsUserSeq] = useState<string[]>([]);
  const [fsActiveFlashingIdx, setFsActiveFlashingIdx] = useState<number | null>(null);

  const initFingerSequence = (stageIdx: number) => {
    setCurrentRound(stageIdx);
    setFsUserSeq([]);
    setFeedback(null);
    setIsCompleted(false);
    playFingerSequenceAnimation(stageIdx);
  };

  const playFingerSequenceAnimation = (stageIdx: number) => {
    const stage = FINGER_SEQUENCE_STAGES[stageIdx] || FINGER_SEQUENCE_STAGES[0];
    speak(stage.audioText);
    stage.sequence.forEach((item, idx) => {
      setTimeout(() => {
        setFsActiveFlashingIdx(idx);
        setTimeout(() => setFsActiveFlashingIdx(null), 400);
      }, (idx + 1) * 700);
    });
  };

  const fsData = FINGER_SEQUENCE_STAGES[currentRound] || FINGER_SEQUENCE_STAGES[0];

  const handleFsTap = (item: string) => {
    const nextSeq = [...fsUserSeq, item];
    setFsUserSeq(nextSeq);
    speak(item.split(' ')[1] || item);

    // Check partial correctness
    const isCorrectSoFar = nextSeq.every((val, idx) => val === fsData.sequence[idx]);
    if (!isCorrectSoFar) {
      setFeedback('Oops! Sequence broke. Watch again!');
      setTimeout(() => {
        setFsUserSeq([]);
        playFingerSequenceAnimation(currentRound);
      }, 1000);
      return;
    }

    if (nextSeq.length === fsData.sequence.length) {
      if (currentRound < FINGER_SEQUENCE_STAGES.length - 1) {
        setFeedback(`Level ${currentRound + 1} Cleared! Preparing next sequence...`);
        setTimeout(() => {
          initFingerSequence(currentRound + 1);
        }, 1400);
      } else {
        setIsCompleted(true);
        onAddXp(80, 'Finger Sequence');
        setFeedback('🎉 PATTERN MASTER! Cleared all 5 gesture levels!');
      }
    }
  };

  const currentGameInfo = KIDS_ARCADE_GAMES_LIST.find((g) => g.id === gameId) || KIDS_ARCADE_GAMES_LIST[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200">
      {/* Game Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {currentGameInfo.categoryTag}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {currentGameInfo.levelPill}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {currentGameInfo.points}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{currentGameInfo.emoji}</span>
            <span>{currentGameInfo.title}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">{currentGameInfo.description}</p>
        </div>

        <button
          type="button"
          onClick={onBackToArcade}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Games</span>
        </button>
      </div>

      {/* Completion Modal / Celebration Overlay */}
      {isCompleted ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-md animate-bounce">
            🏆
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-900">Game Completed!</h3>
          <p className="text-sm font-bold text-emerald-800">
            {feedback || 'Fantastic effort! You earned bonus XP for completing the game!'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (gameId === 'memory_match') initMemoryMatch();
                if (gameId === 'focus_numbers') initFocusNumbers();
                if (gameId === 'number_bingo') initBingoRound(0);
                if (gameId === 'finger_sequence') initFingerSequence(0);
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              type="button"
              onClick={onBackToArcade}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md cursor-pointer"
            >
              <span>← Back to Games</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ===================================================================
              GAME 1: MEMORY MATCH (CARD FLIP GAME)
             =================================================================== */}
          {gameId === 'memory_match' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Total Moves: <strong className="text-indigo-600">{memoryMoves}</strong></span>
                <button
                  onClick={initMemoryMatch}
                  className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer font-extrabold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Shuffle & Restart</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
                {memoryCards.map((card, idx) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(idx)}
                    className={`h-24 sm:h-28 rounded-2xl border-2 font-black text-3xl sm:text-4xl transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md ring-2 ring-emerald-300'
                        : card.isFlipped
                        ? 'bg-amber-50 border-amber-400 text-slate-900'
                        : 'bg-indigo-600 border-indigo-700 text-transparent hover:bg-indigo-700 hover:scale-105'
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? card.symbol : '❓'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              GAME 2: FOCUS NUMBERS (SPOT THE TARGET NUMBER)
             =================================================================== */}
          {gameId === 'focus_numbers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-amber-500 text-white font-black text-lg shadow-xs">
                    {fnData.prompt}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-amber-700">Round {fnData.round} of 5</div>
                    <div className="text-xs font-bold text-slate-600">Spot all occurrences of {fnData.targetDigit}!</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span>Timer: {timeLeft}s</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-xs sm:max-w-md mx-auto">
                {fnData.grid.map((num, idx) => {
                  const isTapped = fnTappedIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFnTap(idx, num)}
                      className={`h-20 rounded-2xl font-black text-2xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                        isTapped
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-95'
                          : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-800 hover:bg-amber-50'
                      }`}
                    >
                      {num} {isTapped && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================
              GAME 3: NUMBER BINGO (AUDIO STAMP GAME)
             =================================================================== */}
          {gameId === 'number_bingo' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-emerald-700">Bingo Call {bingoData.round} of 5</div>
                  <div className="text-xl font-black text-emerald-950">Callout: {bingoData.callNumber}</div>
                </div>
                <button
                  onClick={() => speak(bingoData.audioText)}
                  className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs hover:bg-emerald-700"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Repeat Callout 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-xs sm:max-w-md mx-auto">
                {bingoData.grid.map((num, idx) => {
                  const isStamped = bingoStampedIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleBingoTap(idx, num)}
                      className={`h-20 rounded-2xl font-black text-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isStamped
                          ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-95'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{num}</span>
                      {isStamped && <span className="text-[10px] font-black text-amber-900">⭐ STAMPED</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================
              GAME 4: FINGER SEQUENCE (PATTERN FOLLOWER: 👈, 👆, 👉, 👇)
             =================================================================== */}
          {gameId === 'finger_sequence' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-sky-700">{fsData.name}</div>
                  <div className="text-sm font-extrabold text-slate-900">Watch the pattern & repeat in order:</div>
                </div>
                <button
                  onClick={() => playFingerSequenceAnimation(currentRound)}
                  className="p-3 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs hover:bg-sky-700"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Watch Pattern 🔊</span>
                </button>
              </div>

              {/* Target Sequence Display */}
              <div className="p-4 rounded-2xl bg-slate-100 border flex flex-wrap gap-2 justify-center">
                {fsData.sequence.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-3.5 py-2 rounded-xl font-extrabold text-sm transition-all ${
                      fsActiveFlashingIdx === idx
                        ? 'bg-amber-400 text-slate-900 scale-110 shadow-md ring-2 ring-amber-500'
                        : 'bg-white border text-slate-800 shadow-2xs'
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Tapped Sequence Progress */}
              <div className="space-y-2 text-center">
                <div className="text-xs font-bold text-slate-500">Your Tap Progress:</div>
                <div className="flex flex-wrap justify-center gap-2 min-h-[42px]">
                  {fsUserSeq.map((item, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-2xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gesture Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                {['👈 Left', '👆 Up', '👉 Right', '👇 Down'].map((gesture) => (
                  <button
                    key={gesture}
                    type="button"
                    onClick={() => handleFsTap(gesture)}
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-sky-500 hover:text-white font-black text-base transition-all shadow-xs cursor-pointer text-center hover:scale-105"
                  >
                    {gesture}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Feedback Box */}
          {feedback && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold text-center animate-in fade-in">
              {feedback}
            </div>
          )}
        </>
      )}
    </div>
  );
};
