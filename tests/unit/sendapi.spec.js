'use strict';

describe('sendapi', () => {
    let PostbackButton, UrlButton, GenericTemplateElement, GenericTemplate, 
        ImageAttachment, AudioAttachment, VideoAttachment, FileAttachment,
        TextQuickReply, LocationQuickReply, Text, Message, request;

    beforeEach(() => {
        const proxyquire = require('proxyquire');

        request = {
            post : jasmine.createSpy('request.post')
        };

        let api = proxyquire('../../src/sendapi.js', { request : request });

        PostbackButton          = api.PostbackButton;
        UrlButton               = api.UrlButton;
        GenericTemplateElement  = api.GenericTemplateElement;
        GenericTemplate         = api.GenericTemplate;
        ImageAttachment         = api.ImageAttachment;
        AudioAttachment         = api.AudioAttachment;
        VideoAttachment         = api.VideoAttachment;
        FileAttachment          = api.FileAttachment;
        TextQuickReply          = api.TextQuickReply;
        LocationQuickReply      = api.LocationQuickReply;
        Text                    = api.Text;
        Message                 = api.Message;
    });

    describe('PostbackButton', () => {
        describe('constructor', () => {
            it('initializes with a title and payload', () => {
                let b = new PostbackButton({ title: 'test-title', payload: 'my-payload'});
                expect(b.type).toEqual('postback');
                expect(b.title).toEqual('test-title');
                expect(b.payload).toEqual('my-payload');
            });
            
            it('initializes without a title or payload', () => {
                let b = new PostbackButton();
                expect(b.type).toEqual('postback');
                expect(b.title).not.toBeDefined();
                expect(b.payload).not.toBeDefined();
            });
        });

        describe('properties', () => {
            let b;
            beforeEach( () => {
                b = new PostbackButton('test-title','test-payload');
            });

            it('.type is read only', () => {
                expect( () => {
                    b.type = 'foo';        
                }).toThrowError(
                    'Cannot set property type of #<Button> which has only a getter');
            });

            it('.title is read-write', () => {
                b.title = 'new-title';
                expect(b.title).toEqual('new-title');
            });
            
            it('.payload is read-write', () => {
                b.payload = 'new-payload';
                expect(b.payload).toEqual('new-payload');
            });
        });
        
        describe('.render', () => {
            let b;
            beforeEach( () => {
                b = new PostbackButton({ title: 'test-title', payload: 'test-payload'});
            });

            it('throws an error if the title is null or undefined', ()=> {
                delete b.title;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
                
                b.title = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
            });

            it('throws an error if the payload is null or undefined', ()=> {
                delete b.payload;
                expect( ()=> {
                    b.render();
                }).toThrowError('payload property cannot be null or undefined.');
                
                b.payload = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('payload property cannot be null or undefined.');
            });

            it('renders the formatted button object', () => {
                expect(b.render()).toEqual({
                    type : 'postback',
                    title : 'test-title',
                    payload : 'test-payload'
                });
            });
        });
    });
    
    describe('UrlButton', () => {
        describe('constructor', () => {
            it('initializes with a title and url', () => {
                let b = new UrlButton({ title : 'test-title', url: 'my-url'});
                expect(b.type).toEqual('web_url');
                expect(b.title).toEqual('test-title');
                expect(b.url).toEqual('my-url');
            });
            
            it('initializes without a title or url', () => {
                let b = new UrlButton();
                expect(b.type).toEqual('web_url');
                expect(b.title).not.toBeDefined();
                expect(b.url).not.toBeDefined();
            });
        });

        describe('properties', () => {
            let b;
            beforeEach( () => {
                b = new UrlButton({ title : 'test-title', url: 'test-url'});
            });

            it('.type is read only', () => {
                expect( () => {
                    b.type = 'foo';        
                }).toThrowError(
                    'Cannot set property type of #<Button> which has only a getter');
            });

            it('.title is read-write', () => {
                b.title = 'new-title';
                expect(b.title).toEqual('new-title');
            });
            
            it('.url is read-write', () => {
                b.url = 'new-url';
                expect(b.url).toEqual('new-url');
            });
        });
        
        describe('.render', () => {
            let b;
            beforeEach( () => {
                b = new UrlButton({ title : 'test-title', url: 'test-url'});
            });

            it('throws an error if the title is null or undefined', ()=> {
                delete b.title;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
                
                b.title = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
            });

            it('throws an error if the url is null or undefined', ()=> {
                delete b.url;
                expect( ()=> {
                    b.render();
                }).toThrowError('url property cannot be null or undefined.');
                
                b.url = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('url property cannot be null or undefined.');
            });

            it('renders the formatted button object', () => {
                expect(b.render()).toEqual({
                    type : 'web_url',
                    title : 'test-title',
                    url : 'test-url'
                });
            });
        });
    });

    describe('Attachments', () => {
        describe('constructor', () => {
            it('initializes with a url', () => {
                let a = new ImageAttachment({ url : 'my-url', is_reusable : true});
                expect(a.type).toEqual('image');
                expect(a.url).toEqual('my-url');
                expect(a.is_reusable).toEqual(true);
                expect(a.attachment_id).not.toBeDefined();
            });
            
            it('initializes with an attachment_id', () => {
                let a = new ImageAttachment({ attachment_id : 'my-attach-id'});
                expect(a.type).toEqual('image');
                expect(a.url).not.toBeDefined();
                expect(a.attachment_id).toEqual('my-attach-id');
                expect(a.is_reusable).not.toBeDefined();
            });
            
            it('initializes without a attachment_id or url', () => {
                let a = new ImageAttachment();
                expect(a.type).toEqual('image');
                expect(a.url).not.toBeDefined();
                expect(a.attachment_id).not.toBeDefined();
                expect(a.is_reusable).not.toBeDefined();
            });

            it('other attachments', () => {
                expect((new AudioAttachment()).type).toEqual('audio');
                expect((new VideoAttachment()).type).toEqual('video');
                expect((new FileAttachment()).type).toEqual('file');
            });
        });
       
        describe('.render', () => {
            let a;
            beforeEach( () => {
                a = new ImageAttachment(); 
            });

            it('renders reusable url', () => {
                a.url = 'my-url';
                a.is_reusable = true;
                expect(a.render()).toEqual({
                    attachment : {
                        type : 'image', payload : { url : 'my-url', is_reusable : true }
                    }
                });
            });
            
            it('renders non-reusable url', () => {
                a.url = 'my-url';
                expect(a.render()).toEqual({
                    attachment : {
                        type : 'image', payload : { url : 'my-url' }
                    }
                });
            });

            it('renders attachment', () => {
                a.attachment_id = 'a-1';
                expect(a.render()).toEqual({
                    attachment : {
                        type : 'image', payload : { attachment_id : 'a-1' }
                    }
                });
            });

            it('throws an error if has attachment and url', () => {
                a.attachment_id = 'a-1';
                a.url = 'my-url';
                expect(()=>{
                    a.render();
                }).toThrowError('Cannot have url and attachment_id in same message.');
            });
            
            it('throws an error if has attachment_id and is_reusable', () => {
                a.attachment_id = 'a-1';
                a.is_reusable = true;
                expect(()=>{
                    a.render();
                }).toThrowError('Cannot have attachment_id and is_reusable in same message.');
            });
        });
    });

    describe('GenericTemplateElement', () => {
        describe('constructor', () => {
            it('initializes with no parameters', () => {
                let e = new GenericTemplateElement();
                expect(e.title).not.toBeDefined();
                expect(e.item_url).not.toBeDefined();
                expect(e.image_url).not.toBeDefined();
                expect(e.subtitle).not.toBeDefined();
                expect(e.buttons).toEqual([]);
            });
            
            it('initializes with parameters', () => {
                let e = new GenericTemplateElement({ 
                    title : 'test-title',
                    item_url : 'test-item_url',
                    image_url : 'test-image_url',
                    subtitle : 'test-subtitle',
                    buttons : ['a','b','c']
                });
                expect(e.title).toEqual('test-title');
                expect(e.item_url).toEqual('test-item_url');
                expect(e.image_url).toEqual('test-image_url');
                expect(e.subtitle).toEqual('test-subtitle');
                expect(e.buttons).toEqual(['a','b','c']);
            });
        });

        describe('.render', () => {
            let e;
            beforeEach( () => {
                e = new GenericTemplateElement({ title : 'test-title' });
            });

            it('throws an error if the title is null or undefined', ()=> {
                delete e.title;
                expect( ()=> {
                    e.render();
                }).toThrowError(
                    'GenericTemplateElement title property cannot be null or undefined.');
                
                e.title = null;
                expect( ()=> {
                    e.render();
                }).toThrowError(
                    'GenericTemplateElement title property cannot be null or undefined.');
            });

            it('renders only set properties', () => {
                e.item_url = 'url';
                expect(e.render()).toEqual({
                    title : 'test-title',
                    item_url : 'url'
                });
            });

            it('renders all set properties, ignores bogus ones', () => {
                e.item_url = 'url';
                e.image_url = 'image';
                e.subtitle = 'subtitle';
                e.foo = 'bar'; // <-- tricksy property gets ignored
                e.buttons.push(new PostbackButton({ title: 'button1', payload: 'payload1'}));
                e.buttons.push(new PostbackButton({ title: 'button2', payload: 'payload2'}));
                expect(e.render()).toEqual({
                    title : 'test-title',
                    item_url : 'url',
                    image_url : 'image',
                    subtitle : 'subtitle',
                    buttons : [
                        { type : 'postback' , title : 'button1', payload : 'payload1' },
                        { type : 'postback' , title : 'button2', payload : 'payload2' }
                    ]
                });
            });


        });

    });
    
    describe('GenericTemplate', () => {
        describe('constructor', () => {
            it('initializes with no parameters', () => {
                let e = new GenericTemplate();
                expect(e.elements).toEqual([]);
            });
            
            it('initializes with parameters', () => {
                let e = new GenericTemplate( ['a','b','c'] );
                expect(e.elements).toEqual(['a','b','c']);
            });
        });

        describe('.render', () => {
            it('throws an error if there are no elements', () => {
                let t = new GenericTemplate();
                expect( ()=> {
                    t.render();
                }).toThrowError(
                    'GenericTemplate must have at least one Element.');
            });

            it('renders the body of a GenericTemplate', () => {
                let t = new GenericTemplate();
                t.elements.push( new GenericTemplateElement({
                    title : 'test-title',
                    item_url : 'url',
                    image_url : 'image',
                    subtitle : 'subtitle',
                    buttons : [
                        new PostbackButton({ title: 'button1', payload: 'payload1' } ),
                        new PostbackButton({ title: 'button2', payload: 'payload2' } )
                    ]
                }));

                expect(t.render()).toEqual({
                    attachment : {
                        type : 'template',
                        payload : {
                            template_type : 'generic',
                            elements : [
                                {
                                    title : 'test-title',
                                    item_url : 'url',
                                    image_url : 'image',
                                    subtitle : 'subtitle',
                                    buttons : [
                                        { type : 'postback', title : 'button1',
                                            payload : 'payload1' },
                                        { type : 'postback', title : 'button2',
                                            payload : 'payload2' }
                                    ]
                                }
                            ]
                        }
                    }
                });
            });
        });
    });

    describe('LocationQuickReply', () => {
        describe('constructor', () => {
            it('initializes with type only', () => {
                let b = new LocationQuickReply( );
                expect(b.type).toEqual('location');
            });
        });

        describe('.render', () => {
            let b;
            beforeEach( () => {
                b = new LocationQuickReply({ title: 'test-title'});
            });
            
            it('renders the formatted quick reply object', () => {
                expect(b.render()).toEqual({
                    content_type : 'location',
                    title : 'test-title'
                });
            });
        });

    });

    describe('TextQuickReply', () => {
        describe('constructor', () => {
            it('initializes with a title and payload', () => {
                let b = new TextQuickReply(
                    { title: 'test-title',payload: 'my-payload', image_url : 'url'}
                );
                expect(b.type).toEqual('text');
                expect(b.title).toEqual('test-title');
                expect(b.payload).toEqual('my-payload');
                expect(b.image_url).toEqual('url');
            });
            
            it('initializes without a title or payload', () => {
                let b = new TextQuickReply();
                expect(b.type).toEqual('text');
                expect(b.title).not.toBeDefined();
                expect(b.payload).not.toBeDefined();
                expect(b.image_url).not.toBeDefined();
            });
        });

        describe('properties', () => {
            let b;
            beforeEach( () => {
                b = new TextQuickReply('test-title','test-payload');
            });

            it('.type is read only', () => {
                expect( () => {
                    b.type = 'foo';        
                }).toThrowError(
                    'Cannot set property type of #<QuickReply> which has only a getter');
            });

            it('.title is read-write', () => {
                b.title = 'new-title';
                expect(b.title).toEqual('new-title');
            });
            
            it('.payload is read-write', () => {
                b.payload = 'new-payload';
                expect(b.payload).toEqual('new-payload');
            });
        });
        
        describe('.render', () => {
            let b;
            beforeEach( () => {
                b = new TextQuickReply({ title: 'test-title', payload : 'test-payload'});
            });

            it('throws an error if the title is null or undefined', ()=> {
                delete b.title;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
                
                b.title = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('title property cannot be null or undefined.');
            });

            it('throws an error if the payload is null or undefined', ()=> {
                delete b.payload;
                expect( ()=> {
                    b.render();
                }).toThrowError('payload property cannot be null or undefined.');
                
                b.payload = null;
                expect( ()=> {
                    b.render();
                }).toThrowError('payload property cannot be null or undefined.');
            });

            it('renders the formatted quick reply object', () => {
                expect(b.render()).toEqual({
                    content_type : 'text',
                    title : 'test-title',
                    payload : 'test-payload'
                });
            });
        });
    });

    describe('Text', () => {
        describe('constructor', () => {
            it ('is initialized with no args', () => {
                let t = new Text();
                expect(t.text).not.toBeDefined();
                expect(t.quick_replies).toEqual([]);
            });
            
            it ('is initialized withargs', () => {
                let t = new Text('some text', [ new LocationQuickReply() ]);
                expect(t.text).toEqual('some text');
                expect(t.quick_replies.length).toEqual(1);
            });
        });

        describe('.render', () => {
            let t;
            beforeEach( () => {
                t = new Text('some text');
            });

            it('throws an error if there is no text', () => {
                delete t.text;
                expect( ()=> {
                    t.render();
                }).toThrowError('text property cannot be null or undefined.');
                
                t.text = null;
                expect( ()=> {
                    t.render();
                }).toThrowError('text property cannot be null or undefined.');
            });

            it('renders the formatted Text object', () => {
                expect(t.render()).toEqual({
                    text : 'some text'
                });

                t.quick_replies.push( new LocationQuickReply() );
                expect(t.render()).toEqual({
                    text : 'some text',
                    quick_replies : [ {   content_type : 'location' } ]
                });
            });
        });
    });

    describe('Message', () => {
        describe('constructor', () => {
            it('is initialized with a default endpoint', ()=>{
                let m = new Message();
                expect(m.endpoint).toEqual('https://graph.facebook.com/v2.6/me/messages');
            });
        });
        
        describe('properties', () => {
            let m;
            beforeEach(()=>{
                m = new Message();
            });

            it('.endpoint is readonly', ()=>{
                expect(() => {
                    m.endpoint = '1';
                }).toThrowError(
                    'Cannot set property endpoint of #<Message> which has only a getter');
            });
        });

        describe('.send', () => {
            let m, t, recipientId, accessToken;
            beforeEach(()=>{
                recipientId = 'user-1';
                accessToken = 'token-1';
                m = new Message();
                t = new GenericTemplate();
                t.elements.push( new GenericTemplateElement({
                    title : 'test-title',
                    item_url : 'url',
                    image_url : 'image',
                    subtitle : 'subtitle',
                    buttons : [
                        new PostbackButton({ title: 'button1', payload: 'payload1' }),
                        new PostbackButton({ title: 'button2', payload: 'payload2' })
                    ]
                }));

                request.post.and.callFake((opts,cb) => {
                    return cb(null, {}, { foo : 'bar' });
                });
            });

            it('sends a message using its render method', (done) => {
                m.send(recipientId, t, accessToken)
                .then((v) => {
                    let opts = request.post.calls.argsFor(0)[0];
                    expect(opts.qs.access_token).toEqual('token-1');
                    expect(opts.url).toEqual(m.endpoint);
                    expect(opts.json).toEqual({
                        recipient : {
                            id : 'user-1'
                        },
                        message : {
                            attachment : {
                                type : 'template',
                                payload : {
                                    template_type : 'generic',
                                    elements : [
                                        {
                                            title : 'test-title',
                                            item_url : 'url',
                                            image_url : 'image',
                                            subtitle : 'subtitle',
                                            buttons : [
                                                { type : 'postback', title : 'button1',
                                                    payload : 'payload1' },
                                                { type : 'postback', title : 'button2',
                                                    payload : 'payload2' }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    });
                    expect(v).toEqual({ foo : 'bar' });
                })
                .then(done, done.fail);
            });

            it('sends text as a text message', (done) => {
                m.send(recipientId, 'This is a test.', accessToken)
                .then((v) => {
                    let opts = request.post.calls.argsFor(0)[0];
                    expect(opts.qs.access_token).toEqual('token-1');
                    expect(opts.url).toEqual(m.endpoint);
                    expect(opts.json).toEqual({
                        recipient : {
                            id : 'user-1'
                        },
                        message : {
                            text : 'This is a test.'
                        }
                    });
                    expect(v).toEqual({ foo : 'bar' });
                })
                .then(done, done.fail);
            });

            it('rejects if the request fails with an error', (done) => {
                let e = new Error('fail');
                request.post.and.callFake((opts,cb) => {
                    return cb(e);
                });
                
                m.send(recipientId, t, accessToken)
                .then(done.fail, (err) => {
                    expect(err).toBe(e);
                })
                .then(done, done.fail);
            });
            
            it('rejects if the request statusCode is not 2xx', (done) => {
                request.post.and.callFake((opts,cb) => {
                    return cb(null, { statusCode : 400 }, { msg : 'fail' });
                });
                
                m.send(recipientId, t, accessToken)
                .then(done.fail, (err) => {
                    expect(err.message)
                        .toEqual('Unexpected statusCode: 400 - { msg: \'fail\' }');
                })
                .then(done, done.fail);
            });
        });
    });
});
