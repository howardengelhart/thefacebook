'use strict';

const assign = require('lodash').assign;
const request = require('request');
const inspect = require('util').inspect;

let _Settings = new WeakMap();

class Setting {
    constructor(type,state) {
        _Settings.set(this, { setting_type : type, thread_state : state });
    }

    get setting_type () {
        return _Settings.get(this).setting_type;
    }


    get thread_state () {
        return _Settings.get(this).thread_state;
    }

    render(data) {
        let res = { setting_type : this.setting_type };
        if (this.thread_state) {
            res.thread_state = this.thread_state;
        }
        return assign(res, data);
    }
}

class GreetingText extends Setting {
    constructor(text) {
        super('greeting');
        this.text = text;
    }

    renderPost() {
        if (!this.text) {
            throw new Error('text property must be set to post GreetingText.');
        }
        return this.render({ greeting : { text : this.text } });
    }

    renderDelete() {
        return this.render();
    }

}

class GetStartedButton extends Setting {
    constructor(cta) {
        super('call_to_actions','new_thread');
        if (Array.isArray(cta)) {
            this.cta = cta.concat([]);
        } 
        else
        if (cta) {
            this.cta = [ cta ];
        }
        else {
            this.cta = [];
        }
    }

    renderPost() {
        if (!this.cta || !this.cta.length) {
            throw new Error('one or more cta\'s are required to post GetStartedButton.');
        }
        return this.render({ call_to_actions : this.cta });
    }

    renderDelete() {
        return this.render();
    }

}

class PersistentMenu extends Setting {
    constructor(cta) {
        super('call_to_actions','existing_thread');
        if (Array.isArray(cta)) {
            this.cta = cta.concat([]);
        } 
        else
        if (cta) {
            this.cta = [ cta ];
        }
        else {
            this.cta = [];
        }
    }

    renderPost() {
        if (!this.cta || !this.cta.length) {
            throw new Error('one or more cta\'s are required to post PersistentMenu.');
        }
        return this.render({ call_to_actions : this.cta });
    }

    renderDelete() {
        return this.render();
    }

}


let _ThreadSetting = new WeakMap();
class ThreadSetting {
    constructor() {
        _ThreadSetting.set(this, 
            { endpoint : 'https://graph.facebook.com/v2.6/me/thread_settings' });
    }

    get endpoint() {
        return _ThreadSetting.get(this).endpoint;
    }

    send(method, msg, accessToken) {
        return new Promise((resolve, reject) => {
            let opts = {
                url : this.endpoint,
                qs : {
                    access_token : accessToken
                },
                json : msg 
            };

            request[method](opts, (err, response, body) => {
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

    apply(setting, accessToken) {
        return this.send('post', setting.renderPost(), accessToken);
    }

    remove(setting, accessToken) {
        return this.send('delete', setting.renderDelete(), accessToken);
    }
}

exports.GreetingText     = GreetingText;
exports.GetStartedButton = GetStartedButton;
exports.PersistentMenu   = PersistentMenu;
exports.ThreadSetting    = ThreadSetting;

