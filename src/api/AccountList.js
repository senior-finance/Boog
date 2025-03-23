import axios from "axios";
import { BASE_URL } from "./config.js";

export const getAccountList = async (accessToken, userSeqNo) => {
  try {
    const response = await axios.get(`${BASE_URL}/v2.0/account/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        user_seq_no: userSeqNo,
        include_cancel: "N",
        sort_order: "D",
      },
    });

    return response.data.res_list; // 계좌 목록 반환
  } catch (error) {
    console.error("계좌 목록 조회 실패:", error);
    return null;
  }
};
