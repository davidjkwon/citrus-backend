"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for geographic data
const GeoLocationSchema = new mongoose_1.default.Schema({
    userCid: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});
// Create a model based on the schema
const GeoLocation = mongoose_1.default.model('GeoLocation', GeoLocationSchema);
exports.default = GeoLocation;
//# sourceMappingURL=GeoLocation.js.map