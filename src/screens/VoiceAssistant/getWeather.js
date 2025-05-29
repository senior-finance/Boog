import { WEATHER_API_KEY } from '@env';

const gridMap = {
  "서울": { nx: 60, ny: 127 }, "부산": { nx: 98, ny: 76 }, "대구": { nx: 89, ny: 90 },
  "인천": { nx: 55, ny: 124 }, "광주": { nx: 58, ny: 74 }, "대전": { nx: 67, ny: 100 },
  "울산": { nx: 102, ny: 84 }, "세종": { nx: 66, ny: 103 }, "제주": { nx: 52, ny: 38 },
  "수원": { nx: 60, ny: 121 }, "청주": { nx: 69, ny: 106 }, "전주": { nx: 63, ny: 89 },
  "포항": { nx: 102, ny: 94 }, "창원": { nx: 91, ny: 77 }, "천안": { nx: 66, ny: 103 },
  "안산": { nx: 57, ny: 123 }, "안양": { nx: 59, ny: 123 }, "남양주": { nx: 64, ny: 128 },
  "화성": { nx: 57, ny: 119 }, "김해": { nx: 96, ny: 74 }, "평택": { nx: 62, ny: 114 },
  "춘천": { nx: 73, ny: 134 }, "원주": { nx: 76, ny: 122 }, "강릉": { nx: 92, ny: 131 },
  "속초": { nx: 87, ny: 142 }, "여수": { nx: 73, ny: 66 }, "목포": { nx: 50, ny: 67 },
  "군산": { nx: 63, ny: 90 }, "강화": { nx: 51, ny: 130 }, "양산": { nx: 96, ny: 83 },
  "진주": { nx: 80, ny: 75 }, "경주": { nx: 100, ny: 91 }, "구미": { nx: 84, ny: 96 },
  "전남": { nx: 51, ny: 67 }, "전북": { nx: 63, ny: 89 }, "경남": { nx: 91, ny: 77 },
  "경북": { nx: 89, ny: 91 }, "충남": { nx: 68, ny: 100 }, "충북": { nx: 69, ny: 106 },
  "강원": { nx: 73, ny: 134 }, "경기": { nx: 60, ny: 120 }, "고양": { nx: 56, ny: 129 },
  "용인": { nx: 63, ny: 118 }, "성남": { nx: 62, ny: 126 }
};

async function findLatestWeather(grid) {
  const now = new Date();
  const timeTable = [23, 20, 17, 14, 11, 8, 5, 2];

  for (let i = 0; i < 2; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const base_date = date.toISOString().slice(0, 10).replace(/-/g, '');

    for (const hour of timeTable) {
      const base_time = String(hour).padStart(2, '0') + '00';
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${WEATHER_API_KEY}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${grid.nx}&ny=${grid.ny}`;

      console.log(`🌐 시도 중: ${base_date} ${base_time} → URL: ${url}`);

      try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text);
        const items = json.response?.body?.items?.item;

        if (items && items.length > 0) {
          console.log('✅ 유효한 날씨 데이터 발견:', base_date, base_time);
          return { items, base_date, base_time };
        }
      } catch (e) {
        console.log('⚠️ 요청 실패:', base_date, base_time);
      }
    }
  }

  return { error: '가장 최근의 날씨 데이터를 찾을 수 없습니다.' };
}

export async function getWeather(city) {
  try {
    const grid = gridMap[city];
    if (!grid) return { error: `"${city}"는 지원하지 않는 도시입니다.` };

    const { items, error } = await findLatestWeather(grid);
    if (error) return { error };

    const getValue = (category) =>
      items.find((item) => item.category === category)?.obsrValue;

    const condition = getValue('PTY') === '0' ? '맑음' : '비/눈';
    const temp = getValue('T1H') ?? '-';
    const humidity = getValue('REH') ?? '-';

    return {
      location: city,
      condition,
      temp,
      humidity,
    };
  } catch (err) {
    console.log('❌ 날씨 조회 중 오류 발생:', err);
    return { error: '날씨 정보를 불러오지 못했습니다.' };
  }
}