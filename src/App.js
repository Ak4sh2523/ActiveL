import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Reactive from './components/ActiveL'; // Ensure this path is correct
import { addTrack, getTracks } from './db';
import logo from './components/Black and Gold Classy Minimalist Circular Name Logo.png';


const App = () => {
  const [tracks, setTracks] = useState([]);
  const [newTracks, setNewTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchTracks = async () => {
      const storedTracks = await getTracks();
      setTracks(storedTracks);
    };
    fetchTracks();
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex]?.src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }

    return () => {
      audioRef.current.pause();
    };
  }, [currentTrackIndex, isPlaying, tracks]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const validTracks = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        validTracks.push({ title: file.name, src: reader.result });
        if (validTracks.length === files.length) {
          setNewTracks(validTracks);
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTracks.length > 0) {
      const updatedTracks = [...tracks, ...newTracks];
      setTracks(updatedTracks);
      await Promise.all(newTracks.map(track => addTrack(track))); // Add each track to IndexedDB
      setNewTracks([]); // Clear the new tracks
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    audioRef.current.src = tracks[index]?.src;
    audioRef.current.play();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      <nav className="navbar">
      <img class="logo" src={logo} alt='logo' />
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            name="file"
            accept="audio/*"
            onChange={handleChange}
            multiple
            required
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-label">
            <i className="fas fa-plus" />
          </label>
        </form>
      </nav>
      <div className="content">
        <Reactive tracks={tracks} setTracks={setTracks} playTrack={playTrack} />
      </div>
      <footer className="music-player-fixed">
        <h2>YLT: {tracks.length > 0 ? tracks[currentTrackIndex]?.title : 'Select a track'}</h2>
        <div className="controls">
          <button onClick={prevTrack} disabled={tracks.length === 0}>
            <i className="fas fa-backward" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)}>
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`} />
          </button>
          <button onClick={nextTrack} disabled={tracks.length === 0}>
            <i className="fas fa-forward" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
