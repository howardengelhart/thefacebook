'use strict';

describe('threadsettings', () => {

    let GreetingText, GetStartedButton, PersistentMenu, ThreadSetting, request;

    beforeEach(() => {
        const proxyquire = require('proxyquire');

        request = {
            post : jasmine.createSpy('request.post'),
            'delete' : jasmine.createSpy('request.delete')
        };

        let api = proxyquire('../../src/threadsettings.js', { request : request });

        GreetingText          = api.GreetingText;
        GetStartedButton      = api.GetStartedButton;
        PersistentMenu        = api.PersistentMenu;
        ThreadSetting         = api.ThreadSetting;
    });
    
    describe('GreetingText', () => {
        describe('constructor', () => {
            it('initializes with default setting_type', () => {
                let g = new GreetingText();
                expect(g.setting_type).toEqual('greeting');
                expect(g.thread_state).not.toBeDefined();
                expect(g.text).not.toBeDefined();
            });

            it('initializes with text', () => {
                let g = new GreetingText('Some Text.');
                expect(g.setting_type).toEqual('greeting');
                expect(g.thread_state).not.toBeDefined();
                expect(g.text).toEqual('Some Text.');
            });
        });

        describe('.text', ()=> {
            it('can be set or get', () => {
                let g = new GreetingText('old-text');
                expect(g.text).toEqual('old-text');
                g.text = 'new-text';
                expect(g.text).toEqual('new-text');
            });
        });

        describe('.renderPost', () => {
            it('will throw an exception if there is no text', () => {
                let g = new GreetingText();
                expect(()=>{
                    g.renderPost();
                }).toThrowError('text property must be set to post GreetingText.');
            });
            
            it('will render a post message body', () => {
                let g = new GreetingText('Some Text');
                expect(g.renderPost()).toEqual({
                    setting_type : 'greeting',
                    greeting : {
                        text : 'Some Text'
                    }
                });
            });
        });
        
        describe('.renderDelete', () => {
            it('will render a delete message body', () => {
                let g = new GreetingText('Some Text');
                expect(g.renderDelete()).toEqual({
                    setting_type : 'greeting',
                });
            });
        });
    });

    describe('GetStartedButton', () => {
        describe('constructor', () => {
            it('initializes with default setting_type', () => {
                let g = new GetStartedButton();
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('new_thread');
                expect(g.cta).toEqual([]);
            });

            it('initializes with single cta', () => {
                let g = new GetStartedButton({ payload : 'PAYLOAD1' });
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('new_thread');
                expect(g.cta).toEqual([{ payload : 'PAYLOAD1' }]);
            });
            
            it('initializes with a list of ctas', () => {
                let l = [ { payload : 'PL1' }, { payload : 'PL2' } ];
                let g = new GetStartedButton(l);
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('new_thread');
                expect(g.cta).toEqual([{ payload : 'PL1' },{ payload : 'PL2' }]);
                expect(g.cta).not.toBe(l);
            });
        });

        describe('.renderPost', () => {
            let gs;
            beforeEach( () => {
                gs = new GetStartedButton();
            });

            it('rejects if there are no call_to_actions defined', () => {
                expect(() => {
                    gs.renderPost();
                }).toThrowError('one or more cta\'s are required to post GetStartedButton.');
            });

            it('will render a post message body', () => {
                gs.cta.push({ payload : 'PL1'});
                gs.cta.push({ payload : 'PL2'});
                expect(gs.renderPost()).toEqual({
                    setting_type : 'call_to_actions',
                    thread_state : 'new_thread',
                    call_to_actions: [
                        { payload : 'PL1' },
                        { payload : 'PL2' }
                    ]
                });
            });
        });

        describe('.renderDelete', () => {
            it('will render a delete message body', () => {
                let gs = new GetStartedButton();
                expect(gs.renderDelete()).toEqual({
                    setting_type : 'call_to_actions',
                    thread_state : 'new_thread'
                });
            });
        });
    });

    describe('PersistentMenu', () => {
        describe('constructor', () => {
            it('initializes with default setting_type', () => {
                let g = new PersistentMenu();
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('existing_thread');
                expect(g.cta).toEqual([]);
            });

            it('initializes with single cta', () => {
                let g = new PersistentMenu({ payload : 'PAYLOAD1' });
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('existing_thread');
                expect(g.cta).toEqual([{ payload : 'PAYLOAD1' }]);
            });
            
            it('initializes with a list of ctas', () => {
                let l = [ { payload : 'PL1' }, { payload : 'PL2' } ];
                let g = new PersistentMenu(l);
                expect(g.setting_type).toEqual('call_to_actions');
                expect(g.thread_state).toEqual('existing_thread');
                expect(g.cta).toEqual([{ payload : 'PL1' },{ payload : 'PL2' }]);
                expect(g.cta).not.toBe(l);
            });
        });

        describe('.renderPost', () => {
            let gs;
            beforeEach( () => {
                gs = new PersistentMenu();
            });

            it('rejects if there are no call_to_actions defined', () => {
                expect(() => {
                    gs.renderPost();
                }).toThrowError('one or more cta\'s are required to post PersistentMenu.');
            });

            it('will render a post message body', () => {
                gs.cta.push({ payload : 'PL1'});
                gs.cta.push({ payload : 'PL2'});
                expect(gs.renderPost()).toEqual({
                    setting_type : 'call_to_actions',
                    thread_state : 'existing_thread',
                    call_to_actions: [
                        { payload : 'PL1' },
                        { payload : 'PL2' }
                    ]
                });
            });
        });

        describe('.renderDelete', () => {
            it('will render a delete message body', () => {
                let gs = new PersistentMenu();
                expect(gs.renderDelete()).toEqual({
                    setting_type : 'call_to_actions',
                    thread_state : 'existing_thread'
                });
            });
        });
    });

    describe('ThreadSetting', () => {
        let ts;

        beforeEach(() => {
            ts = new ThreadSetting();
        });

        describe('.endpoint', () => {
            it('initialized with url', () => {
                expect(ts.endpoint)
                    .toEqual('https://graph.facebook.com/v2.6/me/thread_settings');
            });

            it('is read only', () => {
                expect(() => {
                    ts.endpoint = '1';
                }).toThrowError(
                    'Cannot set property endpoint of #<ThreadSetting> which has only a getter');
            });
        });

        describe('.send', () => {
            let s, accessToken;
            beforeEach(()=>{
                accessToken = 'token-1';
                s = new GreetingText('text');

                request['delete'].and.callFake((opts,cb) => {
                    return cb(null, {}, { foo : 'bar' });
                });

                request.post.and.callFake((opts,cb) => {
                    return cb(null, {}, { foo : 'bar' });
                });
            });

            it('sends using post method', (done) => {
                ts.send('post', s.renderPost(), accessToken)
                .then((v) => {
                    let opts = request.post.calls.argsFor(0)[0];
                    expect(opts.qs.access_token).toEqual('token-1');
                    expect(opts.url).toEqual(ts.endpoint);
                    expect(opts.json).toEqual({
                        setting_type : 'greeting',
                        greeting : {
                            text : 'text'
                        }
                    });
                    expect(v).toEqual({ foo : 'bar' });
                })
                .then(done, done.fail);
            });

            it('sends using delete method', (done) => {
                ts.send('delete', s.renderDelete(), accessToken)
                .then((v) => {
                    let opts = request['delete'].calls.argsFor(0)[0];
                    expect(opts.qs.access_token).toEqual('token-1');
                    expect(opts.url).toEqual(ts.endpoint);
                    expect(opts.json).toEqual({
                        setting_type : 'greeting'
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
                
                ts.send('post', s.renderDelete(), accessToken)
                .then(done.fail, (err) => {
                    expect(err).toBe(e);
                })
                .then(done, done.fail);
            });
            
            it('rejects if the request statusCode is not 2xx', (done) => {
                request.post.and.callFake((opts,cb) => {
                    return cb(null, { statusCode : 400 }, { msg : 'fail' });
                });
                
                ts.send('post', s.renderDelete(), accessToken)
                .then(done.fail, (err) => {
                    expect(err.message)
                        .toEqual('Unexpected statusCode: 400 - { msg: \'fail\' }');
                })
                .then(done, done.fail);
            });
        });

        describe('apply, remove', () => {
            let s, accessToken;
            beforeEach(() => {
                accessToken = 'token-1';
                s = new GreetingText('text');
                spyOn(ts,'send');
            });

            it('apply calls renderPost and send', () => {
                ts.apply(s, accessToken);
                expect(ts.send).toHaveBeenCalledWith(
                    'post',
                    {
                        setting_type : 'greeting',
                        greeting : { text : 'text' }
                    }, 
                    'token-1'
                );
            });

            it('remove calls renderDelete and send', () => {
                ts.remove(s, accessToken);
                expect(ts.send).toHaveBeenCalledWith(
                    'delete',
                    {
                        setting_type : 'greeting'
                    }, 
                    'token-1'
                );
            });
        });
    });
});
