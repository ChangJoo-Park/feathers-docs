# Feathers REST 클라이언트

이전 예제에서 REST API 서버를 만들었습니다.
프론트엔드 작업을 할 차례입니다.

## 작동하는 예제

- 서버 코드: [examples/step/01/rest/2.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/2.js)
- 클라이언트 코드:
[common/public/rest.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/rest.html)
와
[feathers-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app.js)
- 서버 시작: `node ./examples/step/01/rest/2`
- 브라우저 접속 주소: `localhost:3030/rest.html`
- 이전 페이지의 서버와의 비교
[examples/step/01/rest/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/1.js):
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-side.html)

## Feathers 클라이언트 REST요청을 위한 서버 작성

[rest/2.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/2.js)
, Feathers 클라이언트 REST요청을 위한 서버는 정확히
[rest/1.js.](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/1.js)와 같고
, 이전의 서버는 HTTP REST API 호출을 위한 것입니다.
**Feathers REST 클라이언트를 처리하는 데 새로운 서버 코드는 필요하지 않습니다.**

두개를 비교하세요:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-side.html).


## 프론트엔드 HTML 작성

우리는 곧 REST 나 WebSocket을 사용하여 서버와 통신하는 방법을 대부분의 프론트엔드에서 걱정할 필요가 없음을 알게 될 것입니다.

DRY 규칙을 유지하기 위해, 우리는 REST에 고유한 코드
[common/public/rest.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/rest.html)를 만듭니다.
[import](../../../examples/step/01/common/public/rest.html)

- `https://cdnjs.cloudflare.com/ajax/libs/core-js/2.1.4/core.min.js`
는 [fetch](https://davidwalsh.name/fetch)가 필요한 경우 폴리필 합니다.
- `src="https://unpkg.com/feathers-client@^2.0.0/dist/feathers.js"` 로 Feathers의 클라이언트 코드를 불러옵니다.
- `src="/serverUrl.js"` 는 서버측 URL입니다.
기본 값은 `var serverUrl = 'http://localhost:3030';`입니다.
필요하다면 값을 변경하세요.
- `const feathersClient  = feathers()` Feathers client를 인스턴스화 합니다.
- `.configure(feathers.rest(serverUrl).fetch(fetch))` 서버와 통신할 때 REST를 사용할 수 있도록 설정합니다.

이는 서버를 가리키며 `fetch` 명령어를 리소스를 가져오기 위한 인터페이스로 전달합니다.
- `src="/feathers-app.js"` 는 메인 앱을 불러옵니다.

## Feathers 프론트엔드 작성

HTML 작성은 어렵습니다.
프론트엔드 코드는
[common/public/feathers-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app.js) 본질적으로 [Writing a Database Connector](./database-connector.md)에서 사용한 코드와 동일합니다!
[import](../../../examples/step/01/common/public/feathers-app.js)

- 변경한 부분을 보세요:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-client-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-2-client-side.html).

> **Feathers "아하!" 모멘트.**
우리는 **완벽하게** 동일한 코드를 서버와 프론트엔드에서 사용합니다.
프론트엔드는 데이터베이스가 있는 것 처럼 코딩할 수 있습니다. 이는 Feathers의 마법의 일부이며 프론트엔드 개발을 엄청나게 단순하게 만듭니다.

## 결과

브라우저의 콘솔에 표시된 결과는 이전[Database Connector 작성](./database-connector.md)과 동일합니다.

```text`
created Jane Doe item
 Object {email: "jane.doe@gmail.com", password: "11111", role: "admin", _id: "8zQ7mXay3XqiqP35"}
created John Doe item
 Object {email: "john.doe@gmail.com", password: "22222", role: "user", _id: "l9dOTxh0xk1h94gh"}
created Judy Doe item
 Object {email: "judy.doe@gmail.com", password: "33333", role: "user", _id: "3BeFPGkduhM6mlwM"}
find all items
 [Object, Object, Object]
   0: Object
     _id: "3BeFPGkduhM6mlwM"
     email: "judy.doe@gmail.com"
     password: "33333"
     role: "user"
   1: Object
     _id: "8zQ7mXay3XqiqP35"
     email: "jane.doe@gmail.com"
     password: "11111"
     role: "admin"
   2: Object
     _id: "l9dOTxh0xk1h94gh"
     email: "john.doe@gmail.com"
     password: "22222"
     role: "user"
  length: 3
```

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Rest-client&body=Comment:Step-Basic-Rest-client)
