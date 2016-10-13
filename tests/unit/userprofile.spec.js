'use strict';

describe('threadsettings', () => {

    let UserProfile, up, request;

    beforeEach(() => {
        const proxyquire = require('proxyquire');

        request = {
            get : jasmine.createSpy('request.get')
        };

        let api = proxyquire('../../src/userprofile.js', { request : request });
        UserProfile         = api.UserProfile;
        up = new UserProfile();
    });

    describe('constructor', () => {
        it('initializes', () => {
            expect(up.endpoint).toEqual('https://graph.facebook.com/v2.6');
        });
    });

    describe('.getProfile', () => {
        let userId, accessToken;
        beforeEach(()=>{
            userId = 'user-1';
            accessToken = 'token-1';

            request.get.and.callFake((opts,cb) => {
                return cb(null, {}, { first_name : 'howard', last_name : 'cool' });
            });
        });

        it('gets a userProfile', (done) => {
            up.getProfile(userId, accessToken)
            .then((v) => {
                let opts = request.get.calls.argsFor(0)[0];
                expect(opts.qs.access_token).toEqual('token-1');
                expect(opts.url).toEqual('https://graph.facebook.com/v2.6/user-1');
                expect(opts.json).toEqual(true);
                expect(v).toEqual({ first_name : 'howard', last_name : 'cool' });
            })
            .then(done, done.fail);
        });

        it('rejects if the request fails with an error', (done) => {
            let e = new Error('fail');
            request.get.and.callFake((opts,cb) => {
                return cb(e);
            });
            
            up.getProfile(userId, accessToken)
            .then(done.fail, (err) => {
                expect(err).toBe(e);
            })
            .then(done, done.fail);
        });
        
        it('rejects if the request statusCode is not 2xx', (done) => {
            request.get.and.callFake((opts,cb) => {
                return cb(null, { statusCode : 400 }, { msg : 'fail' });
            });
            
            up.getProfile(userId, accessToken)
            .then(done.fail, (err) => {
                expect(err.message)
                    .toEqual('Unexpected statusCode: 400 - { msg: \'fail\' }');
            })
            .then(done, done.fail);
        });
    });
});
    

