import Dynamo from "../aws_components/dynamoDB";
import Responses from "../aws_components/responses";
import { getFriends } from "./getFriends";

const locationsTable = process.env.locationsTable || '';

interface LocationEntry {
    latitude: number;
    longitude: number;
    [key: string]: any;
}

interface FriendLocation {
    friendId: string;
    latitude: number;
    longitude: number;
}

export const getFriendsLocations = async (userId: string): Promise<FriendLocation[] | ReturnType<typeof Responses._400> | ReturnType<typeof Responses._500>> => {
    const friendIds = await getFriends(userId);
    
    if (!friendIds || !Array.isArray(friendIds)) {
        return Responses._400({ message: `Friends not found for ${userId}` });
    }

    const friendLocations: FriendLocation[] = [];
    try {
        for (const friendId of friendIds) {
            const friendInfo = await Dynamo.get(friendId, locationsTable) as LocationEntry;
            friendLocations.push({
                friendId,
                latitude: friendInfo.latitude,
                longitude: friendInfo.longitude,
            });
        }
        return friendLocations;
    } catch (error) {
        return Responses._500({ message: "Database error occurred", error });
    }
};
