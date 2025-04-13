const Dynamo = require("../aws_components/dynamoDB");
const responses = require("../aws_components/responses");

const friendsTable = process.env.friendsTable;
export const getFriends = async (userId) => {
  try {
    const friendsTableEntry = Dynamo.get(userId, friendsTable);
    return friendsTableEntry.friendIds;
  } catch (error) {
    return responses._500({ message: "Database error occured", error });
  }
};
