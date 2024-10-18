import React, { useEffect, useState } from 'react';
import './App.css'; // Link to the CSS file

const PostsShow = () => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch favorite jokes from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/favorites');

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        if (data.length === 0) {
          setMessage('No favorite jokes saved.');
        } else {
          setFavorites(data);
        }
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="App">
      <h1>Favorite Jokes</h1>
      {message && <p className="message">{message}</p>}

      <div className="joke-container">
        {favorites.map((joke) => (
          <div className="joke-card" key={joke.id}>
            <img src={`https://picsum.photos/200?random=${joke.id}`} alt="Joke" className="joke-image" />
            <p className="joke-text">{joke.joke}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsShow;
