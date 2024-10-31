import { useState, useRef, useEffect } from 'react';
import '../styles/Game.css';
import bgVideo from '../assets/videos/bg.mp4';
import winVideo from '../assets/videos/win.mp4';
import loseVideo from '../assets/videos/lose.mp4';

function Game() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('bg');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const bgVideoRef = useRef(null);
  const winVideoRef = useRef(null);
  const loseVideoRef = useRef(null);

  useEffect(() => {
    // Start background video loop when component mounts
    if (bgVideoRef.current) {
      bgVideoRef.current.play();
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.starknet) {
        alert('Please install Braavos wallet');
        window.open('https://braavos.app', '_blank');
        return;
      }

      await window.starknet.enable();
      const userAccount = window.starknet.selectedAddress;
      
      if (userAccount) {
        setAccount(userAccount);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    }
  };

  const handleGameEnd = (won) => {
    setGamesPlayed(prev => prev + 1);
    if (won) setGamesWon(prev => prev + 1);
    setCurrentVideo('bg');
    setIsPlaying(false);
    bgVideoRef.current.play();
  };

  const playGame = async () => {
    if (!isConnected || isPlaying) {
      return;
    }

    try {
      setIsPlaying(true);
      const result = Math.random() > 0.5;
      const videoToPlay = result ? winVideoRef.current : loseVideoRef.current;
      
      if (videoToPlay) {
        setCurrentVideo(result ? 'win' : 'lose');
        videoToPlay.currentTime = 0;
        await videoToPlay.play();
        
        videoToPlay.onended = () => {
          handleGameEnd(result);
        };
      }
    } catch (error) {
      console.error('Game error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="game-container">
      <video 
        ref={bgVideoRef} 
        className="background-video"
        loop 
        muted 
        style={{ display: currentVideo === 'bg' ? 'block' : 'none' }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      
      <video 
        ref={winVideoRef} 
        className="game-video"
        style={{ display: currentVideo === 'win' ? 'block' : 'none' }}
      >
        <source src={winVideo} type="video/mp4" />
      </video>
      
      <video 
        ref={loseVideoRef} 
        className="game-video"
        style={{ display: currentVideo === 'lose' ? 'block' : 'none' }}
      >
        <source src={loseVideo} type="video/mp4" />
      </video>

      <div className="ui-container">
        <div className="button-container">
          <button 
            className={`connect-button ${isConnected ? 'connected' : ''}`}
            onClick={connectWallet}
          >
            {isConnected 
              ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}`
              : 'Connect Wallet'
            }
          </button>
          <button 
            className="play-button"
            onClick={playGame}
            disabled={!isConnected || isPlaying}
          >
            {isPlaying ? 'Playing...' : 'Play Game'}
          </button>
        </div>
        
        <div className="stats-container">
          <p>Games Played: <span>{gamesPlayed}</span></p>
          <p>Games Won: <span>{gamesWon}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Game;
