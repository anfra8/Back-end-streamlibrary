import express from 'express';
import cors from 'cors';
import { games, users, friends } from './data.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock database state
let mockUsers = JSON.parse(JSON.stringify(users));

// Get all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Get game by ID
app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === parseInt(req.params.id));
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ message: 'Game not found' });
  }
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (user) {
    // Add game details to owned games
    const userWithGames = {
      ...user,
      ownedGamesDetails: user.ownedGames.map(og => ({
        ...games.find(g => g.id === og.gameId),
        playtime: og.playtime,
        purchaseDate: og.purchaseDate
      }))
    };
    res.json(userWithGames);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Get user by email
app.get('/api/users/email/:email', (req, res) => {
  const user = mockUsers.find(u => u.email === req.params.email);
  if (user) {
    const userWithGames = {
      ...user,
      ownedGamesDetails: user.ownedGames.map(og => ({
        ...games.find(g => g.id === og.gameId),
        playtime: og.playtime,
        purchaseDate: og.purchaseDate
      }))
    };
    res.json(userWithGames);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

// Create new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: mockUsers.length + 1,
    username: req.body.username,
    avatar: req.body.avatar || `https://i.pravatar.cc/150?img=${mockUsers.length + 1}`,
    email: req.body.email,
    ownedGames: [],
    favorites: [],
    totalPlaytime: 0
  };
  mockUsers.push(newUser);
  res.json(newUser);
});

// Toggle favorite
app.post('/api/users/:userId/favorites/:gameId', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.userId));
  if (user) {
    const gameId = parseInt(req.params.gameId);
    const index = user.favorites.indexOf(gameId);
    
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(gameId);
    }
    
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Purchase game
app.post('/api/users/:userId/purchase/:gameId', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.userId));
  if (user) {
    const gameId = parseInt(req.params.gameId);
    const alreadyOwned = user.ownedGames.some(og => og.gameId === gameId);
    
    if (!alreadyOwned) {
      user.ownedGames.push({
        gameId: gameId,
        purchaseDate: new Date().toISOString().split('T')[0],
        playtime: 0
      });
      res.json(user);
    } else {
      res.status(400).json({ message: 'Game already owned' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Get friends
app.get('/api/friends', (req, res) => {
  res.json(friends);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
