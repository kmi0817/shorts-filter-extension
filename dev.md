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

## 3. 기본 manifest.json 작성

```json
{
	"manifest_version": 3,
	"name": "Shorts Filter",
	"version": "1.0.0",
	"description": "You can pass shorts that include keywords you registered automatically",
	"icons": {
		"16": "assets/icon_16.png",
		"32": "assets/icon_32.png",
		"48": "assets/icon_48.png",
		"128": "assets/icon_128.png"
	},
	"action": {
		"default_icon": "assets/icon_32.png",
		"default_title": "Shorts Filter",
		"default_popup": "popup.html"
	}
}
```

"actions" > "default_title"을 설정하지 않으면, 확장 프로그램을 클릭했을 때 익스텐션의 이름이 연한 회색으로 `name`에 작성된 글자가 나온다.

## 4. popup에서 입력한 키워드를 contentScript에 전달

> contentScript는 현재 크롬 탭의 DOM에 접근할 수 있다. 따라서 현재 화면의 HTML 구조를 파악하고 querySelector()로 가져오는 등의 작업을 하려면 contentScript가 필요하다.

### manifest.json에 permissions와 host_permissions, content_scripts와 추가

```json
{
	"permissions": ["activeTab", "tabs", "storage"],
	"host_permissions": ["https://*.youtube.com/shorts/*"],
	"content_scripts": [
		{
			"matches": ["https://*.youtube.com/shorts/*"],
			"js": ["javascript/contentScript.js"]
		}
	]
}
```

- `activeTab`: 현재 active한 탭 정보를 알아내기 위해 필요한 권한
- `tabs`: 크롬 창에 띄워진 모든 탭 정보를 알아내기 위한 권한 (아마도)
- `storage`: 데이터를 저장하기 위한, 구글이 제공하는 스토리지 사용 권한
- `host_permissions`: permissions를 요청하는 호스트
- `content_scripts`: 패턴과 일치하는 탭에서 등록한 자바스크립트 파일 실행

### 간단한 테스트

```javascript
// popup.js : 다른 코드들은 생략
const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};
const currentTab = await getCurrentTab();
const currentURL = currentTab.url;
chrome.tabs.sendMessage(currentTab.id, {
	type: 'register',
	keyword,
});

// contentScript.js
chrome.runtime.onMessage.addListener(async (message) => {
	alert(JSON.stringify(message));
});
```

popup에서 키워드 `example`을 입력하면, contentScript에 전달되고 이곳에서 chrome.storage.sync에 키워드를 저장할 계획이다.

본격적으로 개발하기 전에, 일단 popup에서 입력한 내용을 contentScript에서 받아서 alert()로 출력하는 간단한 코드를 작성했다. 처음 개발하는 크롬 확장 프로그램이기 때문에 한 단계씩 진행하기 위함이다.

![image](https://gist.github.com/assets/62174395/28ea470b-1057-4c8f-97cf-29f750a71e09)

실행 결과는 성공적! 이제 제대로 개발해보자.
