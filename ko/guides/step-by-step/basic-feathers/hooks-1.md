# 훅, 파트1

## 일반적으로 사용하는 훅

훅을 사용하면 간단한 기능들을 결합하여 복잡한 솔루션을 만들 수 있습니다.
대부분의 훅은 본질적으로 일반적이며 여러 서비스에서 사용할 수 있습니다.

Feathers는 [일반적으로 사용할만한 유용한 훅](../../../api/hooks-common.md)을 제공합니다.
이제 이것 중 일부를 사용해 보겠습니다.

## 작동하는 예제

- 서버 코드: [examples/step/01/hooks/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/hooks/1.js)
- 클라이언트 코드: [common/public/rest.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/rest.html)
그리고
[feathers-app.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app.js)
- 서버 시작: `node ./examples/step/01/hooks/1`
- 브라우저 접속 주소: `localhost:3030/rest.html`
- 이전 페이지의 서버와의 비교
[examples/step/01/hooks/1.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/hooks/1.js):
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-1-side.html)

## 훅 작성하기

Feathers REST와 WebSocket 클라이언트에서 사용했던 서버에 훅을 추가해보겠습니다.

```javascript
const authHooks = require('feathers-authentication-local').hooks;
const hooks = require('feathers-hooks');
const commonHooks = require('feathers-hooks-common');

const app = httpServerConfig()
  .configure(hooks())

function services() {
  this.configure(user);
}

function user() {
  const app = this;

  app.use('/users', service({ Model: userModel() }));
  const userService = app.service('users');

  const { validateSchema, setCreatedAt, setUpdatedAt, unless, remove } = commonHooks;

  userService.before({
    create: [
      validateSchema(userSchema(), Ajv), authHooks.hashPassword(), setCreatedAt(), setUpdatedAt()
    ]});
  userService.after({
    all: unless(hook => hook.method === 'find', remove('password')),
  });
}

function userSchema() {
  return {
    title: 'User Schema',
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: [ 'email', 'password', 'role' ],
    additionalProperties: false,
    properties: {
      email: { type: 'string', maxLength: 100, minLength: 6 },
      password: { type: 'string', maxLength: 30, minLength: 8 },
      role: { type: 'string' }
    }
  };
}
```
- 변경된 부분입니다:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-1-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-1-side.html)


### - .configure(hooks())

설정에 훅 지원을 추가합니다.

### - this.configure(user);

사용자 서비스는 더 복잡하지므로 독자적으로 구성할 수 있습니다.

### - const { validateSchema, setCreatedAt, setUpdatedAt, unless, remove } = commonHooks;

Feathers는 유용한 훅 라이브러리를 제공합니다.
[`feathers-hooks-common`](../../../api/hooks-common.md)은 일반적으로 사용할만한 훅의 모음입니다.
보다 특수한 훅은 전용 패키지와 함께 번들로 제공합니다.

### - userService.before({ ... });

이러한 훅은 데이터베이스 작업 전에 실행합니다.

### - create: [ ... ]

이 훅은 데이터베이스의 모든 `create` 이전에 실행됩니다.
`all` (all 서비스 메소드), `get`, `update`', `patch`, `remove`, `find`도 포함할 수 있습니다.

### - validateSchema(userSchema(), Ajv)

서비스의 [JSON schema](https://github.com/json-schema-org/json-schema-spec)의  `function userSchema`에 의해 제공됩니다.

여기에 JSON 스키마를 이용해 데이터를 검증하는
[좋은 예제](https://code.tutsplus.com/tutorials/validating-data-with-json-schema-part-1--cms-25343)가 있습니다.

### - authHooks.hashPassword()

데이터는 `password` 필드를 가집니다.
이 특수한 인증 훅은 해시된 버전으로 변경하여 암호를 안전하게 저장할 수 있습니다.

> **bcrypt.** Feathers는 암호 해시에 [bcrypt](https://www.npmjs.com/package/bcryptjs)를 사용합니다.
bcrypt는 암호화 알고리즘 중 가장 높은 평판을 가지고 있습니다. 꽤 오래동안 사용하였고 광범위하게 사용되었습니다. 큰 관심을 받고 있고 아직까지 깨지지 않았습니다.
[(Reference.)](http://security.stackexchange.com/questions/4781/do-any-security-experts-recommend-bcrypt-for-password-storage)

> **JSON webtoken.** Feathers 인증은 보안인증에 쿠키나 세션이 아니라 클라이언트와 서버사이의 JSON Webtoken(JWT)을 사용합니다.  
쿠키와 토큰에 관한 토론에서 [토큰 기반 인증을 선호하게 되었습니다](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/).
세션을 사용하지 않으면 Feathers 앱을 보다 쉽게 확장할 수 있습니다.

### - setCreatedAt(), setUpdatedAt()

이 훅들은  `createdAt`와  `updatedAt` 속성을 데이터의 속성에 추가할 수 있습니다.

### - userService.after({ ... });

이러한 훅은 데이터베이스 작업 후에 실행됩니다.
그들은 작업에서 반환 된 모든 결과에 따라 작동합니다.

### - unless(hook => hook.method === 'find', remove('password'))

- `hook => hook.method === 'find'`는 데이터베이스 연산이 `find`이면 참을 반환합니다.
모든 훅은  [hook object](../../../api/hooks.md#hook-objects)를 통해 전달됩니다. 여기에 연산에 대한 모든 정보가 들어있습니다.

- `remove('password')`
결과에서  `password` 속성을 제거합니다.

- `unless(predicate, ...hooks)`
predicate가 거짓이면 훅이 실행됩니다.

인코딩 된 암호를 클라이언트에 반환하는 것이 안전하지 않으므로이 후크에서 암호를 제거합니다.
결과에서 무언가를 보길 원하기 때문에 find 연산에 대한 예외를 만들었습니다.

> **훅.** 우리는 전형적인 애플리케이션을 처리하고 있습니다.
새 사용자를 추가하기 전에 데이터를 확인하고 암호를 인코딩 한 후 `createdAt` 와 `updatedAt` 속성을 추가합니다. 그리고 결과를 클라이언트에 반환하기 전에 암호 필드를 제거합니다.

## Hooks

공통적인 요구사항 중 많은 부분은 이미 [common hooks library](../../../api/hooks-common.md)에 준비되어 있습니다. 이를 사용하면 작성해야하는 코드의 양이 매우 줄어듭니다.

훅은 서비스 메소드가 실행되기 전후에 적용되는 작은 미들웨어 함수입니다.

훅은 독립적으로 전달됩니다. 서비스 요청의 완료 여부는 중요하지 않습니다. HTTP REST, Feathers REST, Feathers WebSockets 또는 기타 전송 Feather가 향후 지원 될 수 있습니다.

대부분의 훅은 어떤 서비스와도 함께 사용할 수 있습니다.
이렇게하면 실제 서비스 로직을 다음과 같은 것들과 쉽게 분리 할 수 있습니다.
권한 부여, 데이터 사전 처리 (불필요한 데이터 제거 및 유효성 검사), 데이터 후 처리 (직렬화),
이메일이나 문자 메시지와 같은 알림을 전송할 수 있습니다.

최소한의 애플리케이션 코드 변경으로 데이터베이스를 교체할 수 있습니다.
동일한 앱, 여러 앱 및 클라이언트에서 여러 데이터베이스에 대한 유효성을 공유 할 수도 있습니다.

## 결과

브라우저 콘솔 출력입니다.

```text
created Jane Doe item
  Object {email: "jane.doe@gmail.com", role: "admin", createdAt: "2017-05-31T08:33:07.642Z", updatedAt: "2017-05-31T08:33:07.643Z", _id: "VNSm7SxZnMeVxN6Z"}
created John Doe item
  Object {email: "john.doe@gmail.com", role: "user", createdAt: "2017-05-31T08:33:07.643Z", updatedAt: "2017-05-31T08:33:07.643Z", _id: "SHyBbGehbEiZGpQS"}
created Judy Doe item
  Object {email: "judy.doe@gmail.com", role: "user", createdAt: "2017-05-31T08:33:07.645Z", updatedAt: "2017-05-31T08:33:07.645Z", _id: "2zFj0CoGjczuQP5B"}
find all items
  [Object, Object, Object]
    0: Object
      email: "judy.doe@gmail.com"
      password: "$2a$10$TnuSw.O9Jfss61BUFB0TteT9dDOdtSX00C.19vX484eICygo7xXMe"
      role: "user"
      createdAt: "2017-05-31T08:33:07.645Z"
      updatedAt: "2017-05-31T08:33:07.645Z"
      _id: "2zFj0CoGjczuQP5B"
    1: Object
      email: "john.doe@gmail.com"
      password: "$2a$10$jI7lypIIiImLw7Kf9mN.NOfaRkdP0sM0CeR1anH0J/f6p3fI9s2nu"
      role: "user"
      createdAt: "2017-05-31T08:33:07.643Z"
      updatedAt: "2017-05-31T08:33:07.643Z"
      _id: "SHyBbGehbEiZGpQS"
    2: Object
      email: "jane.doe@gmail.com"
      password: "$2a$10$Dx3e/3vSn4Eq2MRvKAUGYeUMWMUeuTG6PCJpxx9/Uyov5IZRb1B.6"
      role: "admin"
      createdAt: "2017-05-31T08:33:07.642Z"
      updatedAt: "2017-05-31T08:33:07.643Z"
      _id: "VNSm7SxZnMeVxN6Z"
    length: 3
```

- `createdAt`와 `updatedAt` 아이템에 추가되었습니다.
- `password`는 생성 및 삭제 작업을 위해 반환되는 데이터에 포함되지 않습니다.
- 인코딩 된 `password`는 검색  연산에 포함되어 있습니다. 왜냐하면 예제에 포함 된 특별한 코드 때문입니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Hooks-1&body=Comment:Step-Basic-Hooks-1)
