# 인증 추가

이제 제너레이터로 로컬 인증을 추가해 볼 것 입니다.

```
feathers generate authentication
```

![Generate authentication](../assets/gen-authentication.jpg)

제너레이터는 새 모듈을 추가하고 기존에 있던 파일들을 수정합니다.

변경된 부분:
[Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-side.html)


## 새 모듈

디렉토리가 변경되었을 것 입니다.

![Compare app and authentication folders](../assets/gen1-2-dir.jpg)

## 사용자 서비스

제너레이터는 `users` 서비스를 앱에 추가합니다.
로컬 인증을 위해 사용자 데이터베이스가 필요합니다.

위 작업을 통해 아래 모듈이 추가되었습니다.

- [src/models/users.model.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/src/models/users.model.js)
어떻게 `users`가 인덱싱 되는지 보여줍니다.
`NeDB` 는  설정이 쉬운 [NoSQL](https://en.wikipedia.org/wiki/NoSQL)입니다.

- **src/services/users** 는 `users` 서비스를 포함합니다.

    - [users.service.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/src/services/users/users.service.js)는 서비스 설정을 포함합니다.

    - [users.hooks.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/src/services/users/users.hooks.js) 서비스를 위한 훅 설정을 포함합니다.
    `authenticate('jwt')` 훅을 사용하면 인증된 사용자만 메소드 호출을 할 수 있습니다.
    `hashPassword()` 훅을 사용하면 새 사용자가 추가될 때 패스워드를 암호화합니다.

    - [users.filters.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/src/services/users/users.filters.js) 사용자가 변경되었을 때 어떤 클라이언트에 알릴지 제어할 수 있습니다.

- [test/services/users.test.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/test/services/users.test.js) 서비스 설정을 테스트합니다.

서비스는 앱에 연결되었으므로 제너레이터는 다음과 같이 앱을 변경했습니다.

- **config/default.json** 는 이제
([Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-default-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-default-side.html))
NeDB 테이블의 경로를 확인하세요.

- **src/services/index.js** 는 이제
([Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-service-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-service-side.html))
`users` 서비스 설정을 가집니다.


## 인증 서비스

제너레이터는 또한 앱에 `authentication` 서비스를 추가합니다.
`users` 서비스에 대해 클라이언트를 인증하고, JWT 토큰을 생성하며 검증하는 책임이 있습니다.

`authentication` 서비스는 데이터베이스 서비스가 아닌 **사용자 정의 서비스** 입니다.
모델과 데이터베이스 테이블이 없으며 메소드 중 하나가 호출될 때 실행할 훅도 없습니다.

- 따라서 `users`에 관하여 조작된 것 처럼 폴더를 만드는 대신 제너레이터는 `authentication` 모듈만 [src/authentication.js](https://github.com/feathersjs/feathers-docs/blob/master/examples/step/02/gen2/src/authentication.js)로 만듭니다.

서비스는 앱에 연결되었으므로 제너레이터는 다음과 같이 앱을 변경했습니다.

- **src/config/default.json** 는 이제
([Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-default-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-default-side.html))
인증 정보를 포함합니다.

- **src/app.js** 는 이제
([Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-app-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-app-side.html))
`authentication` 서비스 설정을 가집니다.

## 변경 사항

애플리케이션의 변경사항으로 새로운 의존성 추가가 있습니다.

- **package.json** 는 이제
([Unified](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-package-line.html)
|
[Split](http://htmlpreview.github.io/?https://github.com/feathersjs/feathers-docs/blob/master/examples/step/_diff/02-gen2-package-side.html))
의존성이 추가되었습니다.

## 이제 무엇을 해야하나요?

이전에 Feathers 인증을 다루지 않았습니다.
인증 서비스는 새롭게 다가올 수 있습니다.
인증에 관하여 [API](../../../api/authentication/server.md)와 [가이드](../../auth/readme.html)를 확인하세요

`users` 서비스는 로컬 인증에 필요한 서비스가 되었습니다.
생성된 코드는 이전에 다룬 것과 유사하여 놀랄만한 것은 없습니다.

다음은 [새 서비스 만들기](./gen-service.md)입니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Generators-Auth&body=Comment:Step-Generators-Auth)
