# 단계별로 익히는 Feathers 기초

Feathers는 모던 애플리케이션 개발을 위한 오픈소스 REST, 리얼타임 API 레이어입니다.

__*[FeathersJS]의 주된 특징은 초경량입니다.
간단하고 논리적인 워크플로우로 몇 시간이 걸리는 API개발을 간소화하여 몇분만에 빌드할 수 있는 API를 만들 수 있습니다.
마법과 컨트롤이 완벽하게 조화를 이루며 API가 어떻게 작동하는지 완벽하게 제어할 수 있어 훨씬 쉬워집니다.*__

[Medium - "FeathersJS — A framework that will spoil you"](https://medium.com/@codingfriend/feathersjs-a-framework-that-will-spoil-you-109525dfd35e#.8kf707x3k)

> 주의: Feathers는 중독성이 있습니다.

## 서비스

[Services](../../api/services.md)는 모든 클라이언트와 상호작용하기 때문에 핵심입니다.
서비스는 중개자이며 모든 종류의 작업을 처리하는데 사용할 수 있습니다.
- 데이터베이스와의 상호작용
- 마이크로서비스/API와의 상호작용
- 파일시스템과의 상호작용
- 다른 리소스와의 상호작용
    - 이메일 전송,
    - 결제 처리,
    - 위치에 기반한 날씨 반환 등

## 훅

[Hooks](../../api/hooks.md)은 서비스가 호출되기 전이나 후에 자동으로 실행되는 함수입니다.
서비스의 게이트키퍼가 될 수 있으며 모든 작업을 허용하거나 필수 정보를 요구할 수 있습니다.
또한 클라이언트에 반환해야하는 데이터만 반환하도록 할 수 있습니다.
- before hooks: 유효성 검사/정리/권한 확인에 사용
- after hooks: 클라이언트에 전달하기 전 필요한 데이터 추가 또는 불필요한 데이터 제거

## 이벤트

서비스가 완료되면 [Events](../../api/events.md)는 클라이언트(또는 feathers-sync 패키지가 사용되는 경우 다른 서버)로 전송됩니다.
`created`, `updated`, `patched`, 그리고 `removed`를 실시간으로 전달할 수 있습니다.

[이벤트 필터링](../../api/events.md#event-filtering)은 어떤 사용자가 어떤 이벤트를 받아야할지 결정합니다.
Socket.io의 방(room)의 대체입니다.
이는 반응형 애플리케이션을 확장할 수 있는 지능적인 접근 방식입니다.

## 인증

Feathers는
[local](../../api/authentication/local.md),
[JSON Web Token](../../api/authentication/jwt.md),
[OAuth1](../../api/authentication/oauth1.md)
그리고 [OAuth2](../../api/authentication/oauth2.md) 인증
([PassportJS](https://github.com/jaredhanson/passport)를 사용)
을 넘어 [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
와 [WebSockets](https://en.wikipedia.org/wiki/websocket)을 제공합니다.

## 프로바이더

애플리케이션에서 사용할 프로바이더를 선택하세요
- [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [Socket.io](https://socket.io/)
- [Primus](https://github.com/primus/primus)
([engine.io](https://github.com/socketio/engine.io) 지원,
[uWebSockets a.k.a. uws](https://github.com/uWebSockets/uWebSockets),
[SockJS](https://github.com/sockjs/sockjs-node),
[Faye](https://faye.jcoglan.com/))

## 미들웨어

[Express middleware](https://expressjs.com/en/guide/using-middleware.html)는 꼭 필요한 것은 아니지만 최적화/로깅에 좋을 수 있습니다.
- before service methods: 압축, CORS 등
- after service methods: 로그, 에러핸들러 등

## 이 가이드의 목적

이 가이드가 다루는 범위는
- 데이터베이스와 함께 사용하는 서비스
- 훅.
- 이벤트.
- 프로바이더.

Feathers에 대한 사전 지식은 요구하지 않습니다.

이 가이드를 다 읽을 때 즈음이면
- Feathers 기초에 관한 견고한 이해를 얻습니다.
- 데이터베이스에 관계없이 사용할 수 있는 방법을 이해합니다.
- Feathers 서버가 HTTP REST API, Feathers REST 클라이언트 및 Feathers WebSocket 클라이언트를 동시에 투명하게 지원하는지 이해합니다.
- 클라이언트에서 데이터베이스에 클라이언트 코드가 서버에서 실행중인 것 처럼 엑세스할 수 있음을 이해합니다.
- Feathers 제너레이터가 애플리케이션을 구조화하고 작성한 보일러플레이트를 이해할 수 있게 됩니다.

이 가이드를 마치면 첫번째 앱을 작성할 준비가 끝납니다.
