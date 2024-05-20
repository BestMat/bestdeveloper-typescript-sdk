// © 2024 - BestDeveloper - BestMat, Inc. - All rights reserved.
const nodeFetch = require("node-fetch-commonjs");
const nodeCrypto = require('crypto');

type BestDeveloperConfig = {
    username: string;
    password: string;
    api_key: string;
};

type AuthUsers = number | undefined;

type CreateUserConfig = {
    email: string,
    password: string
}

class Auth {
    public static username: string;
    private static password: string;
    private static api_key: string;

    static async getUsers(users: AuthUsers = undefined): Promise<string[]> {
        var response = await nodeFetch("http://localhost:3000/auth-users");
        var data = await response.json();

        if (users != undefined && typeof users == "number"){
            return (data[this.username].users).slice(0, users)
        };

        return data[this.username].users;
    }

    static async createUser(config: CreateUserConfig, callback: Function = function(){      return null;        }) {
            var response =  await nodeFetch(`http://localhost:3000/auth-create-user?email=${config.email}&password=${config.password}&user=${this.username}`);
            var data = await response.text();
    
            if (data == "Success!"){
                (callback());
                return {
                    code: 200,
                    user: {
                        email: config.email,
                        password: nodeCrypto.createHash("md5").update(config.password).digest("hex")
                    }
                }
            };
    }

    static async validateUser(config: CreateUserConfig, callback = function(){      return null;        }): Promise<200 | 404> {
        var response =  await nodeFetch("http://localhost:3000/auth-users");
        var data = await response.json();

        if (data[this.username].passwords[data[this.username].users.indexOf(config.email)] == config.password) {
            return 200;
        } else {
            return 404;
        }
    }

    static async printUsers(users = undefined): Promise<void> {
        var response =  await nodeFetch("http://localhost:3000/auth-users");
        var data = await response.json();

        if (users != undefined && typeof users == "number"){
            return (data[this.username].users).slice(0, users)
        };

        console.table(data[this.username].users);
    }

    public static users = this.getUsers();
}


class BestDeveloperError extends Error {
    constructor(error: string) {
        super("BestDeveloper Error: " + error); // TODO: Use template string.
    }
}

var product: object = {
    name: "bestdeveloper",
    category: "bestdeveloper",
    version: 1,
    javascript: true,
    type: "sdk"
};

module.exports = { Auth, product };