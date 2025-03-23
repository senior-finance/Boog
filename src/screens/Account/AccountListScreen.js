import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getAccessToken } from "../../api/Auth.js";
import { getAccountList } from "../../api/AccountList.js";

const AccountListScreen = ({ route }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAccounts = async () => {
      const authCode = route.params?.authCode;
      if (!authCode) {
        console.error("인증 코드 없음");
        return;
      }

      const accessToken = await getAccessToken(authCode);
      if (accessToken) {
        const accountList = await getAccountList(accessToken, "TEMP_NUMBER_0x0x00");
        setAccounts(accountList || []);
      }
      setLoading(false);
    };

    fetchAccounts();
  }, [route.params?.authCode]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text>내 계좌 목록</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.fintech_use_num}
        renderItem={({ item }) => (
          <View>
            <Text>{item.bank_name} - {item.account_num_masked}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AccountListScreen;