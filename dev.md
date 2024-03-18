# 개발 과정

## 목차

1. [Shorts HTML 구조 파악](#1-shorts-html-구조-파악)

## 1. Shorts HTML 구조 파악

![image](https://gist.github.com/assets/62174395/8a20bdde-b5e7-4cff-a8b1-f837ad3f013f)

처음 쇼츠를 재생하면, `#shorts-container` > `shorts-inner-container`의 자식 태그로 `ytd-reel-video-renderer` 10개가 생성된다. 이것이 바로 쇼츠들 목록이고, 9번째 쇼츠에 접근하면 추가로 10개의 자식 태그가 삽입되는 형태이다.

![image](https://gist.github.com/assets/62174395/a70dd24a-9fa6-4e0a-983f-7b83847b67ae)

`ytd-reel-video-renderer` 태그 안에는 쇼츠 제목과 링크된 영상 제목 등의 정보가 포함된다. 각 태그를 자세히 보면 다음과 같다.

- 제목: `<h2 class="title style-scope reel-player-header-renderer"></h2>`

![image](https://gist.github.com/assets/62174395/edeb916d-3326-443a-bea7-7b9990e1da5e)

- 링크된 영상 제목: `<div id="reel-multi-format-link-view-model" class="style-scope reel-player-header-renderer"></div>`

![image](https://gist.github.com/assets/62174395/24178def-6702-4fee-a7fd-4703df11522f)

이를 토대로 크롬 개발자 도구를 통해 실제 쇼츠 제목과 링크된 영상 제목에 접근해보자.

![image](https://gist.github.com/assets/62174395/0f50ec52-ab50-47ba-afc1-737d5c313bdb)

overlays라는 배열에 각 쇼츠들의 종합 정보를 담고, 1번 인덱스의 쇼츠 제목과 링크된 영상 제목을 알아내는 데 성공했다. 이 디버깅을 잘 기억하고, 자바스크립트 코드를 작성하면 되겠다.
