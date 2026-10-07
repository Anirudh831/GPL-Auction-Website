import express from 'express';
import cors from 'cors';

// Import Routes
import playersRoutes from './routes/players.js';
import teamsRoutes from './routes/teams.js';
import auctionRoutes from './routes/auction.js';

const app = express();
const PORT = 5000;

//make sure the incoming request is in the required format.
app.use(cors());
app.use(express.json());

// required routes
app.use('/api/players', playersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/auction', auctionRoutes);

// Base route for server health check
app.get('/', (req, res) => {
    res.send('Backend server runnning');
});

// Start listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
