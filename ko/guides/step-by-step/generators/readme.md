# 제너레이터

We've been writing code "by hand" in order to understand how basic Feathers works.
We will now start using Feathers generators since we have the background to understand what they produce.

## 제너레이터로 보일러플레이트를 없앨 수 있습니다

We've seen that Feathers, even when coded "by hand",
eliminates the majority of the boilerplate typically in a CRUD project.
Generators will eliminate even more.

> **Generators.**
Feathers generators produce very little code because Feathers is so succinct.
You can easily understand the generated code because its no different from what we've been
coding "by hand" so far.
Some other frameworks make things “seem” easy by generating thousands of lines of code for you
and, in the process, making it almost impossible to implement anything not supported out of the box
by their generators.

### 제너레이터 앱 구조

The generated modules are structured as recommended by the Feathers team.

### 제너레이터로 데이터베이스 조작하기

The generators will generate code for different databases
so you don't have to investigate how to do so.

## 제너레이터 설치

You can install the Feathers generators with

`npm install -g feathers-cli`

## 이제 무엇을 해야하나요?

Now that we installed the Feathers command line tool we can [generate the application](./gen-app.md).

### 잘못되거나 불분명하거나 누락된 부분이 있습니까?
[댓글을 남겨주세요.](https://github.com/feathersjs/feathers-docs/issues/new?title=Comment:Step-Generators-Readme&body=Comment:Step-Generators-Readme)
