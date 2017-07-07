# Feathers 철학

We know! You're probably screaming _"Not another JavaScript framework!"_.
이미 알고 있습니다. "또 다른 JavaScript 프레임워크는 안돼!"라고 생각했을 것 입니다.

또한 Rails를 따라한 프레임워크와 기타 MVC 프레임워크들이 더이상 아무것도 하지 않는 것에 좌절했습니다. 대신 몇 년전에 서비스를 사용하여 웹 애플리케이션을 작성하고 크로스커팅 문제를 해결할 수 있는 다른 방법을 찾기 시작했습니다. 동시에 또 다른 바퀴를 만들지 않도록 조심했습니다.

이 실험을 통해 Feathers는 지금의 모습을 갖췄습니다. Feathers를 소개하는 우리의 핵심 철학은 몇년 전과 동일합니다.

> _"단일형 앱은 규모가 축소되는 경향이 있습니다. 성능 또는 코드에 너무 많은 사람이 참여하고 있기 때문입니다. 대규모 애플리케이션으로 시작할 필요없이 자연스럽게 서비스 지향적인 애플리케이션을 쉽게 만들 수 있다면 어떨까요?_

> _당신과 당신의 사업이 성장하는 프레임워크를 만들 수 있고 일련의 마이크로 서비스로 쉽게 전환하거나 코드의 분리 없이 쉽게 데이터베이스를 변경할 수 있다면 어떨까요?_

> _쉽게 더럽혀지지 않고 위협을 실시간으로 받지 않는다면 어떨까요? REST API를 구축하는데 필요한 보일러플레이트를 제거할 수 있다면 어떨까요? 쉽게 접근할 수 있는 구조를 제공하고 현대적인 애플리케이션에서 필요한 모든 공통 부분을 추가하면서도 모든 것을 유연하고 선택적으로 유지할 수 있는 프레임워크를 만들 수 있다면 어떨까요?_
>
> 프레임워크 자체가 독선적이어서는 안됩니다. 작고, 재사용이 가능한 컴포넌트들로 구성되어야하며, 한가지를 잘 수행하는 반면에 독창적인 방식으로 결합되어야 합니다. 애플리케이션의 컴포넌트를 작고 유연하며 선택적으로 유지하면 빠르게 앞서나갈 수 있고 확장을 방해하는 많은 엔지니어링 관련 장애물을 제거할 수 있습니다."_

우리는 당신의 UI, 데이터 및 비즈니스 로직이 웹 또는 모바일 애플리케이션의 핵심이며 당신의 프레임워크가 나머지를 처리하여 중요한 것에 집중할 수 있도록 해야한다고 강력하게 믿습니다.


## [서비스](../../api/services.md)

많은 웹 프레임워크는 뷰 렌더링, 라우트 정의 및 HTTP 요청 및 응답 처리와 같은 작업에 중점을 두고 있습니다. MVC 패턴을 사용하는 경우에도 결과가 지저분한 컨트롤러나 거대한 모델을 가진 단일형 애플리케이션이 됩니다. 실제 애플리케이션 로직과 데이터 액세스 방법은 모두 혼재되어 있습니다.

Feathers는 3가지 중요한 개념을 제공하여 이러한 우려를 애플리케이션의 작동 방식과 분리하고 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)를 유지하며 놀라운 유연성을 제공합니다.

서비스 레이어는 애플리케이션 로직이 어떻게 접근하고 표현 될 것인가에 대한 고민에서 분리시켜줍니다. 가짜 HTTP 요청을 하지않고 서비스 메소드를 호출하기만 하면 Feathers가 HTTP REST와 웹 소켓을 통해 동일한 API를 제공할 수 있습니다. 다른 RPC 프로토콜을 사용하도록 확장될 수 있으며 서비스를 변경할 필요가 없습니다.

#### 통일된 인터페이스

모든 Feathers 서비스는 REST 후에 모델링 된 일관된 인터페이스를 제공합니다. REST의 주요 제약 조건 중 하나인 액션 컨텍스트는 명명 규칙을 통해 명백해집니다. REST를 사용하면 HTTP verbs(GET, POST, PUT, PATCH와 DELETE)를 사용할 수 있습니다. 이들은 자연스럽게 서비스 객체 인터페이스로 변환됩니다.

```js
const myService = {
  // GET /path
  find(params, callback) {},
  // GET /path/<id>
  get(id, params, callback) {},
  // POST /path
  create(data, params, callback) {},
  // PUT /path/<id>
  update(id, data, params, callback) {},
  // PATCH /path/<id>
  patch(id, data, params, callback) {},
  // DELETE /path/<id>
  remove(id, params, callback) {}
}
```

이 인터페이스를 사용하면 해당 메소드의 실행을 "훅"하고 반환할 때 이벤트를 내보내는 것이 더욱 쉬워져 자연스럽게 리얼타임 기능을 제공할 수 있습니다.

## [훅](../../api/hooks.md)

[크로스 커팅 우려](https://en.wikipedia.org/wiki/Cross-cutting_concern)는 Aspect 지향 프로그래밍의 매우 큰 부분을 차지합니다. 대다수는 주로 공유 기능이 많은 CRUD 애플리케이션이므로 웹 및 모바일 애플리케이션에 매우 적합합니다. 유닉스 철학을 유지하며 하나의 작은 모듈이 크고 복잡한 모듈보다 좋다고 믿고 있습니다. 그래서 모듈성과 유연성을 유지하며 매우 복잡한 프로세스를 만들기 위해 "before"와 "after" 훅을 만들고 이를 서로 연결할 수 있도록 하였습니다.

## 거인의 어깨 위에 만들다

이미 검증된 일부 모듈을 사용하기 때문에 바퀴를 재발명하는데 소요되는 시간을 줄이고 믿기 힘들정도로 빠르게 작업할 수 있습니다. 모듈들은 작고 잘 테스트되었으며 안정적입니다.

Here's how we use some of the tech under the hood:
다음은 사용되는 기술의 목록입니다.

- Feathers는 [Express 4](http://expressjs.com)를 확장했습니다. [NodeJS](http://nodejs.org/)에서 가장 유명한 웹 프레임워크 입니다.
- CLI 도구는 [commander](https://www.npmjs.com/package/commander)와 [Yeoman](http://yeoman.io/)를 사용합니다.
- 웹 소켓 전송을 위해 [Socket.io](http://socket.io/) 또는 [Primus](https://github.com/primus/primus)를 사용할 수 있도록 래핑했습니다.
- Our service adapters typically wrap mature ORMs like [mongoose](http://mongoosejs.com/), [sequelize](http://docs.sequelizejs.com/) or [knex](http://knexjs.org/).
- 서비스 어댑터는 일반적으로 [mongoose](http://mongoosejs.com/), [sequelize](http://docs.sequelizejs.com/) 또는 [knex](http://knexjs.org/)와 같은 성숙한 ORM을 래핑하였습니다.
- 패키지 관리를 위해 [npm](http://npmjs.org)을 사용합니다..
- [feathers-authentication](https://github.com/feathersjs/feathers-authentication)은 대부분 [passport](http://passportjs.org/)를 처리합니다.
