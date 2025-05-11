export interface UserItem {
    user_id: string;
    username: string;
    location?: {
        lat: number;
        lon: number;
        timestamp: number;
    };
    group_ids?: string[];
}

export interface LocationItem {
    lat: number;
    lon: number;
    timestamp: number;
    address?: string;
}

export interface GroupItem {
    group_id: string;
    group_name: string;
    users: string[]; // List of user IDs
    admin: string[]; // List of admin user IDs
    spots: string[]; // List of spot IDs
}

export interface SpotItem {
    spot_id: string;
    name: string;
    location: {
        lat: number;
        lon: number;
    };
    description: string;
}

export type DynamoItem = UserItem | LocationItem | GroupItem | SpotItem;

export interface DynamoParams {
    TableName: string;
    Key?: { ID: string };
    Item?: DynamoItem;
}
