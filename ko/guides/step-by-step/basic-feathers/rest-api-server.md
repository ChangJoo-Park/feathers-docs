# REST API 서버

이제 데이터베이스 커넥터가 본격적인 REST API 서버로 작동합니다.
HTTP 서버만 추가하면 됩니다.

>**HTTP 서버.** Feathers는 현재 인기있는 HTTP 서버인 [Express](http://expressjs.com/)를 사용합니다.
미래에는 [koa](http://koajs.com/)와 같은 여러 프레임워크를 지원할 예정입니다.


## 작동하는 예제

- 소스코드: [examples/step/01/rest/1.js.](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/rest/1.js)
그리고
[common/](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common)
- 실행 방법: `node ./examples/step/01/rest/1.js`
- 이전 페이지의 [examples/step/01/db-connector/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/db-connector/1.js)와 비교하세요
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-1-side.html)

## REST API 서버 구현

이전 예제에서 데이터베이스 메소드 호출을 제거하고 Express 서버를 추가했습니다.
[import](../../../examples/step/01/rest/1.js)

- 변경 사항 보기:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-rest-1-side.html)

Express 서버 설정은 [common/expressServerConfig.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/expressServerConfig.js)
입니다.
[import](../../../examples/step/01/common/expressServerConfig.js)

Express 미들웨어 [common/expressMiddleware/index.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/expressMiddleware/index.js)는 로그, 없는 페이지 처리 및 에러 처리를 합니다.
[import](../../../examples/step/01/common/expressMiddleware/index.js)

> **보일러플레이트.** 서버 설정과 미들웨어는 표준 Express 입니다.
그들은 REST 요청을 피드에 보내는 것 외에는 Feathers와 관련이 거의 없습니다.

## 서버 실행

이제 서버에 REST API 호출을 할 수 있습니다.

이전 예제에서 3명의 사용자 아이템을 생성한 다음 출력해보았습니다. 이제 동일한 작업을 REST를 [curl](https://en.wikipedia.org/wiki/CURL) 커맨드를 이용해 요청할 수 있습니다.
[import](../../../examples/step/01/rest/curl-requests.sh)

첫째로, 터미널에서 `node ./examples/step/01/rest/1.js`를 실행하여 서버를 실행합니다.
그리고 다른 터미널에서 curl 커맨드인 `./examples/step/01/rest/curl-requests.sh`를 실행합니다.

## 결과

콘솔에서 아래와같이 출력됩니다.

```text
feathers-guide$ ./examples/step/01/rest/curl-requests.sh
POST Jane Doe
{"email":"jane.doe@gmail.com","password":"X2y6","role":"admin","_id":"sbkXV7LVkMhx1NyY"}
POST John Doe
{"email":"john.doe@gmail.com","password":"i6He","role":"user","_id":"uKhqOp4R4hABw9oO"}
POST Judy Doe
{"email":"judy.doe@gmail.com","password":"7jHw","role":"user","_id":"pvcmh9X2i9VZgqWJ"}
GET all users
[
 {"email":"judy.doe@gmail.com","password":"7jHw","role":"user","_id":"pvcmh9X2i9VZgqWJ"},
 {"email":"jane.doe@gmail.com","password":"X2y6","role":"admin","_id":"sbkXV7LVkMhx1NyY"},
 {"email":"john.doe@gmail.com","password":"i6He","role":"user","_id":"uKhqOp4R4hABw9oO"}
]
```

> **Feathers.** REST API호출은 자동으로 Feathers 데이터베이스 메소드 호출로 변환됩니다. 앞의 예제에서 사용한 `users.create()`와 `users.find()`메소드와 비슷합니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Rest-api-server&body=Comment:Step-Basic-Rest-api-server)
