const ccce = {
  _env: undefined,
  _debug: false, // deprecated
  _verbose: false,
  _theme: 'auto',
  _loaded: false,
  _callBack: () => undefined,
  _onAbort: () => undefined,
  _profile: '',
  _is_ie: () => {
    const ua = navigator.userAgent; // detects ie 10 or greater to secure iframe from 'X-Frame-Options' bypass
    const reg1 = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
    const reg2 = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
    let rv = -1;
    const check = (reg) => {
      if (reg.exec(ua) != null) return parseFloat(RegExp.$1);
      return rv;
    }
    if (navigator.appName === 'Microsoft Internet Explorer') {
      rv = check(reg1);
    } else if (navigator.appName === 'Netscape') {
      rv = check(reg2);
    }
    return (rv > 9);
  },
  _setStyle: (el, val) => { for (var x in val) el.style[x] = val[x]; },
  _setEnvironment: (el) => {
    if (ccce._debug) ccce._env = 'dev';
    const _unvalidatedENV = el.getAttribute('env');
    if (!_unvalidatedENV || !_unvalidatedENV.trim()) return console.error('CCCE: No environment flag set - use `env="stage"` or `env="prod"`');
    if (_unvalidatedENV === 'dev' || _unvalidatedENV === 'stage' || _unvalidatedENV === 'prod') ccce._env = _unvalidatedENV;
    else return console.error('CCCE: The value for `env` is invalid, use `env="stage"` or `env="prod"`, found:', _unvalidatedENV);
  },
  _captureMessage() {
    if (event && event.data && (event.data.hsCode || event.data.abort)) {
      if (ccce._verbose) console.log('CCCE: Received Data from iframe', event.data)
      if (event.data.abort) {
        if (ccce._verbose) console.log('CCCE: User Aborted', event.data);
        if (ccce._onAbort && ccce._onAbort.length > 0) return ccce._onAbort(event.data);
        return console.warn('CCCE: User Aborted but no "onAbort" function was provided');
      }
      if (ccce._callBack && ccce._callBack.length > 0) {
        if (ccce._verbose) console.log('CCCE: callBack found - sending data', event.data)
        ccce._callBack(event.data);
      }
      else {
        console.warn('CCCE: No callBack Found - Can\'t Send Data')
      }
    }
  },
  _unload: () => {
    if (ccce._verbose) console.log('CCCE: Unloading iframe');
    const iframe = document.getElementById('ccce-classyvue');
    if (iframe) iframe.parentNode.removeChild(iframe);
    window.removeEventListener('message', ccce._captureMessage);
    ccce._loaded = false;
  },
  init: (el) => {
    if (ccce._loaded) return console.warn('CCCE: Blocked 3CE script from creating more classifier iframes, don\'t call init if using "runOnload"');
    ccce._loaded = true; // prevents script from loading a second time
    
    ccce._debug = el.getAttribute('debug') !== null && el.getAttribute('runOnload') !== 'false';
    if (ccce._debug) console.error('CCCE: *IMPORTANT* The "debug" flag is now deprecated and will be remove in future updates. Use env="stage" & env="prod" instead to control environment');
    
    ccce._setEnvironment(el);
    if (!ccce._env) return console.error('CCCE: Fatal error, unknown env value provided')

    ccce._verbose = (el.getAttribute('debug') !== null || el.getAttribute('verbose') !== null) && el.getAttribute('runOnload') !== 'false';
    if (ccce._verbose && ccce._env === 'prod') {
      console.error('CCCE: Found verbose flag in prod, disabling logging.');
      ccce._verbose = false
    }
    if (ccce._verbose) console.warn('CCCE: Embed script initialized in verbose mode');
    if (ccce._verbose && ccce._is_ie()) console.log('CCCE: Detected IE10 or 11');

    ccce._theme = el.getAttribute('force-theme')
    if (ccce._theme !== 'light' && ccce._theme !== 'dark' && ccce._theme !== 'auto') ccce._theme = 'auto'
    if (ccce._verbose) console.log('CCCE: Theme mode:', ccce._theme)

    ccce._profile = el.getAttribute('data-profile-id');
    if (!ccce._profile || !ccce._profile.trim()) return console.error('CCCE: No Profile ID provided')
    if (ccce._verbose) console.log('CCCE: Profile', ccce._profile);

    const callBack = el.getAttribute('data-on-complete');
    if (callBack) {
      if (ccce._verbose) console.log('CCCE: callBack provided onLoad?', true);
      ccce._callBack = window[callBack];
    }
    else {
      if (ccce._verbose) console.log('CCCE: callBack provided onLoad?', false);
    }

    const onAbort = el.getAttribute('data-on-abort');
    if (onAbort) {
      if (ccce._verbose) console.log('CCCE: onAbort provided onLoad?', true);
      ccce._onAbort = window[onAbort];
    }
    else {
      if (ccce._verbose) console.log('CCCE: onAbort provided onLoad?', false);
    }

    const id = el.getAttribute('data-element-id');
    const node = document.getElementById(id);

    function createIframe(node) {
      const iframe = document.createElement('iframe');
      iframe.frameBorder = '0';
      iframe.id = 'ccce-classyvue'
      let styles = {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)',
        zIndex: '99',
        position: 'relative',
      };
      if (el.getAttribute('no-shadow') !== null && el.getAttribute('runOnload') !== 'false') {
        if (ccce._verbose) console.log('CCCE: Not using Box-Shadow');
        delete styles.boxShadow
      }
      ccce._setStyle(iframe, styles);
      node.appendChild(iframe);
    }

    window.removeEventListener('message', ccce._captureMessage, false) // remove any previously loaded listeners
    createIframe(node)
    window.addEventListener('message', ccce._captureMessage, false)
  },
  classify: (params, callBack, onAbort) => {
    if (!ccce._loaded) return console.error('CCCE: Must call ccce.init(el) before classifying');
    if (callBack !== null && typeof callBack === 'function') {
      if (ccce._verbose) console.log('CCCE: callBack provided onClassify?', true);
      ccce._callBack = callBack;
    }
    if (onAbort !== null && typeof onAbort === 'function') {
      if (ccce._verbose) console.log('CCCE: onAbort provided onClassify?', true);
      ccce._onAbort = onAbort;
    }
    if (params.hs6 === undefined || typeof params.hs6 !== 'boolean') {
      if (ccce._verbose) console.warn('CCCE: No hs6 preference provided, defaulting to', false);
      params.hs6 = false;
    } else {
      if (ccce._verbose) console.log('CCCE: hs6', params.hs6);
    }

    if (!params.product || !params.product.trim()) return console.error('CCCE: No product provided for classification');
    if (!params.hs6) {
      if (!params.destination || !params.destination.trim()) return console.error('CCCE: No destination country provided for classification');
      if (!params.origin || !params.origin.trim()) return console.error('CCCE: No origin country provided for classification');
    }
    if (!params.lang || !params.lang.trim()) {
      if (ccce._verbose) console.warn('CCCE: No language preference provided, defaulting to "en-us"');
      params.lang = 'en';
    }
    else {
      if (ccce._verbose) console.log('CCCE: lang', params.lang);
    }

    if (params.useKeyboard === undefined || typeof params.useKeyboard !== 'boolean') {
      if (ccce._verbose) console.warn('CCCE: No useKeyboard preference provided, defaulting to', false);
      params.useKeyboard = false;
    }
    else {
      if (ccce._verbose) console.log('CCCE: useKeyboard?', params.useKeyboard);
    }
    
    if (params.useTypeform === undefined || typeof params.useTypeform !== 'boolean') {
      if (ccce._verbose) console.warn('CCCE: No useTypeform preference provided, defaulting to', true);
      params.useTypeform = true;
    }
    else {
      if (ccce._verbose) console.log('CCCE: useTypeform?', params.useTypeform);
    }
    
    if (ccce._verbose) console.log('CCCE: Classifying with params:', params);
    const iframe = document.getElementById('ccce-classyvue');
    iframe.src = `https://${ccce._env === 'prod' ? 'classyvue' : 'classyvue-' + ccce._env}.3ce.com/${params.lang}/?product=${encodeURI(params.product)}&dest=${!params.hs6 ? params.destination : ''}&origin=${!params.hs6 ? params.origin : ''}&useKeyboard=${params.useKeyboard}&useTypeform=${params.useTypeform}&hs6=${params.hs6}&profile=${ccce._profile}${ccce._is_ie() ? `&ie11_domain=${document.location.origin}` : ''}&debug=${ccce._env !== 'prod'}&force_theme=${ccce._theme}&avaCustomerId=${params.avaCustomerId}&avaTaxId=${params.avaTaxId}`;
  }
};
// on load
(
  () => {
    const el = document.querySelector('script[data-element-id]');
    const runOnload = el.getAttribute('runOnload') !== null && el.getAttribute('runOnload') !== 'false';
    if (ccce._verbose) console.log('CCCE: runOnload?', runOnload);
    if (runOnload) {
      ccce.init(el);
    }
  }
)();
