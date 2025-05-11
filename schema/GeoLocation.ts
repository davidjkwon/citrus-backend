import mongoose from 'mongoose';

// Define the interface for the GeoLocation document
interface IGeoLocation {
  userCid: string;
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

// Define the schema for geographic data
const GeoLocationSchema = new mongoose.Schema<IGeoLocation>({
  userCid: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const GeoLocation = mongoose.model<IGeoLocation>('GeoLocation', GeoLocationSchema);

export default GeoLocation;
