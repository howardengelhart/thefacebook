'use strict';

const assign = require('lodash').assign;
const request = require('request');
const inspect = require('util').inspect;
const isString = (v) => (
    ((typeof(v) === 'string') || 
    ((v !== null) && (typeof(v) === 'object') && 
     (v.constructor) && (v.constructor.name === 'String'))) );


let _ButtonTypes = new WeakMap();
class Button {
    constructor(type, title ) {
        _ButtonTypes.set(this, type);
        this.title = title;
    }

    get type() {
        return _ButtonTypes.get(this);
    }

    render(data) {
        if ((this.title === null) || (this.title === undefined)) {
            throw new Error('title property cannot be null or undefined.');
        }
        
        return assign({ type : this.type, title : this.title}, data);
    }
}

class PostbackButton extends Button {
    constructor(props) {
        props = props || {};
        super('postback', props.title);
        this.payload = props.payload;
    }

    render() {
        if ((this.payload === null) || (this.payload === undefined)) {
            throw new Error('payload property cannot be null or undefined.');
        }
        return super.render({ payload : this.payload });
    }
}

class UrlButton extends Button {
    constructor(props) {
        props = props || {};
        super('web_url', props.title);
        this.url = props.url;
        this.webview_height_ratio = props.webview_height_ratio;
        this.messenger_extensions = props.messenger_extensions;
        this.fallback_url = props.fallback_url;
    }
    
    render() {
        if ((this.url === null) || (this.url === undefined)) {
            throw new Error('url property cannot be null or undefined.');
        }
        let data = { url : this.url };
        if (this.webview_height_ratio) { 
            data.webview_height_ratio = this.webview_height_ratio;
        }
        if (this.messenger_extensions) { 
            data.messenger_extensions = this.messenger_extensions;
        }
        if (this.fallback_url) { 
            data.fallback_url = this.fallback_url;
        }

        return super.render(data);
    }
}

class CallButton extends Button {
    constructor(props) {
        props = props || {};
        super('phone_number', props.title);
        this.payload = props.payload;
    }

    render() {
        if ((this.payload === null) || (this.payload === undefined)) {
            throw new Error('payload property cannot be null or undefined.');
        }
        return super.render({ payload : this.payload });
    }
}


class ShareButton extends Button {
    constructor() {
        super('element_share');
        delete this.title;
    }

    render() {
        return assign({ type : this.type});
    }
}


let _AttachmentTypes = new WeakMap();
class Attachment {
    constructor(type, props) {
        assign(this, props);
        _AttachmentTypes.set(this,type);
    }

    get type() {
        return _AttachmentTypes.get(this);
    }

    render() {
        let payload = {};
        if (this.url) {
            payload.url = this.url;
        }
        if (this.attachment_id) {
            payload.attachment_id = this.attachment_id;
        }
        if (this.is_reusable) {
            payload.is_reusable = true;
        }
        
        if (payload.url && payload.attachment_id) {
            throw new Error('Cannot have url and attachment_id in same message.');
        }

        if(payload.attachment_id && payload.is_reusable) {
            throw new Error('Cannot have attachment_id and is_reusable in same message.');
        }

        return { attachment : { type : this.type, payload : payload } };
    }
}

class ImageAttachment extends Attachment {
    constructor(props) {
        super('image', props);
    }
}

class AudioAttachment extends Attachment {
    constructor(props) {
        super('audio', props);
    }
}

class VideoAttachment extends Attachment {
    constructor(props) {
        super('video', props);
    }
}

class FileAttachment extends Attachment {
    constructor(props) {
        super('file', props);
    }
}


let _TemplateTypes = new WeakMap();
class Template {
    constructor(type) {
        _TemplateTypes.set(this,type);
    }

    get type() {
        return _TemplateTypes.get(this);
    }

    render(data) {
        let payload = assign({ template_type : this.type }, data);
        return { attachment : { type : 'template', payload : payload } };
    }
}

class GenericTemplateElement {
    constructor(params) {
        params = params || {};
        this.title      = params.title;
        this.item_url   = params.item_url;
        this.image_url  = params.image_url;
        this.subtitle   = params.subtitle;
        this.buttons    = params.buttons || [];
    }

    render() {
        if ((this.title === null) || (this.title === undefined)) {
            throw new Error(
                'GenericTemplateElement title property cannot be null or undefined.');
        }

        let result = { title : this.title};
        if (this.item_url) {
            result.item_url = this.item_url;
        }
        if (this.image_url) {
            result.image_url = this.image_url;
        }
        if (this.subtitle) {
            result.subtitle = this.subtitle;
        }
        if (this.buttons && this.buttons.length){
            result.buttons = this.buttons.map( (i) => i.render() );
        }

        return result;
    }

}

class GenericTemplate extends Template{
    constructor(elements, quick_replies) {
        super('generic');
        this.elements = elements || [];
        this.quick_replies = quick_replies || [];
    }

    render() {
        let obj;
        if ((this.elements === null) || (this.elements === undefined) ||
            (this.elements.length < 1)) {
            throw new Error('GenericTemplate must have at least one Element.');
        }
        
        obj = { elements : this.elements.map((e) => e.render()) };
        
        if ((this.quick_replies) && (this.quick_replies.length > 0)) {
            obj.quick_replies = this.quick_replies.map((r) => r.render());
        }
        return super.render(obj);
    }
}

class ButtonTemplate extends Template{
    constructor(text,buttons) {
        super('button');
        this.text = text || null;
        this.buttons = buttons || [];
    }

    render() {
        if ((this.text === null) || (this.text === undefined)) {
            throw new Error(
                'ButtonTemplate text property cannot be null or undefined.');
        }
        if ((this.buttons === null) || (this.buttons === undefined) ||
            (this.buttons.length < 1)) {
            throw new Error('ButtonTemplate must have at least one Button.');
        }
        return super.render({ 
            text : this.text,
            buttons : this.buttons.map((e) => e.render()) 
        });
    }
}

let _QuickReplyTypes = new WeakMap();
class QuickReply {
    constructor(type) {
        _QuickReplyTypes.set(this,type);
    }

    get type() {
        return _QuickReplyTypes.get(this);
    }

    render(data) {
        return assign({ content_type : this.type }, data);
    }
}

class LocationQuickReply extends QuickReply {
    constructor(props) {
        super('location');
        assign(this, props);
    }

    render() {
        return super.render(assign({}, this));
    }
}

class TextQuickReply extends QuickReply {
    constructor(props) {
        super('text');
        assign(this, props);
    }

    render() {
        if ((this.title === null) || (this.title === undefined)) {
            throw new Error('title property cannot be null or undefined.');
        }
        
        if ((this.payload === null) || (this.payload === undefined)) {
            throw new Error('payload property cannot be null or undefined.');
        }

        return super.render(assign({}, this));
    }
}


class Text {
    constructor(text, quick_replies) {
        this.text = text;
        this.quick_replies = quick_replies || [];
    }

    render() {
        if ((this.text === null) || (this.text === undefined)) {
            throw new Error('text property cannot be null or undefined.');
        }

        let obj = {};
        
        obj.text = this.text;
        if ((this.quick_replies) && (this.quick_replies.length > 0)) {
            obj.quick_replies = this.quick_replies.map((r) => r.render());
        }

        return obj;
    }
}

let _Message = new WeakMap();
class Message {
    constructor() {
        _Message.set(this, { 
            endpoint : 'https://graph.facebook.com/v2.6/me/messages'
        });
    }

    get endpoint() {
        return _Message.get(this).endpoint;
    }

    makeOpts(accessToken, recipientId, body) {
        let result = {
            url : this.endpoint,
            qs : { access_token : accessToken },
            json : {
                recipient : { id : recipientId }
            }
        };

        if (body.render) {
            assign(result.json, { message : body.render() });
        } else
        if (isString(body)) {
            assign(result.json, { message : { text : body } });
        } else {
            assign(result.json, body);
        }

        return result;
    }

    send(recipientId, body, accessToken) {
        return new Promise((resolve, reject) => {
            let opts = this.makeOpts(accessToken, recipientId, body);
            request.post(opts, (err, response, body) => {
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

class SenderAction extends Message {
    constructor() {
        super();
    }

    send(recipientId, action, accessToken) {
        return super.send(recipientId, { sender_action : action }, accessToken); 
    }
}

exports.ButtonTemplate          = ButtonTemplate;
exports.GenericTemplate         = GenericTemplate;
exports.GenericTemplateElement  = GenericTemplateElement;
exports.PostbackButton          = PostbackButton;
exports.CallButton              = CallButton;
exports.ShareButton             = ShareButton;
exports.UrlButton               = UrlButton;
exports.ImageAttachment         = ImageAttachment;
exports.AudioAttachment         = AudioAttachment;
exports.VideoAttachment         = VideoAttachment;
exports.FileAttachment          = FileAttachment;
exports.TextQuickReply          = TextQuickReply;
exports.LocationQuickReply      = LocationQuickReply;
exports.Text                    = Text;
exports.Message                 = Message;
exports.SenderAction            = SenderAction;
