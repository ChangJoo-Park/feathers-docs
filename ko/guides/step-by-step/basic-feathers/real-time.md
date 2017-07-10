# 리얼타임

Feathers에서 [실시간](../../../api/events.md)이란 서비스가 생성, 갱신, 수정 또는 제거 서비스가 완료될 때 자동으로 만들고, 갱신하고, 수정하고 제거되는 이벤트가 발생하는 것을 말합니다.

클라이언트는 이러한 이벤트에 따라 반응합니다.

![Feathers Realtime](/img/real-time-events-flow.jpg)

예를 들어, 채팅 앱의 방의 클라이언트는 참가자들이 올린 메시지를 자동으로 받고 표시합니다.
이는 전통적인 롱-폴링을 요구하는 디자인패턴보다 **훨씬** 간단합니다.

또 다른 예로, 클라이언트는 데이터베이스 테이블의 일부에 대한 로컬 사본을 유지할 수 있습니다.
해당 테이블에 대한 이벤트를 받아 최신으로 유지할 수도 있습니다.

> **리얼타임.** 리얼타임 이벤트는 오직 Feathers의 웹소켓 클라이언트에만 전송됩니다.
Feathers REST 또는 HTTP REST 클라이언트에는 전송되지 않습니다.
이들은 전통적인 롱-폴링 디자인으로 만들어야합니다.
**결론:** Feathers WebSocket 클라이언트를 사용하세요.

이미 익힌 [Feathers Websocket Client](./socket-client.md)를 확인하세요

## 작동하는 예제

- 서버 코드: [examples/step/01/websocket/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/websocket/1.js)
- 리스너 코드: [common/public/listener.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/listener.html)
and
[listener-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/listener-app.js)
- 클라이언트 코드: [common/public/socketio.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/socketio.html)
and
[feathers-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app.js)
- 서버 시작: `node ./examples/step/01/websocket/1.js`
- 브라우저에서 `localhost:3030/listener.html`를 열어 리스너를 확인하세요
- 브라우저에서 `localhost:3030/socketio.html`를 열어 변경해보세요

## 리스너 구현

리스너를 구현하는 것 [common/public/listener-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/listener-app.js)은 직관적입니다.

[import](../../../examples/step/01/common/public/listener-app.js)

## 필터링

리스너의 콘솔에 출력되는 내용입니다.

```text
Listening for user events.
created
{email: "jane.doe@gmail.com", password: "11111", role: "admin", _id: "qyRMR6abq8RHV29R"}
created
{email: "john.doe@gmail.com", password: "22222", role: "user", _id: "XI6e3bZcoupb6Hyr"}
created
{email: "judy.doe@gmail.com", password: "33333", role: "user", _id: "qeYSi2KrkwIUMoaE"}
```

일반적으로 클라이언트에 패스워드를 보내지는 않습니다.

대다수의 경우에 특정 이벤트는 해당하는 클라이언트에게만 보내기를 원할 것 입니다. 어쩌면 인증된 경우에만 보내야합니다.

서버는 [event filters](../../../api/events.html#event-filtering)를 사용하여 어떤 데이터가 어떤 클라이언트로 보내지는 지 제어할 수 있습니다.

![Feathers Realtime](/img/event-filter-diagram.jpg)

에를 들어 `users` 이벤트를 인증된 사용자에게만 보내야 합니다.
이를 서버 코드에 추가해 `password`를 제거하세요.

```javascript
const users = app.service('users');
users.filter((data, connection) => {
  delete data.password;
  return connection.user ? data : false;
});
```

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Real-time&body=Comment:Step-Basic-Real-time)
