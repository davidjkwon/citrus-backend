import Dynamo from "../aws_components/dynamoDB";
import Responses from "../aws_components/responses";

const friendsTable = process.env.friendsTable || '';

interface FriendsTableEntry {
    friendIds: string[];
    [key: string]: any;
}

export const getFriends = async (userId: string): Promise<string[] | ReturnType<typeof Responses._500>> => {
    try {
        const friendsTableEntry = await Dynamo.get(userId, friendsTable) as FriendsTableEntry;
        return friendsTableEntry.friendIds;
    } catch (error) {
        return Responses._500({ message: "Database error occurred", error });
    }
};
