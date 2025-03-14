const mongoose = require('mongoose');
const http = require('http').createServer();
const GeoLocation = require('./schema/GeoLocation'); // Import the GeoLocation model=
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/citrus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

io.on('connection', (socket) => {
    const userCid = socket.id;
    console.log('a user connected, id:', userCid);

    socket.on('message', (message) =>     {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)} said ${message}` );   
    });
    // Listening user location
    socket.on('location', async (data) => {
        console.log('Received location: hello');
        console.log('Received location:', data);
        const { latitude, longitude } = data;
        var geoLocation = new GeoLocation({ userCid, latitude, longitude });
        try {
            await geoLocation.save();
            console.log('geoLocation:', geoLocation);
            io.emit('location', { message: 'Location saved successfully', data: geoLocation });
        } catch (error) {
            console.log('Error saving location:', error);
            io.emit('location', { message: 'Error saving location' });
        }
    });
    
});


io.on('disconnect', () => {
    console.log('user disconnected');
});
io.on('error', (error) => {
    console.log(error);S
});
http.listen(8080, () => console.log('listening on http://localhost:8080') );