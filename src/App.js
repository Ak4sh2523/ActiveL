import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Reactive from './components/ActiveL'; // Ensure this path is correct
import logo from './components/Black and Gold Classy Minimalist Circular Name Logo.png';
import { addTrack, getTracks, deleteTrack } from './db'; // Import deleteTrack

const App = () => {
  const [tracks, setTracks] = useState([]);
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

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const track = { title: file.name, src: reader.result };
        validTracks.push(track);
        await addTrack(track); // Store the track in IndexedDB
        if (validTracks.length === files.length) {
          setTracks((prevTracks) => [...prevTracks, ...validTracks]);
        }
      };
    });
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

  const handleDeleteTrack = async (id) => {
    await deleteTrack(id);
    setTracks(tracks.filter(track => track.id !== id));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <img className="logo" src={logo} alt="logo" />
        <input
          type="file"
          accept="audio/*"
          onChange={handleChange}
          multiple
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-label">
          <i className="fas fa-plus" />
          Add Tracks
        </label>
      </nav>
      <div className="content">
        <Reactive tracks={tracks} playTrack={playTrack} onDeleteTrack={handleDeleteTrack} />
      </div>
      <footer className="music-player-fixed">
        <h2>Now Playing: {tracks.length > 0 ? tracks[currentTrackIndex]?.title : 'Select a track'}</h2>
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
