const { deleteDocument } = require('./util');
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
    // implement a jwt token based authentication here

    // Listening user location
    socket.on('userLocation', async (data) => {
        console.log('Received user location:', data);
        const { latitude, longitude } = data;
        // pingpong data? do we need to save this in our db?
        io.emit('userLocation', { message: 'your location', data: data });
    });
    // user clicks on the map
    socket.on('clickLocation', async (data) => {
        // investigate whether console.log causes latency issues
        console.log('Received clicked location:', data);
        const { latitude, longitude } = data;
        // userCid will be replaced with jwt
        var geoLocation = new GeoLocation({ userCid, latitude, longitude });
        // call lambda here to get address
        // if address is not found, return coordinates
        // else return address
    });
    // user adds adhoc location
    socket.on('adhocLocation', async (data) => {
        console.log('Received adhoc location:', data);
        const { latitude, longitude } = data;
        var geoLocation = new GeoLocation({ userCid, latitude, longitude });
        try {
            // prob add helper function to authenticate and save location later
            await geoLocation.save();
            console.log('geoLocation:', geoLocation);
            io.emit('adhocLocation', { message: 'Location saved successfully', data: geoLocation });
        } catch (error) {
            console.log('Error saving location:', error);
            io.emit('adhocLocation', { message: 'Error saving location' });
        }
    });
    // user deletes location
    socket.on('deleteLocation', async (data) => {
        console.log('received deletion request');
        const { userCid, latitude, longitude } = data;
        var deletegGeoLocation = new GeoLocation({ userCid, latitude, longitude });
        const query = { userCid: userCid, latitude: latitude, longitude: longitude };
        try {
            await deleteDocument(deletegGeoLocation, query);
            console.log('deletegGeoLocation:', deletegGeoLocation);
            io.emit('deleteLocation', { message: 'Location saved successfully', data: geoLocation });
        } catch (error) {
            console.log('Error saving location:', error);
            io.emit('adhocLocation', { message: 'Error saving location' });
        }
    })
    
});

io.on('disconnect', () => {
    console.log('user disconnected');
    // save session in cache?
});
io.on('error', (error) => {
    console.log(error);S
});
http.listen(8080, () => console.log('listening on http://localhost:8080') );