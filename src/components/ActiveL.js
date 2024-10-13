import React, { useState, useRef, useEffect } from 'react';
import { deleteTrack } from '../db';

const Reactive = ({ tracks, setTracks, playTrack }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

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

  const playTrackHandler = (index) => {
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
    await deleteTrack(id); // Delete from IndexedDB
    const updatedTracks = tracks.filter(track => track.id !== id);
    setTracks(updatedTracks); // Update local state
  };

  return (
    <div className="music-player">
      {tracks.length === 0 ? (
        <p>No tracks available</p>
      ) : (
        <ul className="track-list">
          {tracks.map((track, index) => (
            <li key={track.id} className="track-item">
              <span onClick={() => playTrackHandler(index)} style={{ cursor: 'pointer' }}>
                {track.title}
              </span>
              <span
                onClick={() => handleDeleteTrack(track.id)}
                style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                className="delete-icon"
              >
                <i className="fas fa-trash" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reactive;