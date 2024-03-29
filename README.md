# 3CE Embed
Integrate 3CE's ClassyVue into any website in seconds!

## Usage
Insert the following script into your html at the end of your body tag:
```html
<script src="https://embed.3ce.com" data-profile-id="xxxxxxxxxxxx" verbose env="xxxx" force-theme="auto" runOnload data-element-id="my-div" data-on-complete="myCallback" data-on-abort="myAbortFunction"></script>
```

Use https://embed.3ce.com instead of the js file in this repo for instant access to future updates, this version will also be babelfied to es2015 standards for cross-browser support.

### Script Params
|  Name   |   Type  | Required? | Default | Details  |
|-----|------|------|-----|----|
| env | string | required | - | Set the environment to either 'stage' or 'prod', make sure your whitelisted domains and profileId match your environment or the widget will not work properly. |
| data-element-id | string | required | - | Provide the ID of a div that you want the classifier to be inserted into. |
| data-profile-id  | string  |  required | - | Provide your profile ID for your 3CE account |
| data-on-complete  | string  | optional | - | Pointer to a function that will be executed on successful completion of a classification by the user, it will receive an object payload with the results. Must be attached to the `window` object and callable by `window.myfunction()`. |
| data-on-abort  | string  | optional | - | Pointer to a function that will be executed if the user quits the classification by clicking the "x" icon, it will receive an object payload with more details.  Must be attached to the `window` object and callable by `window.myfunction()`.  |
| runOnload | bool | optional | true | The script will run as soon as it loads into the DOM prepare the iframe and wait for a classifcation request, only use if the div used in "data-element-id" will be present on load, otherwise the script will be unable to find the div and fail. |
| verbose | bool | optional | false | Enables console logging of useful information, will throw an error if used with `env="prod"`. |
| force-theme  | string  |  optional | 'auto' | Force either light or dark mode themes - if not provided the user's operating system settings will be detected and used. Set to 'auto', 'light' or 'dark'. |
| no-shadow | bool | optional | true | Disable the drop shadow applied to the classifier (can also be overwritten using CSS). By default the classifier has a drop shadow applied to visually signify it is a seperate element on the page, this is important for best UX as the user may encounter scrolling within the iframe and on your parent page, causing confusion and a bad experience if they're not aware of the seperate container. |
| debug | bool | optional | true | *Deprecated do not use: see "env" to set environment flag* |

*Note: It's important to supply the `debug` attribute if testing, it will point you to the dev instance of classifier where you will not incur usage charges for testing and it will output more information to console, including warnings that would be suppressed otherwise.*

### Initialize the script:
If you do not wish for the function to run page load, don't use the "runOnload" attribute shown above and instead manually initilize the script like so:

```javascript
  function init () {
    const el = document.querySelector('script[data-element-id]');
    ccce.init(el); // or window.ccce.init(el) if calling from an external javascript file or SPA
  }
```
*Note: It's important to call ccce.init only when your div you wish to host the classifier is present on the page, if it is hidden or on a different route the init will fail. If you're using a javascript framework like Vue, React or Angular, it's important to manually initialize the script when your div is present. You can do so by calling `window.ccce.init(el)`. Remember to re-initilize the script if the user moved to a different route and navigated back.*

### Classify:
After the script has loaded and been initilized either manually or through the "runOnload" attribute on the script tag, you must call Classify when your user is ready to do so and you've collected the necessary parameters:

```javascript
  function classify () {
    ccce.classify({ product: 'redbull', destination: 'CA', origin: 'CN', lang: 'EN-US', useKeyboard: true, hs6: false}, myCallback,     myAbortFunction);
  }
```
####  Parameters for Classification:

| Name | Type | Required? | Default | Details |
|-----|------|------|-----|----|
| product| string |  required | - |Product name or description |
| destination  | string  | optional*  | - | ISO2 code for the destination country - Optional if using the hs6 only mode, otherwise required |
| origin  | string  | optional*  | - | ISO2 code for the origin country - Optional if using the hs6 only mode, otherwise required |
| lang  | string  | required  | EN | Desired language for the classification UI and results (if available), you can supply either 2 letter language code or lang + locale, though at this time country specific locales will be ignored. Default is EN if not supplied but EN, FR, ES, PT, AR & DE are supported at this time. |
| useKeyboard  | bool  | optional  | true | The classifier has full keyboard support for accessibility and power users, enabling this will show the keyboard helper keys throughout the interface, it will have no affect on the actual usage of the keys. At this time the helper keys are not yet fully integrated, they will come in a future update. |
| hs6 | bool | optional | false | If enabled, it will hide codes beyond 6 digits and make the destination and origin fields unecessary |
| myCallback  | function  | optional | - | Function that will be executed on successful completion of a classification by the user, it will receive an object payload with the results. Unecessary if already provided in the "data-on-complete" attribute.   |
| myAbortFunction  | function  | optional | - | Pointer to a function that will be executed if the user quits the classification by clicking the "x" icon, it will receive an object payload with more details. Unecessary if already provided in the "data-on-complete" attribute. |
| avaCustomerId | string | optional | - | An optional field for internal use by Avalara only |
| avaTaxId | string | optional | - | An optional field for internal use by Avalara only |

### Style and customization
In order to provide sane, out of the box defaults, the classifier has the following css styles by default:
```css
#ccce-classyvue { 
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
  z-index: 99;
  position: relative;
}
```
You can remove the box shadow by including the `no-shadow` attribute on the script. The rest, if undesirable, can be removed by overwritting the CSS manually.

#### Light & Dark Mode
The classifier now supports automatic detection of light & dark mode settings provided by browser apis (not supported in ie11). If you provide the flag `force-theme="light"` or `force-theme="dark"` you can override this behavior and force your desired theme (not recommended). Not providing a value is the same as having `force-theme="auto"`.

### Responsiveness
The classifier behaves responsibly out of the box, to do this it simlpy expands to 100% of it's container. Because of this, you won't need to do much more than apply padding and alter your div's width for various screen sizes (using rows and columns will likely get your the best results). 

However, in order to support the smallest displays (< 400px wide) you'll need to adjust your div's width and height attributes to full-width (100vw) and full-height (100vh), effectively going fullscreen. This is where the X close button in the top-right corner comes into play, your users will need this to "exit" classification when the widget is taking up 100% of their screen, make sure to read the above note for `myAbortFunction`.

To get you started, here's an example class you can add to your page, it will make the div containing the classifier fullscreen when the display's size shrinks below 768px, it will also apply a brief transition so the movement appears deliberate and not jarring. Try playing with the following class and adjust the screen size to fit your needs:
```css
@media (max-width:768px) {
  .ccce-fullscreen {
    position: fixed;
    z-index: 6000;
    border-radius: 0 !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
}
```
*Note: Don't forget to add `ccce-fullscreen` to your div or the above won't work.*


### Troubleshooting
#### Firefox Can’t Open This Page / Chrome's Sad Face Error :(
![image](https://user-images.githubusercontent.com/24980556/110170918-e858d880-7dc8-11eb-8d7a-1d1cc2e5b3e3.png)![image](https://user-images.githubusercontent.com/24980556/110171255-7af97780-7dc9-11eb-95dc-23ef1be5d03d.png)

This is usually caused by either an incorrect profileId for your environment (e.g. using a stage profileId in prod) or that your domain has not been whitelisted for the site you're currently using it on, or both. (e.g. you whitelisted `https://my.webapp.com` but not `https://dev.webapp.com` or `http://localhost:8080`). A whitelist is unique to your profileId so keep in mind your whitelisted URLs for stage are not the same as for prod.

We're currently working on an interface so you can configure your theme colors and whitelisted urls for yourself, along with other features, this is not yet available though so please contact us to provide these details.
