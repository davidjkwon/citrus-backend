"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendsLocations = void 0;
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const responses_1 = __importDefault(require("../aws_components/responses"));
const getFriends_1 = require("./getFriends");
const locationsTable = process.env.locationsTable || '';
const getFriendsLocations = async (userId) => {
    const friendIds = await (0, getFriends_1.getFriends)(userId);
    if (!friendIds || !Array.isArray(friendIds)) {
        return responses_1.default._400({ message: `Friends not found for ${userId}` });
    }
    const friendLocations = [];
    try {
        for (const friendId of friendIds) {
            const friendInfo = await dynamoDB_1.default.get(friendId, locationsTable);
            friendLocations.push({
                friendId,
                latitude: friendInfo.latitude,
                longitude: friendInfo.longitude,
            });
        }
        return friendLocations;
    }
    catch (error) {
        return responses_1.default._500({ message: "Database error occurred", error });
    }
};
exports.getFriendsLocations = getFriendsLocations;
//# sourceMappingURL=getFriendsLocations.js.map