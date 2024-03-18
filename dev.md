# 개발 과정

## 목차

1. [Shorts HTML 구조 파악](#1-shorts-html-구조-파악)
2. [popup 생성](#2-popup-생성)

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

## 2. popup 생성

| 초기화면                                                                               | 키워드 등록                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ![image](https://gist.github.com/assets/62174395/38d854e3-9312-469e-9e85-589214c04ab7) | ![image](https://gist.github.com/assets/62174395/ac42a9d0-6eb9-4c71-ac61-00ad99d0c97c) |

확장 프로그램 작업(툴바 아이콘)을 클릭하면 왼쪽 초기화면, 즉 팝업이 생성되고 키워드를 입력 후 `Register` 버튼을 클릭하면 하단 키워드 리스트에 추가된다.

아직 크롬 API와 연결되진 않았기 때문에 팝업을 닫았다가 다시 열면 기존 데이터는 모두 사라지며, 쇼츠에서 필터링되지도 않는다.
