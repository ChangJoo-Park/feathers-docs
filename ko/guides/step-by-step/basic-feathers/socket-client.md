# A Feathers WebSocket Client

We already have a Feathers REST frontend.
REST 프론트엔드를 작성해보았습니다.
간단하게 웹소켓으로 바꾸어봅니다.

> **WebSockets.** Feathers는 8개의 가장 인기있는 웹소켓 라이브러리를 사용할 수 있습니다.
이 가이드에서는 Socket.io를 사용합니다.


## 작동하는 예제

- 서버 코드: [examples/step/01/websocket/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/websocket/1.js)
- 클라이언트 코드: [common/public/socketio.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/socketio.html)
and
[feathers-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app.js)
- 서버 시작: `node ./examples/step/01/websocket/1`
- 브라우저 접속 주소: `localhost:3030/socketio.html`
- 이전 페이지의 서버와의 비교
[examples/step/01/rest/2.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/2.js):
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-1-side.html)
- 이전 페이지의 HTML과의 비교
[common/public/socketio.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/socketio.html)
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-socketio-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-socketio-side.html)


## Feathers REST **또는** WebSocket 호출을 클라이언트에서 지원하도록 서버 변경

2개의 서버측 코드만 추가하면 REST **또는** 웹소켓 호출을 사용하도록 클라이언트를 지원합니다.

```javascript
const rest = require('feathers-rest');
const socketio = require('feathers-socketio'); // new

const app = httpServerConfig()
  .configure(rest())
  .configure(socketio()) // new
  .configure(services)
  .configure(middleware);
```
- 변경된 부분:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-1-side.html)

## Feathers 클라이언트 웹소켓을 지원하도록 HTML 변경

HTML에있는 REST 코드를 동등한 WebSocket 코드로 대체합니다.

```html
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/core-js/2.1.4/core.min.js"></script>
<script src="https://unpkg.com/feathers-client@^2.0.0/dist/feathers.js"></script>
<script src="/socket.io.min.js"></script>
<script src="/serverUrl.js"></script>
<script>
  const socket = io(serverUrl);
  const feathersClient = feathers()
      .configure(feathers.socketio(socket))
</script>
<script src="/feathers-app.js"></script>
```
- 변경된 부분:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-socketio-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-websocket-socketio-side.html)
- `src="/socket.io.min.js"` Socket.io 클라이언트 코드를 불러옵니다.
- `const socket = io(serverUrl);` WebSocket을 만듭니다..
- `.configure(feathers.socketio(socket))` 클라이언트가 웹소켓을 사용하도록 설정합니다.

## 프론트엔드 코드 변경

이미 Feathers는 프론트엔드가 REST 또는 웹소켓 처리를 하는데 문제가 없다고 설명했습니다.

**더 이상의 변경은 필요 없습니다.**

> **REST vs WebSockets.**
기술적으로 REST와 WebSocket은 큰 차이가 있습니다.
Feathers는 그런 세부사항을 다루는 것보다 중요한 것을 해야한다고 생각해 숨겼습니다.

## 결과

이게 전부입니다.
결과는 [A Feathers REST Client](./rest-client.md)와 같습니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Socket-client&body=Comment:Step-Basic-Socket-client)
