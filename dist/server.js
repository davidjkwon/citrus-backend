"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const http = (0, http_1.createServer)();
const io = new socket_io_1.Server(http, {
    cors: { origin: "*" }
});
// MongoDB connection
mongoose_1.default.connect('mongodb://0.0.0.0:27017/citrus', {
    // @ts-ignore
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
    });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map