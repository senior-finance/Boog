import axios from "axios";
import { KFTC_CLIENT_ID, KFTC_CLIENT_SECRET, REDIRECT_URI, BASE_URL } from "../../.env";

export const getAccessToken = async (authCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/oauth/2.0/token`, {
      client_id: KFTC_CLIENT_ID,
      client_secret: KFTC_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: authCode,
      grant_type: "authorization_code",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("토큰 요청 실패:", error);
    return null;
  }
};
