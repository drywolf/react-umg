/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
//import WS from 'ws';
const window = typeof window === 'undefined' ? global : window;

function setupDevtools() {
  var messageListeners = [];
  var closeListeners = [];
  //var ws = new WS('ws://localhost:8097/devtools');
  // this is accessed by the eval'd backend code
  var FOR_BACKEND = { // eslint-disable-line no-unused-vars
    wall: {
      listen(fn) {
        messageListeners.push(fn);
      },
      onClose(fn) {
        closeListeners.push(fn);
      },
      send(data) {
        console.log('sending\n%s\n', JSON.stringify(data, null, 2));
        //ws.send(JSON.stringify(data));
      },
    },
  };
}

export default setupDevtools;
