const responses = require("../aws_components/responses");
const Dynamo = require("../aws_components/dynamoDB");
const WebSocket = require("../aws_components/websocketMessage");
const locationTable = process.env.locationTable;

exports.handler = async (event) => {
  console.log("event:", event);
  const { connectionId: connectionID } = event.requestContext;
  const body = JSON.parse(event.body);

  try {
    const longitude = body.longitude;
    const latitude = body.latitude;
    console.log("longitude:", longitude);
    if (!longitude || !latitude) {
      return responses._400({ message: "Longitude and latitude are required" });
    }

    const record = await Dynamo.get(connectionID, locationTable);
    const { domainName, stage } = record;
    // Update the record with the new location
    const data = {
      ...record,
      longitude: longitude,
      latitude: latitude,
      timeStamp: Date.now(),
    };
    await Dynamo.write(data, locationTable);

    // Send a confirmation message back to the client
    await WebSocket.send({
      domainName,
      stage,
      connectionID,
      message: "Location updated successfully",
    });

    return responses._200({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return responses._400({ message: "Failed to update location" });
  }
};

const GOOGLE_PLACES_API_KEY = "TEST_API_KEY";

/*
Route = /friends/locations/
Expected input value:
{
    userId: "your_id",
    friendIds: [
    "david_user_id",
    "eric_user_id",
    ...
    ]
}
*/

// Fetches list of locations of all of userId's friends
export const lambdaHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    return responses._400({ message: "Path does not exist." });
  }

  const pathParts = path.replace(/^\/|\/$/g, "").split("/"); // trim slashes and split

  if (pathParts.length === 2 && pathParts[0] === "friends") {
    const userId = pathParts[1];
    if (!userId.trim()) {
      return response(400, { error: "User ID in path cannot be empty." });
    }
    // Handle /friends/{user_id}
    return await getFriends(userId);
    //return response(200, { message: `Fetching friends for user_id: ${userId}` });
  } else if (
    pathParts.length === 3 &&
    pathParts[0] === "friends" &&
    pathParts[1] === "locations"
  ) {
    const userId = pathParts[2];
    if (!userId.trim()) {
      return response(400, { error: "User ID in path cannot be empty." });
    }
    // Handle /friends/locations/{user_id}
    return await getFriendsLocations(userId);
    // return response(200, { message: `Fetching locations for friends of user_id: ${userId}` });
  } else {
    return response(404, { error: `Unsupported path: ${path}` });
  }
};
