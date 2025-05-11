import { deleteDocument } from './util.js';
import mongoose, { ConnectOptions } from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import GeoLocation from './schema/GeoLocation.js';

const http = createServer();
const io = new Server(http, {
    cors: { origin: "*" }
});

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/citrus', {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

interface LocationData {
    latitude: number;
    longitude: number;
}

io.on('connection', (socket) => {
    const userCid = socket.id;
    console.log('a user connected, id:', userCid);
    // implement a jwt token based authentication here

    // Listening user location
    socket.on('userLocation', async (data: LocationData) => {
        console.log('Received user location:', data);
        const { latitude, longitude } = data;
        // pingpong data? do we need to save this in our db?
        io.emit('userLocation', { message: 'your location', data: data });
    });

    // user clicks on the map
    socket.on('clickLocation', async (data: any) => {
        // investigate whether console.log causes latency issues
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
