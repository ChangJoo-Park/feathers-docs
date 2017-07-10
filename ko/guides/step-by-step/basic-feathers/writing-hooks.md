# 사용자 정의 훅 만들기


## 훅 함수 템플릿

훅 함수는 반드시 아래의 형태를 갖추어야 합니다.

```javascript
// 외부 함수는 훅 함수를 초기화합니다.
function myHook(options) {
  // 훅 그 자체를 리턴합니다.
  return context => {
    // 옵션 매개변수를 사용하여 훅 내의 동작을 조절할 수 있습니다.
  };
}
```

Feathers는 [context object](../../../api/hooks.md#hook-objects) 객체를 이용해 내부 함수를 호출할 수 있습니다.

`context.result`는 `find`를 제외한 모든 메소드 호출을 위한 객체 또는 배열입니다.
`find`는 페이징을 하게 된다면 [객체](../../../api/databases/common.html#pagination)입니다.

그 외에는 배열입니다.

훅 함수는 동기적으로 리턴하거나 Promise를 리턴할 수 있습니다.
반환된 값(sync) 또는 Promise(async)로부터 해결된 값은 새로운 컨텍스트 객체이거나 `undefined`입니다.

> **ProTip** 컨텍스트 객체는 `undefined`를 반환받은 경우 변경되지 않습니다.



> **ProTip** `context` 매개변수를 반환하지 않고 훅 함수 내부에서 변경한 다음 훅에 전달된 컨텍스트 객체는 변경되지 않습니다.

직접 훅을 만들기 이전에 [common hooks](../../../api/hooks-common.md)의 소스를 살펴봅니다.

## debug [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/debug.js)

`debug`는 컨텍스트를 콘솔에 출력합니다.

```javascript
export default function (msg) {
  return context => {
    console.log(`* ${msg || ''}\ntype:${context.type}, method: ${context.method}`);
    if (context.data) { console.log('data:', context.data); }
    if (context.params && context.params.query) { console.log('query:', context.params.query); }
    if (context.result) { console.log('result:', context.result); }
    if (context.error) { console.log('error', context.error); }
  };
}
```

이 훅은 직관적이며 `context` 객체 속성 중 일부만 표시합니다.
내부의 훅 함수는 기본적으로 `undefined`를 반환하기 때문에 컨텍스트 객체는 변경되지 않습니다.

`debug` 는 다른 훅을 디버깅하기 좋은 훅입니다.
이 훅을 테스트하기 원하는 이전 또는 이후 훅에 위치시키면
테스트 훅이 받은 컨텍스트 객체와 리턴된 컨텍스트 객체를 볼 수 있습니다.

이 예제는
- 많은 컨텍스트 속성을 보여줍니다.
- 컨텍스트 객체를 동기적으로 `return` 시 변경하지 않고 유지합니다.


## disableMultiItemChange [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/disable-multi-item-change.js)

`disableMultiItemChange`는 update, patch, remove 메소드가 `null`을 id로 사용하지 못하게 합니다.
예: `remove(null)`
`null` id는 DB의 모든 아이템에 영향을 미치므로 실수로 사용하게 되면 바람직하지 못한 결과가 발생할 수 있습니다.

```javascript
import errors from 'feathers-errors';
import checkContext from './check-context';

export default function () {
  return function (context) {
    checkContext(context, 'before', ['update', 'patch', 'remove'], 'disableMultiItemChange');

    if (context.id === null) {
      throw new errors.BadRequest(
        `Multi-record changes not allowed for ${context.path} ${context.method}. (disableMultiItemChange)`
      );
    }
  };
}
```

훅 중 일부는 반드시 `before`나 `after`에서만 사용해야합니다. 일부는 특정 메소드에서만 사용할 수 있습니다.
[`checkContext` utility](../../../api/hooks-common.md#util-checkcontext) 훅이 제대로 사용되는지 확인해봅니다.


이 훅은 클라이언트에 적절하게 리턴될 에러를 던집니다(throw).
```javascript
service.patch(null, data, { query: { dept: 'acct' } })
  .then(data => ...)
  .catch(err => {
    console.log(err.message); // Multi-record changes not allowed for ...
  });
```

이 예제는
- `checkContext`를 소개합니다.
- 훅 안에서 에러를 던지는 방법을 살펴보았습니다.


## pluckQuery [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/pluck-query.js)

`pluckQuery`는 지정된 필드를 제외한 쿼리 매개변수의 모든 필드를 버립니다. 이러면 쿼리를 보호할 수 있습니다.

```javascript
import _pluck from '../common/_pluck';
import checkContext from './check-context';

export default function (...fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'pluckQuery');

    const query = (context.params || {}).query || {};
    context.params.query = _pluck(query, fieldNames);

    return context;
  };
}
```

`_pluck` 유틸리티는 객체와 속성 이름의 배열이 주어지면, 해당 속성으로만 구성된 객체를 반환합니다.
속성 이름은 점 표기법으로 표시합니다. 예: `destination.address.city`

컨텍스트 객체가 수정되어 반환되어 다음 컨텍스트로 전달되는 컨텍스트가 수정됩니다.


이 예제는
- 컨텍스트 객체를 수정해 동기적으로 리턴합니다.
- `_pluck`를 소개합니다.


## pluck [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/pluck.js)

`pluck`는 제출된 데이터나 결과로부터 지정된 필드를 제외한 모든 필드를 버립니다.
데이터가 배열 또는 페이징 된 find의 결과이면 훅은 모든 항목의 필드를 제거합니다.

```javascript
import _pluck from '../common/_pluck';
import checkContextIf from './check-context-if';
import getItems from './get-items';
import replaceItems from './replace-items';

export default function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'pluck');

    if (context.params.provider) {
      replaceItems(context, _pluck(getItems(context), fieldNames));
    }

    return context;
  };
}
```

[`getItems` 유틸리티](../../../api/hooks-common.md#util-getitems-replaceitems)는 해당 아이템이 `hook.data` 또는 `hook.result`에 있는 아이템을 반환합니다. 훅이 before 또는 after 훅으로 사용됩니다.

`find` 메소드에 대해 `hook.result.data` 또는 `hook.result`이 리턴됩니다.

반환된 아이템은 추가적인 처리를 단순화하기 위해 항상 배열입니다.

[`replaceItems` utility](../../../api/hooks-common.md#util-getitems-replaceitems)는 `getItems`의 역순으로 들어온 아이템을 반환합니다.

이 예제는
- 유용하게 사용할 수 있는 `getItems`와 `replaceItems`를 살펴보았습니다.


## 에러 쓰로우 - disableMultiItemChange [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/disable-multi-item-change.js)

조만간, DB 호출을 하지 않고 호출한 사람에게 오류를 반환할 것입니다.
[Feathers error](../../../api/errors.md)를 던져 이 작업을 할 수 있습니다.

`disableMultiItemChange`는 update, patch, remove 메소드가 null을 id로 사용하지 못하도록합니다.

```javascript
import errors from 'feathers-errors';
import checkContext from './check-context';

export default function () {
  return function (context) {
    checkContext(context, 'before', ['update', 'patch', 'remove'], 'disableMultiItemChange');

    if (context.id === null) {
      throw new errors.BadRequest(
        `Multi-record changes not allowed for ${context.path} ${context.method}. (disableMultiItemChange)`
      );
    }
  };
}
```

Feathers의 에러는 유연하며 [유용한 필드](../../../api/errors.md)를 가지고 있습니다.

특히 유의사항은 다음과 같습니다.
- `className`은 에러의 타입을 반환합니다. 예: `not-found`
코드는 오류 메시지의 텍스트가 아닌 이 필드를 확인할 수 있습니다.
- `errors`는 개별 필드에 대한 에러 메시지를 반환할 수 있습니다.
클라이언트 측 폼 핸들러에서 예상한대로 포맷을 지정할 수 있습니다.

```javascript
throw new errors.BadRequest('Bad request.', { errors: {
  username: 'Already in use', password: 'Must be at least 8 characters long'
}});
```

이 예제는
- 오류가 발생하여 메서드 호출을 멈추는 방법을 보여줍니다.

## 결과 반환

정적 데이터를 가진 서비스의 경우 `get` 호출이 완료 될 때마다 레코드가 `cache`에 추가된다고 가정하십시오.
그런 다음 우리는 이미 레코드가 있는지 확인하여 향후 `get` 호출에 대한 성능을 잠재적으로 향상시킬 수 있습니다.

```javascript
import { checkContext } from 'feathers-hooks-common';

export default function (cache) {
  return context => {
    checkContext(context, 'before', ['get'], 'memoize');

    if (context.id in cache) {
      context.result = cache[context.id];
      return context;
    }
  };
};
```

Feathers는 `hook.result`가 설정된 경우 데이터베이스 호출을 하지 않습니다.
남은 before, after 훅은 계속 실행됩니다.

이 훅이 캐시된 레코드를 찾으면, `hook.result`에 저장하면 데이터베이스가 레코드를 반환했을 때와 같습니다.

이 예제는
- `before` 훅이 호출 결과를 어떻게 결정할 수 있는지 보여줍니다.


## 간단한 비동기 훅

이제까지 동기화 훅을 알아보았습니다. 이제 비동기 훅을 살펴보겠습니다.

다음은 비동기 함수를 호출하는 간단한 before 훅입니다.
이 함수는 `context.data`의 값이 유효한지를 결정합니다.

```javascript
import errors from 'feathers-errors';

export default function (validator) {
  return context => {
    return validator(context.data)
      .then(() => context)
      .catch(errs => {
        throw new errors.BadRequest('Validation error', { errors: errs });
      });
  };
}
```

훅은 기존의 컨텍스트 객체로 해석되는 Promise를 반환하거나 발견된 에러가 포함된 에러 객체를 반환합니다.

Promise가 해결되고 훅의 로직이 끝날 때 까지 이 훅은 실행되지 않습니다.

> **ProTip** 아마 비동기 훅을 작성할 때 가장 많이 발생하는 에러는 Promise를 *리턴하지 않는 것* 일 것입니다.
훅은 `validator(context.data)`인 경우 작동하지 않습니다. 반드시 `return validator(context.data)`이어야 합니다.

이 예제는
- 비동기 훅을 사용하는 방법을 보여줍니다.


## 서비스 호출

다음은 사용자 정보를 하나의 레코드에 추가하는 (간단한) after 훅입니다.


```javascript
export default function () {
    return context => {
      const service = context.app.service('users');
      const item = getItems(context)[0];

      if (item.userId !== null && item.userId !== undefined) {
        return service.get(item.userId, context.params)
          .then(data => {
            item.user = data;
            return context;
          })
          .catch(() => context);
      }
    };
};
```

- `context.app`는 Feathers 앱이므로 `context.app.service(path/to/service)`는 해당 서비스를 반환합니다.
- 훅은 변이된 컨텍스트를 해결(resolved)한 프라미스를 반환합니다. 또는,
- `userId`가 없으면 컨텍스트를 수정하지 않고 동기적으로 훅을 반환합니다.

Its important that `context.params` is used in the `get`.
`context.params`를 `get`에서 사용하는 것이 중요합니다.
훅 안에서 서비스를 호출할 때는 항상 `params`를 고려해야 합니다.
(결국 서버가 호출합니다)
훅이 실행되도록 하는 메소드 호출이 클라이언트에서 시작된 경우에도 마찬가지입니다.

이는 좋지 않을 수 있습니다.
서버가 사용자 레코드를 읽을 때 사용자 비밀번호가 반환 될 수 있지만 클라이언트가 액세스하지 못하게해야합니다.

이 훅은 메소드 호출의 `context.params`를 이용해 간단히 접근할 수 있습니다.
따라서 `get`은 메소드 호출과 같은 `context.provider`(예: "socketio", "rest", undefined), `context.authenticated` 등으로 실행됩니다.

이는 종종 불편할 수 있습니다 그렇지 않다면 조금 더 포괄적인 예를 살펴보겠습니다.

> **ProTip** 훅을 통해 서비스를 호출할 때는 항상 `params` 를 주의하세요.

흥미있을만한 내용이 있습니다. `replaceItems`는 절대 호출되지 않습니다.
`getItems`가 반환한 배열에는 컨텍스트 내부의 객체와 같은 객체가 포함됩니다.
따라서 배열의 객체를 변경하면 컨텍스트에서 해당 객체가 변경됩니다.

아래와 유사합니다.

```javascript
const foo = { name: 'John' };
const bar = [ foo ];
bar[0].project = 'Feathers';
console.log(foo); // { name: 'John', project: 'Feathers' }
```

이 예제는
- 서비스를 호출하는 방법을 보여줍니다.
- 호출에서 `params`를 다루는 법을 보여줍니다.
- 변이가 있는 `getItems`를 살펴보았습니다.


## stashBefore [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/stash-before.js)

`stashBefore` 변이되기 이전의 현재 값을 저장합니다.

```javascript
import errors from 'feathers-errors';
import checkContext from './check-context';

export default function (prop) {
  const beforeField = prop || 'before';

  return context => {
    checkContext(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    if (context.id === null || context.id === undefined) {
      throw new errors.BadRequest('Id is required. (stashBefore)');
    }

    if (context.params.query && context.params.query.$disableStashBefore) {
      delete context.params.query.$disableStashBefore;
      return context;
    }

    const params = (context.method === 'get') ? context.params : {
      provider: context.params.provider,
      authenticated: context.params.authenticated,
      user: context.params.user
    };

    params.query = params.query || {};
    params.query.$disableStashBefore = true;

    return context.service.get(context.id, params)
      .then(data => {
        delete params.query.$disableStashBefore;

        context.params[beforeField] = data;
        return context;
      })
      .catch(() => context);
  };
}
```

다른 서비스를 호출하는 것보다 훅의 현재 서비스를 호출하는 것이 더욱 복잡합니다.
이 훅의 코드를 살펴봅니다.

훅이 반환하는 것 입니다.

```javascript
return context.service.get(context.id, params)
  .then(data => {
    delete params.query.$disableStashBefore;

    context.params[beforeField] = data;
    return context;
  })
  .catch(() => context);
```

- `context.service`는 항상 현재 서비스입니다.
- `context.service.get()` 는 비동기 호출이며 Promise를 반환합니다.
- 반환된 훅은 Promise이며 이는 비동기 훅입니다.
다음 Promise는 해결(resolve)되면 실행됩니다.
- `get`으로 얻은 데이터는 `context.params`에 저장됩니다..
- Promise가 항상 컨텍스트를 해결할 것을 알 수 있습니다.

요약하면, 훅은 호출을 통해 변경되는 레코드를 `get`할 것이고,
그 레코드를 `context.params`에 넣을것이며
수정된 `context`를 리턴합니다.
아무 일도 일어나지 않은 것 처럼 메소드 호출은 계속 됩니다.

`stashBefore`는`context.params`가 `Sequelize`를 사용하고
메서드 호출이 Sequelize로 전달된 매개 변수를 포함하는 경우
`context.params`가 `get` 호출에서`context.params`를 사용하지 않는 것은 옳지 않을 수 있습니다.
`update`에 적절한 것은`get`을 위해 받아 들여지지 않을 수도 있습니다.

```javascript
const params = context.method === 'get' ? context.params : {
  provider: context.params.provider,
  authenticated: context.params.authenticated,
  user: context.params.user
};
```

- `get` 호출에서 내부 `get`에 대해 같은 `params`를 사용합니다.
- 다른 호출은 "안전한"것을 사용합니다.
    - 내부의 `get`이 같은 전송을 하는 것 처럼 `provider`를 복사합니다.
    - 인증 훅에 대한 표준 인증 값을 복사합니다.

이는 모든 유즈케이스를 만족시킬 수 있을까요?
그럴리가 없지만, 대부분 만족스러울 것 입니다.
훅을 포크하여 사용자 정의 할 수 있습니다.

한가지 더 고려해야할 사항이 있습니다.
`stashBefore` 훅은 내부의 `get`을 호출할 때 한번 더 호출됩니다.
이는 우리가 무언가 처리하지 않으면 `get` 호출의 재귀를 일으킬 것입니다.

```javascript
if (context.params.query && context.params.query.$disableStashBefore) {
  delete context.params.query.$disableStashBefore;
  return context;
}
//
params.query = params.query || {};
params.query.$disableStashBefore = true;
//
delete params.query.$disableStashBefore;
```

우리는 내부 `get`을 위해 플래그를 만들었습니다.
`stashBefore`는 내부의 `get`을 위해 실행할 때 플래그를 확인하고 재귀를 막을 것 입니다.

> **ProTip** 상태 조작이 무엇인지 나타내는 것은 자주 있는 일입니다. `params` 에 플래그를 설정하세요

이 예제는
- 현재 서비스를 호출하는 방법을 보여줍니다.
- 서비스 호출을 위해 `params`를 핸들링 하는 방법을 다룹니다.
- 재귀를 방지하는 방법을 다룹니다.


## iff, when, else

조건부 훅인 `iff(predicate, hook1, hook2).else(hook3, hook4)` 매우 유용하게 사용할 수 있습니다..

스스로 예상되는 결과를 쉽게 작성할 수 있습니다.

이들은 컨텍스트를 매개변수로 받고 부울린(동기) 부울린으로 해결되는 Promise를 반환하는
`context => boolean`로 구성된 함수입니다.

`isProvider`와 같은 공통 훅으로 제공되는 술어를 결합할 수 있습니다.
[source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/is-provider.js).
직접 작성하거나 조합할 수 있습니다.

```javascript
iff (hook => !isProvider('service')(hook) && hook.params.user.security >= 3, ...)
```

`isNot` 조건부 유틸리티([source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/common/is-not.js))는
boolean 또는 Promise가 부울린으로 해결되지 않을 때 유용합니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Writing-Hooks&body=Comment:Step-Basic-Writing-Hooks)
