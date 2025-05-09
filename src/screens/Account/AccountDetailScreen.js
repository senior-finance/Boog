import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { deposit, withdraw, accountUpsert, accountGet, accountGetAll } from '../../database/mongoDB'

const AccountDetailScreen = ({ navigation, route }) => {

    const { userName, fintechUseNum, bankName, balance } = route.params;
    const [transactions, setTransactions] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        (async () => {
            const list = await accountGetAll(userName);
            // console.log(list);
            setTransactions(list);
            setLoading(false);
        })();
    }, [userName]);

    // 정렬된 배열 생성
    const sortedTransactions = [...transactions].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt);
    });

    return (
        <View style={{ flex: 1 }}>
            {/* 정렬 토글 버튼 */}
            <TouchableOpacity
                style={styles.sortButton}
                onPress={() =>
                    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
                }
            >
                <Text style={styles.sortButtonText}>
                    날짜 {sortOrder === 'asc' ? '오름차순 ↑' : '내림차순 ↓'}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={sortedTransactions}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>거래ID: {item._id}</Text>
                        <Text>계좌ID: {item.accountId}</Text>
                        <Text>은행명: {item.accountBank}</Text>
                        <Text>금액: {Number(item.amount).toLocaleString()}원</Text>
                        <Text>일시: {new Date(item.createdAt).toLocaleString()}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text>거래내역이 없습니다.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sortButton: {
        padding: 12,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    sortButtonText: {
        fontWeight: 'bold',
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
});

export default AccountDetailScreen;