
export async function checkSpamForNumber(number) {
    // 후후 사이트의 검색 URL 형식에 맞게 전화번호를 쿼리 스트링에 추가합니다.
    const url = `https://whowho.co.kr/number-search/?tel=${number}`;
    try {
      // fetch를 이용해 HTML 전체를 가져옵니다.
      const response = await fetch(url);
      const html = await response.text();
  
      // HTML 내에 스팸(혹은 의심) 여부를 판단할 수 있는 키워드를 찾습니다.
      // 예를 들어, 응답에 "스팸"이나 "의심"이라는 단어가 있다면 스팸으로 간주한다고 가정합니다.
      if (html.includes("스팸") || html.includes("의심")) {
        return true;
      }
      return false;
    } catch (error) {
      //console.warn("번호 스팸 체크 중 오류 발생:", error);
      return false;
    }
  }
  