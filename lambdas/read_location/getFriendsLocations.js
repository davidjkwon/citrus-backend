const Dynamo = require("../aws_components/dynamoDB");
const responses = require("../aws_components/responses");
const getFriends = "./getFriends";

const locationsTable = process.env.locationsTable;
export const getFriendsLocations = async (userId) => {
  const friendIds = await getFriends(userId);
  if (!friendIds) {
    return responses._400({ message: `Friends not found for ${userId}` });
  }

  const friendLocations = [];
  try {
    friendIds.forEach((friendId) => {
      const friendInfo = Dynamo.get(friendId, locationsTable);
      friendLocations.push({
        friendId,
        latitude: friendInfo.latitude,
        longitude: friendInfo.longitude,
      });
    });
    return friendLocations;
  } catch (error) {
    return responses._500({ message: "Database error occured", error });
  }
};
