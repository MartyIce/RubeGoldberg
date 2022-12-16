import ExpressClient from "./ExpressClient";
import { exec } from "../../../Common/Utils"

class SessionClient {
    expressClient = new ExpressClient();

    getSessions = (success, error) => {
        return exec(this.expressClient.getSessions(), success, error);
    };

    createSession = (sessionToken, username, created_at, expires_at, success, error) => {
        let item = {
            "SessionToken": { "S": sessionToken },
            "Username": { "S": username },
            "CreatedAt": { "S": created_at },
            "ExpiresAt": { "S": expires_at },
            "TTL": { "N": expires_at.getTime() }
        }
        return exec(this.expressClient.postSession(item),
            success, error);
    };

    findSession = (sessionToken, success, error) => {
        return exec(this.expressClient.querySessions(
            "#token = :token",
            "#ttl >= :epoch",
            {
                "#token": "SessionToken",
                "#ttl": "TTL"
            },
            {
                ":token": { "S": sessionToken },
                ":epoch": { "N": Date.now() }
            }), success, error);
    };

    getUserSessions = (username, success, error) => {
        return exec(this.expressClient.getUserSessions(username), success, error);
    };

    deleteUserSessions = (username, success, error) => {
        return exec(this.expressClient.deleteUserSessions(username), success, error);
    };
}

export default SessionClient;