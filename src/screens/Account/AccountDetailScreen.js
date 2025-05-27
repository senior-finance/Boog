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
  const [sortBy, setSortBy] = useState(null); // 'amount' | 'date' | null
  const [amountOrder, setAmountOrder] = useState('none');
  const [dateOrder, setDateOrder] = useState('none');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'deposit' | 'withdraw'
  const cycleFilter = prev =>
    prev === 'all' ? 'deposit' :
      prev === 'deposit' ? 'withdraw' :
        'all';

  // 3단계 순환 함수
  const cycleOrder = (prev) => {
    if (prev === 'none') return 'desc';
    if (prev === 'desc') return 'asc';
    return 'none';
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      filterType === 'all' || tx.type === filterType
    );
  }, [transactions, filterType]);

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
    filteredTransactions.forEach(({ createdAt }) => {
      const date = createdAt.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [filteredTransactions]);

  // 업데이트: sortBy가 null이면 변경 전 순서 유지
  const sortFn = useMemo(() => {
    if (sortBy === 'amount') {
      if (amountOrder === 'none') return () => 0;
      return amountOrder === 'asc'
        ? (a, b) => a.amount - b.amount
        : (a, b) => b.amount - a.amount;
    }
    if (sortBy === 'date') {
      if (dateOrder === 'none') return () => 0;
      return dateOrder === 'asc'
        ? (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        : (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    }
    return () => 0;
  }, [sortBy, amountOrder, dateOrder]);

  // 그룹핑: 오늘, 어제, 1주, 1개월, 오래전
  const groups = useMemo(() => {
    const todayList = [];
    const yesterdayList = [];
    const weekList = [];
    const monthList = [];
    const olderList = [];
    const now = Date.now();

    filteredTransactions.forEach(item => {
      const d = new Date(item.createdAt);
      const diffDays = (now - d.getTime()) / (1000 * 60 * 60 * 24);

      if (d.toDateString() === new Date().toDateString()) {
        todayList.push(item);
      } else if (d.toDateString() === new Date(now - 86400000).toDateString()) {
        yesterdayList.push(item);
      } else if (diffDays <= 7) {
        weekList.push(item);
      } else if (diffDays <= 30) {
        monthList.push(item);
      } else {
        olderList.push(item);
      }
    });

    return {
      today: todayList.sort(sortFn),
      yesterday: yesterdayList.sort(sortFn),
      week: weekList.sort(sortFn),
      month: monthList.sort(sortFn),
      older: olderList.sort(sortFn),
    };
  }, [filteredTransactions, sortFn]);

  // 선택 날짜 리스트
  const selectedKey = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';
  const selectedList = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().slice(0, 10);
    return filteredTransactions
      .filter(item => item.createdAt.slice(0, 10) === key)
      .sort(sortFn);
  }, [filteredTransactions, selectedDate, sortFn]);

  if (loading) return (
    <View style={styles.center}>
      <LottieView source={require('../../assets/animeLoading.json')} autoPlay loop style={styles.loader} />
    </View>
  );

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.container}>
      {/* 상단 토글 및 정렬 버튼 */}
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
      <View style={styles.buttonRow}>

        {/* 버튼 onPress 변경 (금액) */}
        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'amount' && styles.toggleButtonActive]}
          onPress={() => {
            const next = cycleOrder(amountOrder);
            setAmountOrder(next);
            setSortBy(next === 'none' ? null : 'amount');
          }}
        >
          <Text style={[styles.toggleText, sortBy === 'amount' && styles.toggleTextActive]}>
            금액 {
              amountOrder === 'none'
                ? '원래대로'
                : amountOrder === 'desc'
                  ? '큰'
                  : '작은'
            }
          </Text>
        </TouchableOpacity>

        {/* 버튼 onPress 변경 (날짜) */}
        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'date' && styles.toggleButtonActive]}
          onPress={() => {
            const next = cycleOrder(dateOrder);
            setDateOrder(next);
            setSortBy(next === 'none' ? null : 'date');
          }}
        >
          <Text style={[styles.toggleText, sortBy === 'date' && styles.toggleTextActive]}>
            날짜 {
              dateOrder === 'none'
                ? '원래대로'
                : dateOrder === 'desc'
                  ? '최근 순서'
                  : '오래된 순서'
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, filterType !== 'all' && styles.toggleButtonActive]}
          onPress={() => setFilterType(cycleFilter(filterType))}
        >
          <Text style={[styles.toggleText, filterType !== 'all' && styles.toggleTextActive]}>
            {filterType === 'all'
              ? '입출금 모두'
              : filterType === 'deposit'
                ? '입금만'
                : '출금만'
            }
          </Text>
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
          onDayPress={() => { }}
          theme={calendarTheme}
          style={styles.calendar}
        />
      )}

      {/* 기본 그룹 뷰 */}
      {!selectedDate && !showCalendar && amountOrder === 'none' && dateOrder === 'none' && (
        <>
          <Section title="오늘" data={groups.today} />
          <Section title="어제" data={groups.yesterday} />
          <Section title="최근 일주일" data={groups.week} />
          <Section title="최근 한달" data={groups.month} />
          <Section title="오래전" data={groups.older} />
        </>
      )}

      {/* 선택 날짜 뷰 정렬 상태일 때 전체 거래 내역을 flat하게 렌더링 */}
      {!selectedDate && !showCalendar && (amountOrder !== 'none' || dateOrder !== 'none') && (
        filteredTransactions
          .slice()
          .sort(sortFn)
          .map(item => <TransactionCard key={item._id} item={item} />)
      )}
    </ScrollView>
  );
};

// TransactionCard 컴포넌트 수정
const TransactionCard = ({ item }) => {
  const isDeposit = item.type === 'deposit';
  const barColor = isDeposit ? '#0984e3' : '#e74c3c';

  return (
    <View style={styles.card}>
      {/* 좌측 색상 바 */}
      <View style={[styles.sideBar, { backgroundColor: barColor }]} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.cardBank}>{item.accountBank}</Text>
          <Text style={[styles.cardAmount, { color: barColor }]}>
            {isDeposit ? '+' : '−'}
            {Number(item.amount).toLocaleString()}원
          </Text>
        </View>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Text>
      </View>
    </View>
  );
};

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
  toggleButton: { flex: 1, padding: 20, marginHorizontal: 1, backgroundColor: '#dfe6e9', borderRadius: 6, marginBottom: 10, alignItems: 'center' },
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    position: 'relative',
  },
  sideBar: {
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    paddingLeft: 8, // 색상 바와 내용 사이 여백
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBank: {
    fontSize: +28,
    color: '#0984e3',
  },
  cardAmount: {
    fontSize: +24,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: +20,
    color: '#636e72',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default AccountDetailScreen;