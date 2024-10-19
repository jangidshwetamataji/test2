import React, { useState } from 'react';
import './App.css'; // Link to the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Import the heart icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection data

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jokes, setJokes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Fetch jokes from the API based on the search term
  const fetchJokes = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`https://icanhazdadjoke.com/search?term=${searchTerm}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jokes');
      }

      const data = await response.json();
      if (data.results.length === 0) {
        setMessage('No jokes found.');
      } else {
        setJokes(data.results);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Save favorite joke to the database
  const handleFavorite = async (id, joke) => {
    try {
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, joke }),
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite');
      }

      setMessage('Joke saved to favorites!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Search for Dad Jokes</h1>

      {/* Heart Icon with text to Redirect to Favorites Page */}
      <div className="favorites-container">
        <span className="favorites-text" onClick={() => navigate('/posts')}>View All Favorites</span>
        <FontAwesomeIcon
          icon={faHeart}
          size="2x"
          className="favorites-icon"
          onClick={() => navigate('/posts')}
        />
      </div>

      <form onSubmit={fetchJokes} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a keyword (e.g., 'dog')"
          className="search-input"
          required
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {message && <p className="message">{message}</p>}

      <div className="joke-container">
        {jokes.map((joke) => (
          <div className="joke-card" key={joke.id}>
            <img src={`https://picsum.photos/200?random=${joke.id}`} alt="Joke" className="joke-image" />
            <p className="joke-text">{joke.joke}</p>
            <button onClick={() => handleFavorite(joke.id, joke.joke)} className="favorite-button">
              Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
