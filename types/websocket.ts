export interface UserRecord {
    ID: string;
    messages: string[];
    domainName: string;
    stage: string;
}

export interface MessageBody {
    message: string;
}
