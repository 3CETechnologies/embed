var ccce = {
  _env: undefined,
  _debug: false,
  // deprecated
  _verbose: false,
  _theme: 'auto',
  _loaded: false,
  _callBack: function _callBack() {
    return undefined;
  },
  _onAbort: function _onAbort() {
    return undefined;
  },
  _profile: '',
  _is_ie: function _is_ie() {
    var ua = navigator.userAgent; // detects ie 10 or greater to secure iframe from 'X-Frame-Options' bypass

    var reg1 = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
    var reg2 = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
    var rv = -1;

    var check = function check(reg) {
      return reg.exec(ua) == null ? rv : parseFloat(RegExp.$1);
    };

    return navigator.appName === 'Microsoft Internet Explorer' ? rv = check(reg1) : navigator.appName === 'Netscape' && (rv = check(reg2)), rv > 9;
  },
  _setStyle: function _setStyle(el, val) {
    for (var x in val) el.style[x] = val[x];
  },
  _setEnvironment: function _setEnvironment(el) {
    ccce._debug && (ccce._env = 'dev');

    var _unvalidatedENV = el.getAttribute('env');

    return _unvalidatedENV && _unvalidatedENV.trim() ? _unvalidatedENV === 'dev' || _unvalidatedENV === 'stage' || _unvalidatedENV === 'prod' ? void (ccce._env = _unvalidatedENV) : console.error('CCCE: The value for `env` is invalid, use `env="stage"` or `env="prod"`, found:', _unvalidatedENV) : console.error('CCCE: No environment flag set - use `env="stage"` or `env="prod"`');
  },
  init: function init(el) {
    function createIframe(node) {
      var iframe = document.createElement('iframe');
      iframe.frameBorder = '0', iframe.id = 'ccce-classyvue';
      var styles = {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)',
        zIndex: '99',
        position: 'relative'
      };
      el.getAttribute('no-shadow') !== null && el.getAttribute('runOnload') !== 'false' && (ccce._verbose && console.log('CCCE: Not using Box-Shadow'), delete styles.boxShadow), ccce._setStyle(iframe, styles), node.appendChild(iframe);
    }

    function captureMessage() {
      if (event && event.data && (event.data.hsCode || event.data.abort)) {
        if (ccce._verbose && console.log('CCCE: Received Data from iframe', event.data), event.data.abort) return ccce._verbose && console.log('CCCE: User Aborted', event.data), ccce._onAbort && ccce._onAbort.length > 0 ? ccce._onAbort(event.data) : console.warn('CCCE: User Aborted but no "onAbort" function was provided');
        ccce._callBack && ccce._callBack.length > 0 ? (ccce._verbose && console.log('CCCE: callBack found - sending data', event.data), ccce._callBack(event.data)) : console.warn('CCCE: No callBack Found - Can\'t Send Data');
      }
    }

    if (ccce._loaded) return console.warn('CCCE: Blocked 3CE script from creating more classifier iframes, don\'t call init if using "runOnload"');
    if (ccce._loaded = true, ccce._debug = el.getAttribute('debug') !== null && el.getAttribute('runOnload') !== 'false', ccce._debug && console.error('CCCE: *IMPORTANT* The "debug" flag is now deprecated and will be remove in future updates. Use env="stage" & env="prod" instead to control environment'), ccce._setEnvironment(el), !ccce._env) return console.error('CCCE: Fatal error, unknown env value provided');
    if (ccce._verbose = (el.getAttribute('debug') !== null || el.getAttribute('verbose') !== null) && el.getAttribute('runOnload') !== 'false', ccce._verbose && ccce._env === 'prod' && (console.error('CCCE: Found verbose flag in prod, disabling logging.'), ccce._verbose = false), ccce._verbose && console.warn('CCCE: Embed script initialized in verbose mode'), ccce._verbose && ccce._is_ie() && console.log('CCCE: Detected IE10 or 11'), ccce._theme = el.getAttribute('force-theme'), ccce._theme !== 'light' && ccce._theme !== 'dark' && ccce._theme !== 'auto' && (ccce._theme = 'auto'), ccce._verbose && console.log('CCCE: Theme mode:', ccce._theme), ccce._profile = el.getAttribute('data-profile-id'), !ccce._profile || !ccce._profile.trim()) return console.error('CCCE: No Profile ID provided');
    ccce._verbose && console.log('CCCE: Profile', ccce._profile);
    var callBack = el.getAttribute('data-on-complete');
    callBack ? (ccce._verbose && console.log('CCCE: callBack provided onLoad?', true), ccce._callBack = window[callBack]) : ccce._verbose && console.log('CCCE: callBack provided onLoad?', false);
    var onAbort = el.getAttribute('data-on-abort');
    onAbort ? (ccce._verbose && console.log('CCCE: onAbort provided onLoad?', true), ccce._onAbort = window[onAbort]) : ccce._verbose && console.log('CCCE: onAbort provided onLoad?', false);
    var id = el.getAttribute('data-element-id');
    var node = document.getElementById(id);
    createIframe(node), window.addEventListener('message', captureMessage, false);
  },
  classify: function classify(params, callBack, onAbort) {
    if (!ccce._loaded) return console.error('CCCE: Must call ccce.init(el) before classifying');
    if (callBack !== null && typeof callBack === 'function' && (ccce._verbose && console.log('CCCE: callBack provided onClassify?', true), ccce._callBack = callBack), onAbort !== null && typeof onAbort === 'function' && (ccce._verbose && console.log('CCCE: onAbort provided onClassify?', true), ccce._onAbort = onAbort), params.hs6 === undefined || typeof params.hs6 !== 'boolean' ? (ccce._verbose && console.warn('CCCE: No hs6 preference provided, defaulting to', false), params.hs6 = false) : ccce._verbose && console.log('CCCE: hs6', params.hs6), !params.product || !params.product.trim()) return console.error('CCCE: No product provided for classification');

    if (!params.hs6) {
      if (!params.destination || !params.destination.trim()) return console.error('CCCE: No destination country provided for classification');
      if (!params.origin || !params.origin.trim()) return console.error('CCCE: No origin country provided for classification');
    }

    params.lang && params.lang.trim() ? ccce._verbose && console.log('CCCE: lang', params.lang) : (ccce._verbose && console.warn('CCCE: No language preference provided, defaulting to "en-us"'), params.lang = 'en'), params.useKeyboard === undefined || typeof params.useKeyboard !== 'boolean' ? (ccce._verbose && console.warn('CCCE: No useKeyboard preference provided, defaulting to', false), params.useKeyboard = false) : ccce._verbose && console.log('CCCE: useKeyboard?', params.useKeyboard), params.useTypeform === undefined || typeof params.useTypeform !== 'boolean' ? (ccce._verbose && console.warn('CCCE: No useTypeform preference provided, defaulting to', true), params.useTypeform = true) : ccce._verbose && console.log('CCCE: useTypeform?', params.useTypeform), ccce._verbose && console.log('CCCE: Classifying with params:', params);
    var iframe = document.getElementById('ccce-classyvue');
    iframe.src = "https://".concat(ccce._env === 'prod' ? 'classyvue' : 'classyvue-' + ccce._env, ".3ce.com/").concat(params.lang, "/?product=").concat(encodeURI(params.product), "&dest=").concat(params.hs6 ? '' : params.destination, "&origin=").concat(params.hs6 ? '' : params.origin, "&useKeyboard=").concat(params.useKeyboard, "&useTypeform=").concat(params.useTypeform, "&hs6=").concat(params.hs6, "&profile=").concat(ccce._profile).concat(ccce._is_ie() ? "&ie11_domain=".concat(document.location.origin) : '', "&debug=").concat(ccce._env !== 'prod', "&force_theme=").concat(ccce._theme);
  }
}; // on load

(function () {
  var el = document.querySelector('script[data-element-id]');
  var runOnload = el.getAttribute('runOnload') !== null && el.getAttribute('runOnload') !== 'false';
  ccce._verbose && console.log('CCCE: runOnload?', runOnload), runOnload && ccce.init(el);
})();
