# thefacebook
Wrappers for working with the Facebook Messenger ThreadSettings and Send API's.

## Installation
This library has been primarily for internal use, and as there are a host of other facebook api wrappers out their I have not published it to npm.  So for the time being, installs require pulling directly from github.

      # library
      $ npm install git+ssh://git@github.com:howardengelhart/thefacebook.git

## ThreadSettings
The library supports most of the [Facebook Messenger Thread Settings API](https://developers.facebook.com/docs/messenger-platform/thread-settings).

### Persistent Menu
Menu Items are the facebook ThreadSetting api Persistent Menu call to action objects.  Settings are sent to Messenger via the ThreadSetting object's ```.apply``` method, which returns a standard es6 Promise.

```
'use strict';

const fb = require('thefacebook');

let setting = new fb.ThreadSetting();
let menu = new fb.PersistentMenu( [
  { type : 'postback', title : 'Item 1', payload : 'PAYLOAD_ITEM_1' },
  { type : 'postback', title : 'Item 2', payload : 'PAYLOAD_ITEM_2' },
  { type : 'postback', title : 'Item 3', payload : 'PAYLOAD_ITEM_3' }
]);

setting.apply(menu, PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});
```

### Greeting Text
Greeting Text is applied using the GreetingText Object.
```
'use strict';

const fb = require('thefacebook');

let setting = new fb.ThreadSetting();

setting.apply(new GreetingText('This is my greeting!'), PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});
```

### Get Started Button
The api also supports the Get Started Button setting.
```
'use strict';

const fb = require('thefacebook');

let setting = new fb.ThreadSetting();

setting.apply(new GetStartedButton({payload : 'STARTED_PAYLOAD'), PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});
```

### Removing a Setting
Settings can be removed by calling the ```.remove``` method of the ThreadSetting object with the appropriate setting class.
```
'use strict';

const fb = require('thefacebook');

let setting = new fb.ThreadSetting();

setting.remove(new GetStartedButton(), PAGE_TOKEN)
//setting.remove(new GreetingText(), PAGE_TOKEN)
//setting.remove(new PersistentMenu(), PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});
```

## Send API
The library supports most of the [Facebook Messenger Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference).

Send messages by instantiating a ```Message``` object and then the specific body (message) type you wish to send, and passing that body object to the Message's ```.send``` method.

```
'use strict';

const fb = require('thefacebook');

let message = new fb.Message();
let templ = new fb.GenericTemplate();
templ.elements.push(new fb.GenericTemplateElement({
  title : 'Test Title',
  item_url : 'http://example.com',
  image_url : 'http://example.com/image.png',
  subtitle : 'Sub-tite',
  buttons : [
    new fb.PostbackButton({ title : 'button1', payload : 'PAYLOAD1' }),
    new fb.PostbackButton({ title : 'button2', payload : 'PAYLOAD2' })
  ]
});
message.send(RECIPIENT_ID, templ, PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});

// sending text can be done directly or via the Text object which supports QuickReplies
// message.send(RECIPIENT_ID, 'Some text to send', PAGE_TOKEN)

```
### Send API Objects

 GenericTemplate
 GenericTemplateElement
 PostbackButton
 CallButton
 ShareButton
 UrlButton
 ImageAttachment
 AudioAttachment
 VideoAttachment
 FileAttachment
 TextQuickReply
 LocationQuickReply
 Text







