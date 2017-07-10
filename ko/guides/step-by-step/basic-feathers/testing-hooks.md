# 훅 테스팅

## 스스로 존재하는 훅

서비스나 다른 훅에 의존하지 않는 훅의 테스트는 간단합니다.
`context` 객체를 만들고, 내부 훅 함수를 호출한 후 반환된 `context`를 확인하세요.

`disableMultiItemChange`를 mocha 로 테스트한 예제의 일부분 입니다.

```javascript
import { assert } from 'chai';
import { disableMultiItemChange } from '../../src/services';

var hookBefore;

['update', 'patch', 'remove'].forEach(method => {
  describe(`services disableMultiItemChange - ${method}`, () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method,
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
        id: null
      };
    });

    it('allows non null id', () => {
      hookBefore.id = 1;

      const result = disableMultiItemChange()(hookBefore);
      assert.equal(result, undefined);
    });

    it('throws on null id', () => {
      hookBefore.id = null;

      assert.throws(() => { disableMultiItemChange()(hookBefore); });
    });

    it('throws if after hook', () => {
      hookBefore.id = 1;
      hookBefore.type = 'after';

      assert.throws(() => { disableMultiItemChange()(hookBefore); });
    });
  });
});
```

`pluck`을 mocha로 테스트한 예제의 일부분입니다.

```javascript
import { assert } from 'chai';
import hooks from '../../src/services';

var hookBefore;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('services pluck', () => {
  describe('plucks fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane', last: 'Doe' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { first: 'John', last: 'Doe' },
            { first: 'Jane', last: 'Doe' }
          ]
        } };
      hookFind = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' }
        ]
      };
    });

    it('updates hook before::create', () => {
      hooks.pluck('last')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      hooks.pluck('first')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      hooks.pluck('first')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });

    it('updates hook after', () => {
      hooks.pluck('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('does not update when called internally on server', () => {
      hookAfter.params.provider = '';
      hooks.pluck('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
      hooks.pluck('last', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: undefined, last: undefined } };
      hooks.pluck('first')(hook);
      assert.deepEqual(hook.data, {}); // todo note this
    });

    it('does not throw if field is null', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: null, last: null } };
      hooks.pluck('last')(hook);
      assert.deepEqual(hook.data, { last: null });
    });
  });
});
```

## Feathers 앱이 필요한 훅

어떤 훅은 서비스를 호출하거나 다른 훅이 실행 중이어야 합니다.
이들을 가짜로 만드려고 시도하는 것보다 Feathers app과 메모리 기반 서비스를 만드는 것이 훨씬 간단합니다.

`stashBefore`를 mocha로 테스트한 예제입니다.

```javascript
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const { stashBefore } = require('../../src/services');

const startId = 6;
const storeInit = {
  '0': { name: 'Jane Doe', key: 'a', id: 0 },
  '1': { name: 'Jack Doe', key: 'a', id: 1 },
  '2': { name: 'John Doe', key: 'a', id: 2 },
  '3': { name: 'Rick Doe', key: 'b', id: 3 },
  '4': { name: 'Dick Doe', key: 'b', id: 4 },
  '5': { name: 'Dork Doe', key: 'b', id: 5 }
};
let store;
let finalParams;

function services () {
  const app = this;
  app.configure(users);
}

function users () {
  const app = this;
  store = clone(storeInit);

  app.use('users', memory({
    store,
    startId
  }));

  app.service('users').before({
    all: [
      stashBefore(),
      context => {
        finalParams = context.params;
      }
    ]
  });
}

describe('services stash-before', () => {
  let app;
  let users;

  beforeEach(() => {
    finalParams = null;

    app = feathers()
      .configure(feathersHooks())
      .configure(services);

    users = app.service('users');
  });

  ['get', 'update', 'patch', 'remove'].forEach(method => {
    it(`stashes on ${method}`, () => {
      return users[method](0, {})
        .then(() => {
          assert.deepEqual(finalParams.before, storeInit[0]);
        });
    });
  });

  ['create', 'find'].forEach(method => {
    it(`throws on ${method}`, done => {
      users[method]({})
        .then(() => {
          assert(false, 'unexpectedly successful');
          done();
        })
        .catch(() => {
          done();
        });
    });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

Feathers의 NeDB 어댑터는 프로세스에서 두번 이상 열리지 않을 수 있으므로 사용하지 못 할수도 있습니다.
이를 해결하기 위해 mocha의 `--require` 옵션을 사용하세요
한번만 열고 Nodejs의 `global` 객체에 테스트를 첨부합니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Basic-Testing-Hooks&body=Comment:Step-Basic-Testing-Hooks)
