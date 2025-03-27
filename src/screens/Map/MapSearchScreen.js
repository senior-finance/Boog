import React, { useState } from "react";
import { MAP_SEARCH_BACKEND_URL } from '@env';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";

const Place = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({ title: "", address: "" });

  const [formData, setFormData] = useState({
    placeInfo: { firstPlace: {} },
  });

  // 다음 버튼 누를때 동작하는 함수
  const handleNextStep = (newPlaceData) => {
    // console.log("최종 데이터:", {
    //   placeInfo: { firstPlace: newPlaceData },
    // });

    console.log("📦 최종 전달 데이터:\n", JSON.stringify({
      placeInfo: { firstPlace: newPlaceData },
    }, null, 2));

    // 화면 이동 등 나중에 추가 가능
    // navigation.navigate("NextScreen", {
    //   placeData: newPlaceData,
    // });
  };

  // 검색 버튼 누를때 동작함
  const handleSearch = async () => {
    // console.log("handleSearch 실행됨");

    setSelectedPlace({ title: "", address: "" });

    try {
      const response = await axios.post(`${MAP_SEARCH_BACKEND_URL}/searchPlace`, {
        placeName: query,
      });

      // 아래 주석처리한 코드는 백엔드 응답 원본
      // console.log("백엔드 응답:", response.data);

      // 아래 코드는 로그에서만 보기 편하게 수정한 것
      // console.log("백엔드 응답:\n", JSON.stringify(response.data, null, 2));
      response.data.places?.forEach((place, idx) => {
        const cleanTitle = place.title.replace(/<[^>]*>/g, "");
        console.log(
          `\n[${idx + 1}] ${cleanTitle}\n    주소: ${place.address}\n    도로명: ${place.roadAddress || '없음'}\n    링크: ${place.link || '없음'}`
        );
      });
      setSearchResults(response.data.places || []);
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  // 검색 결과 클릭 했을때
  const handlePlaceSelection = (title, address) => {
    setSelectedPlace({ title, address });
    setQuery(title);
    setSearchResults([]);
    console.log("선택한 장소:", { title, address });
  };

  // 클릭했을때 그 클릭한 장소 정보 저장
  const handleNext = () => {
    const newPlaceData = {
      placeName: selectedPlace.title,
      address: selectedPlace.address,
    };

    setFormData((prevData) => ({
      ...prevData,
      placeInfo: { ...prevData.placeInfo, firstPlace: newPlaceData },
    }));

    // 변경된 값 직접 넘겨서 로그 찍기
    handleNextStep(newPlaceData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>주소</Text>
      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          placeholder="장소명을 입력해주세요."
          onChangeText={setQuery}
          onSubmitEditing={handleSearch} // 엔터키를 눌렀을 때 handleSearch 호출
          style={styles.input}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const cleanTitle = item.title.replace(/<[^>]*>/g, "");
            return (
              <TouchableOpacity
                onPress={() => handlePlaceSelection(cleanTitle, item.address)}
                style={styles.resultItem}
              >
                <Text style={styles.resultTitle}>{cleanTitle}</Text>
                <Text style={styles.resultAddress}>{item.address}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selectedPlace.title !== "" && (
        <View style={{ marginTop: 10 }}>
          <Text>선택한 장소: {selectedPlace.title}</Text>
          <Text>주소: {selectedPlace.address}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Place;

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 4,
  },
  searchButtonText: { color: "white" },
  resultItem: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  resultTitle: { fontWeight: "bold" },
  resultAddress: { color: "#555" },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  nextButtonText: { color: "white", fontWeight: "bold" },
});
