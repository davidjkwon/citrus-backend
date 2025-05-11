"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriends = void 0;
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const responses_1 = __importDefault(require("../aws_components/responses"));
const friendsTable = process.env.friendsTable || '';
const getFriends = async (userId) => {
    try {
        const friendsTableEntry = await dynamoDB_1.default.get(userId, friendsTable);
        return friendsTableEntry.friendIds;
    }
    catch (error) {
        return responses_1.default._500({ message: "Database error occurred", error });
    }
};
exports.getFriends = getFriends;
//# sourceMappingURL=getFriends.js.map