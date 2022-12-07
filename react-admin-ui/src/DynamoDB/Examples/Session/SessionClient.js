import ExpressClient from "../../ExpressClient.js";

class SessionClient {
    expressClient = new ExpressClient();

    exec = (promise, success, error) => {
        return promise
            .then(async res => {
                let responseBody = await res.json();
                if (res.status !== 200) {
                    error(JSON.stringify(responseBody));
                } else {
                    success(responseBody.Items ? responseBody.Items : responseBody);
                }
            })
            .catch(async err => {
                error(JSON.stringify(err));
            });
    }

    getSessions = (success, error) => {
        return this.exec(this.expressClient.getSessions(), success, error);
    };

    createSession = (sessionToken, username, created_at, expires_at, success, error) => {
        let item = {
            "SessionToken": { "S": sessionToken },
            "Username": { "S": username },
            "CreatedAt": { "S": created_at },
            "ExpiresAt": { "S": expires_at },
            "TTL": { "N": expires_at.getTime() }
        }
        return this.exec(this.expressClient.postSession(item),
            success, error);
    };

    findSession = (sessionToken, success, error) => {
        return this.exec(this.expressClient.querySessions(
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
        return this.exec(this.expressClient.getUserSessions(username), success, error);
    };

    deleteUserSessions = (username, success, error) => {
        return this.exec(this.expressClient.deleteUserSessions(username), success, error);
    };
}

export default SessionClient;