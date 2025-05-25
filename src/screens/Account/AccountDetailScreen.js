import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Calendar } from 'react-native-calendars';
import { accountGetAll } from '../../database/mongoDB';

const AccountDetailScreen = ({ route }) => {
  const { userName } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sortBy, setSortBy] = useState('amount'); // 'amount' or 'date'
  const [amountOrder, setAmountOrder] = useState('desc');
  const [dateOrder, setDateOrder] = useState('desc');

  useEffect(() => {
    (async () => {
      const list = await accountGetAll(userName);
      setTransactions(list);
      setLoading(false);
    })();
  }, [userName]);

  // 거래 건수 집계
  const dayCounts = useMemo(() => {
    const counts = {};
    transactions.forEach(({ createdAt }) => {
      const date = createdAt.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [transactions]);

  // 정렬 함수
  const sortFn = useMemo(() => {
    if (sortBy === 'amount') {
      return (a, b) => amountOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return (a, b) => {
        const da = new Date(a.createdAt);
        const db = new Date(b.createdAt);
        return dateOrder === 'asc' ? da - db : db - da;
      };
    }
  }, [sortBy, amountOrder, dateOrder]);

  // 그룹핑: 오늘, 어제, 1주, 1개월, 오래전
  const groups = useMemo(() => {
    const todayList = [];
    const yesterdayList = [];
    const weekList = [];
    const monthList = [];
    const olderList = [];
    const now = Date.now();

    transactions.forEach(item => {
      const d = new Date(item.createdAt);
      const diffDays = (now - d.getTime()) / (1000 * 60 * 60 * 24);
      if (d.toDateString() === new Date().toDateString())
        todayList.push(item);
      else if (d.toDateString() === new Date(now - 86400000).toDateString())
        yesterdayList.push(item);
      else if (diffDays <= 7)
        weekList.push(item);
      else if (diffDays <= 30)
        monthList.push(item);
      else
        olderList.push(item);
    });

    return {
      today: todayList.sort(sortFn),
      yesterday: yesterdayList.sort(sortFn),
      week: weekList.sort(sortFn),
      month: monthList.sort(sortFn),
      older: olderList.sort(sortFn),
    };
  }, [transactions, sortFn]);

  // 선택 날짜 리스트
  const selectedKey = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';
  const selectedList = useMemo(() => {
    return selectedDate
      ? transactions
          .filter(item => item.createdAt.slice(0, 10) === selectedKey)
          .sort(sortFn)
      : [];
  }, [transactions, selectedKey, sortFn, selectedDate]);

  if (loading) return (
    <View style={styles.center}>
      <LottieView source={require('../../assets/animeLoading.json')} autoPlay loop style={styles.loader} />
    </View>
  );

  // Arrow symbols based on independent state
  const amountArrow = amountOrder === 'asc' ? '작은 순서로' : '큰 순서로';
  const dateArrow = dateOrder === 'asc' ? '최근 순서로' : '오래된 순서로';

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.container}>
      {/* 상단 토글 및 정렬 버튼 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.toggleButton, (selectedDate || showCalendar) && styles.toggleButtonActive]}
          onPress={() => {
            if (selectedDate || showCalendar) {
              setSelectedDate(null);
              setShowCalendar(false);
            } else setShowCalendar(true);
          }}
        >
          <Text style={[styles.toggleText, (selectedDate || showCalendar) && styles.toggleTextActive]}>
            {(selectedDate || showCalendar) ? '원래대로' : '기간 선택'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'amount' && styles.toggleButtonActive]}
          onPress={() => {
            setSortBy('amount');
            setAmountOrder(prev => prev === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.toggleText, sortBy === 'amount' && styles.toggleTextActive]}>금액 {amountArrow}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'date' && styles.toggleButtonActive]}
          onPress={() => {
            setSortBy('date');
            setDateOrder(prev => prev === 'asc' ? 'desc' : 'asc');
          }}
        >
          <Text style={[styles.toggleText, sortBy === 'date' && styles.toggleTextActive]}>날짜 {dateArrow}</Text>
        </TouchableOpacity>
      </View>

      {/* 달력: 일별 거래건수 */}
      {showCalendar && (
        <Calendar
          markingType="custom"
          markedDates={{
            ...Object.fromEntries(
              Object.entries(dayCounts).map(([d]) => [d, { customStyles: {} }])
            ),
            ...(selectedDate && { [selectedKey]: { selected: true, selectedColor: '#3498db' } })
          }}
          dayComponent={({ date, state }) => {
            const count = dayCounts[date.dateString] || 0;
            return (
              <TouchableOpacity
                style={styles.dayContainer}
                onPress={() => { setSelectedDate(new Date(date.dateString)); setShowCalendar(false); }}
              >
                <Text style={{ color: state === 'disabled' ? '#b2bec3' : '#2d3436' }}>{date.day}</Text>
                {count > 0 && <Text style={styles.dayCount}>{`${count}건`}</Text>}
              </TouchableOpacity>
            );
          }}
          onDayPress={() => {}}
          theme={calendarTheme}
          style={styles.calendar}
        />
      )}

      {/* 기본 그룹 뷰 */}
      {!selectedDate && !showCalendar && (
        <>          
          <Section title="오늘" data={groups.today} />
          <Section title="어제" data={groups.yesterday} />
          <Section title="최근 일주일" data={groups.week} />
          <Section title="최근 한달" data={groups.month} />
          <Section title="오래전" data={groups.older} />
        </>
      )}

      {/* 선택 날짜 뷰 */}
      {selectedDate && (
        <>  
          <Text style={styles.summaryText}>{selectedDate.toLocaleDateString()} 총 {dayCounts[selectedKey] || 0}건</Text>
          {selectedList.map(item => <TransactionCard key={item._id} item={item} />)}
        </>
      )}
    </ScrollView>
  );
};

const TransactionCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardBank}>{item.accountBank}</Text>
    <Text style={styles.cardAmount}>{Number(item.amount).toLocaleString()}원</Text>
    <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString()}</Text>
  </View>
);

const Section = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.length > 0 ? data.map(item => <TransactionCard key={item._id} item={item} />)
      : <Text style={styles.emptyText}>아직 없어요</Text>}
  </View>
);

const calendarTheme = {
  backgroundColor: '#f0f4f8',
  calendarBackground: '#fff',
  selectedDayBackgroundColor: '#3498db',
  todayTextColor: '#e74c3c',
  dayTextColor: '#2d3436',
  textDisabledColor: '#b2bec3',
  monthTextColor: '#0984e3',
  arrowColor: '#0984e3',
};

const styles = StyleSheet.create({
  background: { backgroundColor: '#f0f4f8' },
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loader: { width: 200, height: 200 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  toggleButton: { flex: 1, padding: 10, marginHorizontal: 4, backgroundColor: '#dfe6e9', borderRadius: 6, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#0984e3' },
  toggleText: { color: '#2d3436', fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  calendar: { borderRadius: 8, elevation: 2, marginBottom: 12 },
  dayContainer: { alignItems: 'center', padding: 4 },
  dayCount: { fontSize: 10, color: '#0984e3' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0984e3', marginBottom: 8 },
  emptyText: { fontStyle: 'italic', color: '#636e72' },
  summaryText: { textAlign: 'center', marginBottom: 16, fontSize: 16, color: '#2d3436', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, elevation: 2 },
  cardBank: { fontSize: 14, color: '#0984e3', marginBottom: 4 },
  cardAmount: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  cardDate: { fontSize: 12, color: '#636e72', marginTop: 4 },
});

export default AccountDetailScreen;