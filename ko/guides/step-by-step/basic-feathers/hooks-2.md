# 훅, 파트2

주식 이동 기록 보관소가있는 경우,
더 이상 보관하지 않으려는 재고 항목을 단순히 삭제할 수 없습니다.
삭제한다면 과거 데이터를 제대로 표시 할 수 없습니다.

해결책은 데이터를 유지하면서 삭제된 것으로 표시하는 것입니다.
역사적으로 삭제 된 항목에 액세스하는 것을 알고있을 때 `deleted` 플래그를 무시할 수 있습니다.
그렇지 않으면 항목이 존재하지 않는 것처럼 애플리케이션이 작동하기를 원합니다.

**소프트 삭제**를 구현하는 것은 상당히 복잡 합니다.
그러나 `softDelete` 훅을 사용하여 쉽게 할 수 있습니다.

## 작동하는 예제

- 서버 코드: [examples/step/01/hooks/2.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/hooks/2.js)
- 클라이언트 코드: [common/public/rest-del.html](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/rest.html)
와
[common/public/feathers-app-del.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/common/public/feathers-app-del.js)
- 서버 시작: `node ./examples/step/01/hooks/2`
- 브라우저 접속 주소: `localhost:3030/rest-del.html`
- 이전 페이지의 서버와의 비교
[hooks/1.js.](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/01/hooks/1.js):
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-2-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-2-side.html)

## softDelete 사용

이전 서버 예제를 단 하나만 변경합니다.
서비스 메소드가 발견되지 않으면 when hook을 사용하여 softDelete 후크를 실행합니다.

```javascript
const {
  softDelete, when, // new
  setCreatedAt, setUpdatedAt, unless, remove
} = commonHooks;
// ...
userService.before({
    all: when(hook => hook.method !== 'find', softDelete()), // new
    create: [ /* ... */ ]
});
```
- 변경된 부분을 확인하세요:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-2-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/01-hooks-2-side.html)

## 결과

브라우저 콘솔 출력입니다.

```text
created Jane Doe item
  Object {email: "jane.doe@gmail.com", role: "admin", createdAt: "2017-05-31T08:41:48.640Z", updatedAt: "2017-05-31T08:41:48.640Z", _id: "CfLheOpJ3rve1IPh"}
created John Doe item
  Object {email: "john.doe@gmail.com", role: "user", createdAt: "2017-05-31T08:41:48.623Z", updatedAt: "2017-05-31T08:41:48.623Z", _id: "sQy34FUrDC8gJOUR"}
created Judy Doe item
  Object {email: "judy.doe@gmail.com", role: "user", createdAt: "2017-05-31T08:41:48.641Z", updatedAt: "2017-05-31T08:41:48.641Z", _id: "eKNolHDBO6qXH2MU"}
created Jack Doe item
  Object {email: "jack.doe@gmail.com", role: "user", createdAt: "2017-05-31T08:41:48.641Z", updatedAt: "2017-05-31T08:41:48.641Z", _id: "5iQCl2oDLbVXMfHo"}
deleted Jack Doe item
  Object
    email: "jack.doe@gmail.com",
    role: "user",
    deleted: true
    createdAt: "2017-05-31T08:41:48.641Z",
    updatedAt: "2017-05-31T08:41:48.641Z",
    _id: "5iQCl2oDLbVXMfHo"
find all items
  [Object, Object, Object, Object]
    0: Object
      email: "jack.doe@gmail.com"
      role: "user"
      password: "$2a$10$So9MhiVGW.P31CZnUefXXOcuacwKMm7nTgCAPSBZB9rO10how.X.G"
      deleted: true
      createdAt: "2017-05-31T08:41:48.641Z"
      updatedAt: "2017-05-31T08:41:48.641Z"
      _id: "5iQCl2oDLbVXMfHo"
    1: Object
      email: "jane.doe@gmail.com"
      password: "$2a$10$TAz6SD6WxEostxvCNMOubuEY68pS8Jv9pLvrrgCiWTIOjIs3yIlO."
      role: "admin"
      createdAt: "2017-05-31T08:41:48.640Z"
      updatedAt: "2017-05-31T08:41:48.640Z"
      _id: "CfLheOpJ3rve1IPh"
    2: Object
      email: "judy.doe@gmail.com"
      password: "$2a$10$GvUEJfPTQLGY8JKTuH8yeeML9auVLo1IGDVyGFOOImZ0Nuxtd7uji"
      role: "user"
      createdAt: "2017-05-31T08:41:48.641Z"
      updatedAt: "2017-05-31T08:41:48.641Z"
      _id: "eKNolHDBO6qXH2MU"
    3: Object
      email: "john.doe@gmail.com"
      password: "$2a$10$MX0LJerCfLoGx31mGh2x0eR7CyE2t2STeHhpcV9vYbpD3m8i8OZ.S"
      role: "user"
      createdAt: "2017-05-31T08:41:48.623Z"
      updatedAt: "2017-05-31T08:41:48.623Z"
      _id: "sQy34FUrDC8gJOUR"
    length: 4
```

- Jack Doe 아이템이 삭제되었을 때 리턴 된 결과는`deleted : true`를 포함합니다.
- find에 대해 반환 된 결과에는 softDelete 훅을 컨디셔닝하는 방법 때문에 Jack Doe에 대한 `deleted : true`도 포함됩니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Hooks-2&body=Comment:Step-Basic-Hooks-2)
