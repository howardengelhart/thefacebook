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

### ButtonTemplate
Implementation of the send api's [Button Template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template).  The Template is comprised of a text property and a collection of buttons which can be passed as an array to the constructor, or added by accessing the templates ```.buttons``` property (an Array).

```
'use strict';

const fb = require('thefacebook');

let message = new fb.Message();
let templ = new fb.ButtonTemplate('Test Title', [
    new fb.PostbackButton({ title : 'Do This', payload : 'PAYLOAD1' }),
    new fb.UrlButton({ title : 'Go Here', url : 'http://example.com' })
]);

message.send(RECIPIENT_ID, templ, PAGE_TOKEN)
.then( (result) => {
  console.log('RESULT:', result);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});
```

### GenericTemplate,  GenericTemplateElement
Implementation of the send api's [Generic Template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template).  The Template is mostly a collection of GenericTemplateElements which can be passed as an array to the constructor, or added by accessing the templates ```.elements``` property (an Array).

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
    new fb.PostbackButton({ title : 'Do This', payload : 'PAYLOAD1' }),
    new fb.UrlButton({ title : 'Go Here', url : 'http://example.com' }),
    new fb.ShareButton()
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
### PostbackButton, CallButton, ShareButton, UrlButton
These objects are all implementations of Facebook Buttons, used by the GenericTemplateElement.  The PostbackButton, CallButton, and UrlButton can all be initialized with a title, and their respective associated data or payload.

```
let pb = new PostbackButton({ title : 'A Postback', payload : 'PAYLOAD' });
pb.title = 'New title.';
pb.payload = 'New payload';

let ub = new UrlButton({ title : 'A Url', url : 'http://example.com' });
ub.title = 'New title.';
ub.url = 'http://example2.com';

let cb = new CallButton({ title : 'Call Me', payload : '555-1212' });
ub.title = 'New title.';
ub.payload = '555-3131';

\\ The ShareButton has no data or title.
sb = new ShareButton();
```

### ImageAttachment, AudioAttachment, VideoAttachment, FileAttachment
The attachment objects are all derived from an underlying Attachment base class.  They all have identical constructors and accessible properties.   All Attachment types can be set with either a URL to their respective image, audio clip, video, or file.. or with an attachment_id.  The example below cribs a demonstration of using the is_reusable flag to get an attachment_id and then subsequently use that attachment_id.

```
message.send(RECIPIENT_ID, new ImageAttachment({ url : 'http://example.com/image.png', is_resuable : true }), PAGE_TOKEN)
.then( resp => {
      ATTACHMENT_ID = resp.attachment_id; // This can be stored for later use.
});
...

message.send(RECIPIENT_ID, new ImageAttachment({ attachment_id : ATTACHMENT_ID }), PAGE_TOKEN)
.then ... 

```

### Text, TextQuickReply, LocationQuickReply
As mentioned earlier, the Message object's ```.send``` method can send string literals.  However the Text object can be used in conjunction with the TextQuckReply and LocationQuickReply objects to support [Quick Replies](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies).

```
message.send(RECIPIENT_ID, new Text('Please send me your location.', [ new LocationQuickReply() ]), PAGE_TOKEN)

let t = new Text('Do you want to proceed?');
t.quick_replies.push(new TextQuickReply( { title : 'Yes', payload : 'QR_YES' }));
t.quick_replies.push(new TextQuickReply( { title : 'No', payload : 'QR_NO' }));
message.send(RECIPIENT_ID, t, PAGE_TOKEN);
```

### SenderAction
The SenderAction is similar to the Message object, except it is configured to deliver alternatively formatted [Sender Actions](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions).

```
'use strict';

const fb = require('thefacebook');
let senderAction = new fb.SenderAction();

// Mark last message as read
senderAction.send(RECIPIENT_ID, 'mark_seen', PAGE_TOKEN)
.then( () => {
    // Turn typing indicators on
    return senderAction.send(RECIPIENT_ID, 'typing_on', PAGE_TOKEN);
})
.then( () => {
    // do something
})
.then ( () => {
    // Turn typing indicators off
    return senderAction.send(RECIPIENT_ID, 'typing_off', PAGE_TOKEN);
})
.catch( (error) => {
  console.log('ERROR: ', error.message);
});

```

