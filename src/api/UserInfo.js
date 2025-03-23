import axios from "axios";
import { BASE_URL } from "./config.js"; // config 에서 BASE_URL을 가져옴

export const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/v2.0/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // 사용자 정보 반환
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
};
