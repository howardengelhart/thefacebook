'use strict';
const request = require('request');
const inspect = require('util').inspect;

let _UserProfile = new WeakMap();
class UserProfile {
    constructor() {
        _UserProfile.set(this, 
            { endpoint : 'https://graph.facebook.com/v2.6' });
    }

    get endpoint() {
        return _UserProfile.get(this).endpoint;
    }

    getProfile(userId, accessToken) {
        return new Promise((resolve, reject) => {
            let opts = {
                url : `${this.endpoint}/${userId}`,
                qs : {
                    access_token : accessToken
                },
                json : true 
            };

            request.get(opts, (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                if ((response.statusCode < 200) || (response.statusCode > 299)) {
                    return reject(
                        new Error(
                            `Unexpected statusCode: ${response.statusCode} - ${inspect(body)}`
                        )
                    );
                }

                return resolve(body);
            });
        });
    }
}

exports.UserProfile    = UserProfile;
