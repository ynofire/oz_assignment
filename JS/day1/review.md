# HTML TAG review

- **기본적으로 대부분의 태그는 닫는 태그</>와 쌍으로 작성해야한다
- <p> : 문단 태그
- <br> : 줄바꿈 태그(닫을 필요 없음)
- <hr> : 가로줄
- <a href=""> : anchor heyer reference
- <img src="" width="" alt="">
    - src : link
    - width : 가로폭(세로폭은 맞춰서 자동 조절)
    - alt : 소스가 없을 시 대체 문자열
- list : 여러 데이터 출력, <li></li>로 순서 조절
    - ul : 순서대로 출력
    - ol : 앞쪽에 숫자, 알파벳 등의 기호로 순서대로 출력
- <table> : 장표!
    - <table border="1"> : 테이블 외곽선
    - <thead> : 제일 윗 줄
        - <tr> : table row(가로 한 줄)
        - <th> : 제일 윗줄에 들어갈 내용들
    - <tbody> : 테이블 바디
        - <td> : 테이블 내용에 들어갈 내용들
- <form action=""> : 어디에서 무엇을 할 것인지
    - <input type="" name=""> : 타이핑 박스 + 무엇을 할 것인지에 대한 query
    - <button> : 누를 수 있는 버튼(엔터 역할)
    - <form action="" method="post"> : 데이터를 create할 수 있는 방법
- id= : 식별자, 중복 X
- class= : 여러 태그 중복 O

# CSS review

1. CSS란?
- CSS는 HTML문서 내용을 이쁘게 꾸미기 위해 만들어진 script

2. Internal CSS, Inline CSS, External CSS 각각의 방식에 대해서 정리
- Internal은 head쪽에서 스타일링을,
- Inline은 태그 내에서 style=""을 통해서 스타일링을(우선순위 높음!)
- External은 별도의 .css파일을 통해서 스타일링을 진행(html head 내에서 link 필요)

3. CSS Selector(선택자)
- 선택자는 Internal이나 External CSS를 작성할 경우 대상이 누구인지 정하는 것
    - * : 모두!
    - .class
    - #id
    - tag : 일반 태그들

4. style 속성
- text 관련
    - font-family : 어떤 계열의 폰트
    - font-size : 크기
    - font-weight : 볼드체 할거임?
    - text-align : 정렬 기준
    - text-color : 색깔
- box model(margin, padding, border, content, width, height, box-sizing)
    - margin : 테두리 바깥 여백, 크기만 줄 수 있음
    - border : 테두리 속성, solid 등으로 어떤식으로 그릴 건지, 두께, 색깔 등 지정 가능
    - padding : 테두리와 content 사이의 여백, 크기만 줄 수 있음
    - content : 실제 내용
    - width, height, box-sizing : 크기와 높이, 사이즈 조절
    - background-color : 박스 배경색
    - 박스끼리 겹쳐서 시각 효과를 줄 수 있음
- grid : 박스들을 요리 저리 예쁘게 배열할 수 있게끔

# Bootstrap
- 내가 만들지 말고 다른 사람이 만든걸 띠어와서 이쁘게 써보자!
- 제대로 쓰려면 

# JS review
- 기본적으로 브라우저 위에서 굴러가게 만들어진 언어
- 일단 해봐야 알겠지.
- node.js는 설치 완료