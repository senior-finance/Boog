import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { accountGetAll } from '../../database/mongoDB';
import CustomText from '../../components/CustomText';

// 1) 한글 로케일 정의
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};

// 2) 기본 로케일을 ko로 설정
LocaleConfig.defaultLocale = 'ko';

const AccountDetailScreen = ({ route }) => {
  const { userName, accountNum } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [amountOrder, setAmountOrder] = useState('none');
  const [dateOrder, setDateOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  const sectionKeys = {
    today: '오늘',
    yesterday: '어제',
    week: '최근 일주일',
    month: '최근 한달',
    older: '오래전',
  };

  const orderedSectionKeys = useMemo(() => {
    const keys = ['today', 'yesterday', 'week', 'month', 'older'];
    return dateOrder === 'asc' ? keys.reverse() : keys;
  }, [dateOrder]);

  const cycleFilter = prev =>
    prev === 'all' ? 'deposit' :
      prev === 'deposit' ? 'withdraw' :
        'all';

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
      // 선택한 계좌(accountNum) 거래만 남기기
      const filteredList = list.filter(tx => tx.accountNum === accountNum);
      setTransactions(filteredList);
      setLoading(false);
    })();
  }, [userName]);

  const dayCounts = useMemo(() => {
    const counts = {};
    filteredTransactions.forEach(({ createdAt }) => {
      const date = createdAt.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [filteredTransactions]);

  const sortFn = useMemo(() => {
    if (sortBy === 'amount') {
      return amountOrder === 'asc'
        ? (a, b) => a.amount - b.amount
        : (a, b) => b.amount - a.amount;
    }
    if (sortBy === 'date') {
      return dateOrder === 'asc'
        ? (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        : (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    }
    return () => 0;
  }, [sortBy, amountOrder, dateOrder]);

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
      } else if (diffDays <= 30 && diffDays > 7) {
        monthList.push(item);
      } else if (diffDays > 30) {
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
      <LottieView source={require('../../assets/loadingg.json')} autoPlay loop style={styles.loader} />
    </View>
  );

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.toggleButton, (selectedDate || showCalendar) && styles.toggleButtonActive]}
        onPress={() => {
          if (selectedDate || showCalendar) {
            setSelectedDate(null);
            setShowCalendar(false);
          } else setShowCalendar(true);
        }}
      >
        <CustomText style={[styles.toggleText, (selectedDate || showCalendar) && styles.toggleTextActive]}>
          {(selectedDate || showCalendar) ? '원래대로' : '기간 선택'}
        </CustomText>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'date' && styles.toggleButtonActive]}
          onPress={() => {
            const next = dateOrder === 'desc' ? 'asc' : 'desc';
            setDateOrder(next);
            setSortBy('date');
          }}
        >
          <CustomText style={[styles.toggleText, sortBy === 'date' && styles.toggleTextActive]}>
            날짜 {dateOrder === 'desc' ? '최근순' : '오래된순'}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, sortBy === 'amount' && styles.toggleButtonActive]}
          onPress={() => {
            const next = cycleOrder(amountOrder);
            setAmountOrder(next);
            setSortBy(next === 'none' ? null : 'amount');
          }}
        >
          <CustomText style={[styles.toggleText, sortBy === 'amount' && styles.toggleTextActive]}>
            금액 {
              amountOrder === 'none'
                ? '원래대로'
                : amountOrder === 'desc'
                  ? '큰'
                  : '작은'
            }
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, filterType !== 'all' && styles.toggleButtonActive]}
          onPress={() => setFilterType(cycleFilter(filterType))}
        >
          <CustomText style={[styles.toggleText, filterType !== 'all' && styles.toggleTextActive]}>
            {filterType === 'all'
              ? '입출금 모두'
              : filterType === 'deposit'
                ? '입금만'
                : '출금만'}
          </CustomText>
        </TouchableOpacity>
      </View>

      {!selectedDate && !showCalendar && sortBy !== 'amount' && (
        orderedSectionKeys.map(key => (
          <Section
            key={key}
            title={sectionKeys[key]}
            data={groups[key]}
          />
        ))
      )}

      {selectedDate && !showCalendar && (
        selectedList.length > 0
          ? selectedList.map(item => <TransactionCard key={item._id} item={item} />)
          : <CustomText style={styles.emptyText}>해당 날짜에 거래 내역이 없습니다</CustomText>
      )}

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
                <CustomText style={{ color: state === 'disabled' ? '#b2bec3' : '#2d3436' }}>{date.day}</CustomText>
                {count > 0 && <CustomText style={styles.dayCount}>{`${count}건`}</CustomText>}
              </TouchableOpacity>
            );
          }}
          onDayPress={day => {
            setSelectedDate(new Date(day.dateString));
            setShowCalendar(false);
          }}
          theme={calendarTheme}
          style={styles.calendar}
        />
      )}

      {!selectedDate && !showCalendar && amountOrder === 'none' && dateOrder === 'none' && (
        <>
          <Section title="오늘" data={groups.today} />
          <Section title="어제" data={groups.yesterday} />
          <Section title="최근 일주일" data={groups.week} />
          <Section title="최근 한달" data={groups.month} />
          <Section title="오래전" data={groups.older} />
        </>
      )}

      {/* {!selectedDate && !showCalendar && (amountOrder !== 'none' || dateOrder !== 'none') && (
        filteredTransactions
          .slice()
          .sort(sortFn)
          .map(item => <TransactionCard key={item._id} item={item} />)
      )} */}
    </ScrollView>
  );
};

// TransactionCard 컴포넌트 수정
const TransactionCard = ({ item }) => {
  const isDeposit = item.type === 'deposit';
  const barColor = isDeposit ? '#0984e3' : '#e74c3c';
  const { counterpartyAccountBank, counterpartyAccountNum } = item;

  return (
    <View style={styles.card}>
      {/* 좌측 색상 바 */}
      <View style={[styles.sideBar, { backgroundColor: barColor }]} />

      <View style={styles.content}>
        <View style={styles.row}>
          <CustomText style={styles.cardBank}>{item.accountBank}</CustomText>
          <CustomText style={[styles.cardAmount, { color: barColor }]}>
            {isDeposit ? '+' : '−'}
            {Number(item.amount).toLocaleString()}원
          </CustomText>
        </View>
        {/* 상대방 정보 */}
        <View style={styles.counterpartyRow}>
          <CustomText style={styles.counterpartyText}>
            상대 은행 : {counterpartyAccountBank} {"\n"}계좌 : {counterpartyAccountNum}
          </CustomText>
          <CustomText style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const Section = ({ title, data }) => (
  <View style={styles.section}>
    <CustomText style={styles.sectionTitle}>{title}</CustomText>
    {data.length > 0 ? data.map(item => <TransactionCard key={item._id} item={item} />)
      : <CustomText style={styles.emptyText}>아직 없어요</CustomText>}
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

  textMonthFontSize: 24,       // 월 이름 (예: “5월”)
  textDayHeaderFontSize: 16,   // 요일 헤더 (예: “월”, “화”)
  textDayFontSize: 20,         // 날짜 숫자 (예: “28”)
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#e8f0fe', // 부드러운 파란 계열 배경
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 200,
    height: 200,
  },

  // 🔘 상단 버튼 관련
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    backgroundColor: '#d0d8f0',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#4b7be5',
  },
  toggleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2d3436',
  },
  toggleTextActive: {
    color: '#ffffff',
  },

  // 📅 캘린더
  calendar: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 4,
  },
  dayCount: {
    fontSize: 11,
    color: '#4b7be5',
    marginTop: 2,
  },

  // 🗂 섹션 및 타이틀
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b7be5',
    marginBottom: 10,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#636e72',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  summaryText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 18,
    color: '#2d3436',
    fontWeight: '600',
  },

  // 💳 거래 카드
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#ccc',
  },
  sideBar: {
    width: 5,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBank: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0984e3',
  },
  cardAmount: {
    fontSize: +32,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 8,
    textAlign: 'right',
  },
  counterpartyRow: {
    marginTop: 6,
  },
  counterpartyText: {
    fontSize: 16,
    color: '#636e72',
  },
});

export default AccountDetailScreen;