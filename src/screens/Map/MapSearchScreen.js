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

const MapSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({ title: "", address: "" });

  const [formData, setFormData] = useState({
    placeInfo: { firstPlace: {} },
  });

  // 다음 버튼 누를때 동작하는 함수
  const handleNextStep = (newPlaceData) => {
    console.log("📦 최종 전달 데이터:\n", JSON.stringify({
      placeInfo: { firstPlace: newPlaceData },
    }, null, 2));

    // 좌표 정보를 MapViewScreen으로 전달
    navigation.navigate("MapView", {
      placeData: newPlaceData, // mapx, mapy 포함된 데이터 전달
    });
  };

  // 검색 버튼 누를때 동작함
  const handleSearch = async () => {
    setSearchResults([]); // 기존 검색 결과를 비운다

    try {
      // const response = await axios.post(`${MAP_SEARCH_BACKEND_URL}searchPlace`, {
      //   placeName: query,
      // });

      const response = await axios.post("http://10.0.2.2:4000/searchPlace", {
        placeName: query,
      });
      // 아래 주석처리한 코드는 백엔드 응답 원본
      // console.log("백엔드 응답:", response.data);

      // 아래 코드는 로그에서만 보기 편하게 수정한 것
      // console.log("백엔드 응답:\n", JSON.stringify(response.data, null, 2));

      // 좌표 값 변환을 포함하여 placesData를 설정
      const placesData = response.data.places.map((place) => {
        const cleanTitle = place.title ? place.title.replace(/<[^>]*>/g, "") : "제목 없음"; // 제목이 없으면 "제목 없음"
        const cleanedMapx = place.mapx ? place.mapx / 10000000 : 126.977011;  // X 좌표 변환 (1e7로 나누기)
        const cleanedMapy = place.mapy ? place.mapy / 10000000 : 37.564362;  // Y 좌표 변환 (1e7로 나누기)

        // log로 mapx, mapy 값을 확인
        console.log(`place: ${cleanTitle}, mapx: ${cleanedMapx}, mapy: ${cleanedMapy}`);

        return {
          placeName: cleanTitle,
          address: place.address || "주소 없음", // 주소가 없으면 "주소 없음"
          mapx: cleanedMapx,
          mapy: cleanedMapy,
        };
      });
      setSearchResults(placesData); // 검색 결과 저장
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  // 클릭했을때 그 클릭한 장소 정보 저장
  const handleNext = () => {
    // 첫 번째 검색 결과만 MapView로 전달
    const newPlaceData = searchResults; // 검색된 5개 장소 전체를 선택

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
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>{item.placeName}</Text>
              <Text style={styles.resultAddress}>{item.address}</Text>
            </View>
          )}
        />
      )}

      {/* 다음 버튼 비활성화 처리 */}
      <TouchableOpacity
        style={[styles.nextButton, { opacity: searchResults.length > 0 ? 1 : 0.5 }]}
        onPress={handleNext}
        disabled={searchResults.length === 0}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapSearchScreen;

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
