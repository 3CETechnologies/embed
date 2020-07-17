# 3CE Embed
Integrate 3CE's ClassyVue into any website in seconds!

## Usage
Insert the following script into your html at the end of your body tag:
`<script src="https://embed.3ce.com" debug runOnload data-element-id="my-div" data-profile-id="xxxxxxxxxxxxx" data-on-complete="myCallback" data-on-abort="myAbortFunction"></script>
`
### Script Params
|  Name   |   Type  | Required? | Default | Details  |
|-----|------|------|-----|----|
| data-element-id | string | required | - | Provide the ID of a div that you want the classifier to be inserted into |
| data-profile-id  | string  |  required | - | Provide your profile ID for your 3CE account  |
| data-element-id | string |  optional | - | Provide the ID of a div that you want the classifier to be inserted into |
| data-on-complete  | string  | optional | - | Pointer to a function that will be executed on successful completion of a classification by the user, it will receive an object payload with the results. Must be attached to the `window` object and callable by `window.myfunction()`. |
| data-on-abort  | string  | optional | - | Pointer to a function that will be executed if the user quits the classification by clicking the "x" icon, it will receive an object payload with more details.  Must be attached to the `window` object and callable by `window.myfunction()`.  |
| debug | bool | optional | true | Toggles the script into development mode, this will point the script to the development environment instead of prod and produce more verbose messages in console |
| runOnload | bool | optional | true | The script will run as soon as it loads into the DOM prepare the iframe and wait for a classifcation request, only use if the div used in "data-element-id" will be present on load, otherwise the script will be unable to find the div and fail |
| no-shadow | bool | optional | true | Disable the drop shadow applied to the classifier (can also be overwritten using CSS). By default the classifier has a drop shadow applied to visually signify it is a seperate element on the page, this is important for best UX as the user may encounter scrolling within the iframe and on your parent page, causing confusion and a bad experience if they're not aware of the seperate container |

Note: It's important to supply the `debug` attribute if testing, it will point you to the dev instance of classifier where you will not incur usage charges for testing and it will output more information to console, including warnings that would be suppressed otherwise.

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
| destination  | string  | required  | - | ISO2 code for the destination country |
| origin  | string  | required  | - | ISO2 code for the origin country |
| lang  | string  | required  | EN | Desired language for the classification UI and results (if available), you can supply either 2 letter language code or lang + locale, though at this time country specific locales will be ignored. Default is EN if not supplied but EN, FR & AR are supported at this time. |
| useKeyboard  | bool  | optional  | true | The classifier has full keyboard support for accessibility and power users, enabling this will show the keyboard helper keys throughout the interface, it will have no affect on the actual usage of the keys. At this time the helper keys are not yet fully integrated, they will come in a future update. |
| hs6 | bool | optional | false | If enabled, it will hide codes beyond 6 digits |
| myCallback  | function  | optional | - | Function that will be executed on successful completion of a classification by the user, it will receive an object payload with the results. Unecessary if already provided in the "data-on-complete" attribute.   |
| myAbortFunction  | function  | optional | - | Pointer to a function that will be executed if the user quits the classification by clicking the "x" icon, it will receive an object payload with more details. Unecessary if already provided in the "data-on-complete" attribute. |

### Style and customization
In order to provide sane, out of the box defaults, the classifier has the following css styles by default:
```css
#ccce-classyvue { 
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
```
You can remove the box shadow by including the `no-shadow` attribute on the script. The rest, if undesirable, can be removed by overwritting the CSS manually.
