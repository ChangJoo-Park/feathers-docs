# 데이터베이스 커넥터

첫번째 Feathers 예제는 서버관련 내용만 다룹니다.
데이터베이스 테이블을 사용하는 것이 얼마나 쉬운지 알 수 있습니다.

NeDB 데이터베이스 테이블에 약간의 사용자 항목을 추가하고 다시 출력합니다.

> **데이터베이스.** 우리는 Feathers에 집중하기 위해 NeDB를 사용합니다. NeDB는 인기 있는 MongoDB와 유사합니다. 그러나 설치나 설정이 필요하지 않습니다.

> Feathers는 20개 이상의 데이터베이스를 지원합니다. 
이 가이드에서 언급한 내용은 모든 데이터베이스에 적용됩니다.

## 작동하는 예제

- 소스 코드: [examples/step/01/db-connector/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/db-connector/1.js)
- 실행하세요: `node ./examples/step/01/db-connector/1.js`

소스코드에 `/// [dependencies]`와 `//! [dependencies]`와 같은 내용이 있습니다.
무시하세요. 가이드에서 자동으로 출력하기 위해 넣어놓은 코드 입니다.

## Feathers는 모듈 방식입니다.

Feathers는 인기있는 HTTP 서버 프레임워크인 [Express](http://expressjs.com/)와 같은 정신을 계승합니다.

Feathers는 완전히 선택사항인 작은 모듈로 구성되며 코어는 몇백줄의 코드로 구성됩니다. Feathers는 매우 가볍습니다! Feathers가 왜 이 이름을 가졌는지 알 수 있습니다.

## 의존성이 필요합니다.
[import:'dependencies'](../../../examples/step/01/db-connector/1.js)

## Feathers 인스턴스와 서비스를 정의합니다.
[import:'feathers'](../../../examples/step/01/db-connector/1.js)

users는 사용할 유일한 서비스이며 examples/step/data/users.db에 있는 데이터베이스 테이블 입니다.
[import:'services'](../../../examples/step/01/db-connector/1.js)

## 3명의 사용자를 Promise를 사용해 만듭니다.
[import:'create'](../../../examples/step/01/db-connector/1.js)
각 생성시마다 데이터베이스에 성공적으로 추가한 경우 promise는 resolve를 리턴합니다. 
NeDB는 항상 유니크 `_id`가 추가된 사용자 아이템을 반환합니다.

> **콜백과 프라미스.**
`users.create({ ... }, {}, (err, data) => { ... })`
위 명령어는 콜백을 사용하여 사용자 항목을 만듭니다.

그러나 Feathers 팀이 Promise를 더 우선시하기 떄문에 가이드에서는 Promise를 사용합니다.

> ** Promise Refresher.** `Promise.all([ ... ]).then(results => { ... });`
Promise.all은 JavaScript 값 또는 Promise 배열을 사용합니다.
배열에 Promise에 있는 **모든** Promise가 해결되거나 거부될 겅우 해결될 단일 promise를 반환합니다.
엘리먼트는 순차적이 아닌 병렬로 처리되므로 Promise.all은 독립적인 작업을 시작하는데 좋은 패턴입니다.
`then`은 모든 엘리먼트가 해결되면 호출됩니다. 매개변수로 배열을 받습니다.
배열의 N번째 엘리먼트는 Promise.all의 N번째로 해결된 값입니다.

3개 사용자 아이템이 데이터베이스에 있으며 그 값은 `results`로 반환됩니다.
우리는 전체 테이블 찾아 출력합니다.
[import:'results'](../../../examples/step/01/db-connector/1.js)

> ** Promise Refresher.** `user.find().then(results => ...);`
`user.find()`은 Promise를 반환합니다. `.then(results => ...)` 은 Promise가 해결될 때까지 기다립니다.
표에 있는 0, 한개 이상의 아이템은 `results` 매개변수로 반환됩니다.


| [db-connector/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/db-connector/1.js)를 확인하세요

## 서비스 메소드

Feathers는 아래의 [service methods](../../../api/services.md#service-methods)를 제공합니다.

```javascript
find(params)
get(id, params)
create(data, params)
update(id, data, params)
patch(id, data, params)
remove(id, params)
```

Feathers는 쿼리, 정렬, 제한 그리고 `params` 일부를 이용해 선택적인 검색(예: `{ query: { ... }, ... }`)을 하는 등의 [일반적인 방법](../../../api/databases/querying.md)을 지원합니다.
쿼리는 `id`가 `null`로 설정된 경우 메소드 호출을 갱신, 패치 및 제거하는 데에도 적용됩니다.

> **프로 팁:** find 메소드는 반환된 아이템의 순서를 보장하지는 않습니다.

## 결과

`node ./examples/step/01/db-connector/1.js`를 실행하세요 

콘솔에서 출력됩니다.

```text
feathers-guide$ node ./examples/step/01/a/1
created Jane Doe item
 { email: 'jane.doe@gmail.com',
  password: 'X2y6',
  role: 'admin',
  _id: '6Rq7O4RPYEO2TdAn' }
created John Doe item
 { email: 'john.doe@gmail.com',
  password: 'i6He',
  role: 'user',
  _id: 'Q2bnsBRfO1ScqoqY' }
created Judy Doe item
 { email: 'judy.doe@gmail.com',
  password: '7jHw',
  role: 'user',
  _id: 'Tymf6Nailusd5MZD' }
find all items
 [ { email: 'jane.doe@gmail.com',
    password: 'X2y6',
    role: 'admin',
    _id: '6Rq7O4RPYEO2TdAn' },
  { email: 'john.doe@gmail.com',
    password: 'i6He',
    role: 'user',
    _id: 'Q2bnsBRfO1ScqoqY' },
  { email: 'judy.doe@gmail.com',
    password: '7jHw',
    role: 'user',
    _id: 'Tymf6Nailusd5MZD' } ]
```

> **보일러플레이트** Feathers는 약간의 보일러플레이트를 요구합니다.
약 15줄의 코드로 데이터베이스를 접속할 수 있습니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Db-connector&body=Comment:Step-Basic-Db-connector)
