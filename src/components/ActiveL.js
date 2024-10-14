import React from 'react';

const Reactive = ({ tracks, playTrack, onDeleteTrack }) => {
  return (
    <div className="music-player">
      <ul>
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <li key={track.id} onClick={() => playTrack(index)}>
              {track.title}
              <span onClick={(e) => { e.stopPropagation(); onDeleteTrack(track.id); }} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                <i className="fas fa-trash" />
              </span>
            </li>
          ))
        ) : (
          <li>No tracks available. Upload some!</li>
        )}
      </ul>
    </div>
  );
};

export default Reactive;
