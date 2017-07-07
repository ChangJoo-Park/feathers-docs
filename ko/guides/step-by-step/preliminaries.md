# 예제 설치

이 가이드에 사용한 예제의 코드를 설치하면 해당 예제를 실행할 수 있습니다.

필수적이지는 않지만 가이드를 먼저 읽는 것이 좋습니다. 
나중에 사용할 때 예제를 설치할 수 있습니다.

## Node 설치

[Node](https://nodejs.org/en/) JavaScript 기반 서버 플랫폼 입니다.
가볍고 효율적입니다.
오픈소스 라이브러리 중 가장 큰 생태계를 가지고 있습니다.

- [기본 설치.](https://nodejs.org/en/)
- [특정 버전 설치.](https://nodejs.org/en/download/)

## git 설치

[git](https://git-scm.com/)은 오픈소스에서 가장 자주 사용하는 버전 관리 시스템입니다.
설치하는 방법을 다루는 많은 자료가 있습니다.

- [Linux.](https://www.atlassian.com/git/tutorials/install-git#linux)
- [macOS.](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)
- [Windows.](https://www.atlassian.com/git/tutorials/install-git#windows)

## 예제 설치

터미널에서
```text
cd the/folder/above/which/you/want/the/guide/to/reside
git clone https://github.com/feathersjs/feathers-docs
```

> **다른 방법으로 설치하기.** git이 아직 설치되지 않은 상태이면
저장소를 zip파일로 내려받을 수 있습니다.
브라우저에서 
`https://github.com/feathersjs/feathers-docs/archive/master.zip`
위 주소로 접속하면 내려받습니다.

## 예제에서 사용하는 의존성 설치

```text
cd path/to/feathers-docs/examples/step/01
npm install
```

그러면 기본 예제에서 사용하는 의존성을 `/examples/step/01/node_modules` 위치에 설치합니다.


## 가이드에 사용된 예제를 다시 작성하기

각 가이드는 섹션으로 나뉘며, 섹션은 `examples/`에 있는 작동하는 예제로 뒷받침 됩니다.
가이드의 코드 샘플은 예제의 추출물입니다.
코드 조각은 모호하거나 오해의 소지가 있거나 혼돈을 줄 수 있습니다.
작업 예제는 이러한 문제를 줄일 뿐 아니라 직접 수정하여 더 많은 것을 배울 수 있습니다.

한 예제는 다음 예제에서 계속 사용될 수 있습니다.
이 경우 변경사항을 이해하는데 도움이 되도록 두 예제간 차이점을 요약하여 보여줍니다.

가이드는 각 예제가 작성된 방법을 자세히 설명합니다.
배우는데 도움이 되면 스스로 프로세스를 재현할 수 있습니다.
`examples/`아래의 서브 폴더로 `copy-an-introduction` 이름의 폴더를 만들 수 있습니다.
가이드에 언급한 것과 같은 명령을 실행할 수 있습니다. 그리고 (아마도!) 같은 결과를 얻을 것 입니다.

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Readme&body=Comment:Readme)
