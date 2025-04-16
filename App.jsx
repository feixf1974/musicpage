import React, { useState, useEffect } from 'react';

const NAVIDROME_URL = 'http://mc.xueli8.com';
const UN = 'zjx';
const PW = 'Zjx123';

const App = () => {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.createRef();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`${NAVIDROME_URL}/rest/getRandomSongs.view?u=${UN}&p=${PW}&f=json&v=1.16.1&c=CP`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                const songList = data.subsonic-response.randomSongs.song.map(song => ({
                    title: song.title,
                    artist: song.artist,
                    url: `${NAVIDROME_URL}/rest/stream.view?id=${song.id}&u=${UN}&p=${PW}&f=json&v=1.16.1&c=CP`
                }));
                setSongs(songList);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const playSong = () => {
        setIsPlaying(true);
    };

    const pauseSong = () => {
        setIsPlaying(false);
    };

    const nextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        setIsPlaying(true);
    };

    const prevSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
        setIsPlaying(true);
    };

    return (
        <div className="music-player">
            <h1>Music Player</h1>
            {songs.length > 0 && (
                <div>
                    <h2>{songs[currentSongIndex].title}</h2>
                    <p>{songs[currentSongIndex].artist}</p>
                    <audio ref={audioRef} src={songs[currentSongIndex].url} />
                    <button onClick={playSong}>Play</button>
                    <button onClick={pauseSong}>Pause</button>
                    <button onClick={prevSong}>Previous</button>
                    <button onClick={nextSong}>Next</button>
                </div>
            )}
        </div>
    );
};

export default App;
    