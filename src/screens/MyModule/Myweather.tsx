import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  TextInput,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, User } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { SwipeListView } from "react-native-swipe-list-view";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MyweatherAPI">) {
  const { isDarkmode, setTheme } = useTheme();
  const [input, setInput] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const api_key: string = "1a54ccd2800f2f5ed4979d1e54e0b3ec";

  const handlePress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${api_key}`
      );
      const json = await response.json();
      setData(json);
      //alert(JSON.stringify(json));
      setInput("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Blog List"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text>Location</Text>
        <TextInput
          containerStyle={{ marginTop: 15 }}
          placeholder="Enter Location*"
          value={input}
          autoCapitalize="none"
          autoCompleteType="on"
          autoCorrect={true}
          onChangeText={(input) => setInput(input)}
        />
        <Button
          text={loading ? "Loading" : "Done"}
          onPress={() => {
            handlePress();
          }}
          style={{
            marginTop: 20,
          }}
          disabled={loading}
        />
        {loading && (
          <View>
            <ActivityIndicator size={"large"} color={"#fff"} />
          </View>
        )}

        {data && (
          <View style={styles.infoView}>
            <Text
              style={styles.cityCountryText}
            >{`${data?.name}, ${data?.sys?.country}`}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleString()}</Text>
            <Text style={styles.tempText}>{`${Math.round(
              data?.main?.temp
            )} °C`}</Text>
            <Text style={styles.minMaxText}>{`Min ${Math.round(
              data?.main?.temp_min
            )} °C / Max ${Math.round(data?.main?.temp_max)} °C`}</Text>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  image: {
    flex: 1,
    flexDirection: "column",
  },

  textInput: {
    borderBottomWidth: 3,
    padding: 5,
    paddingVertical: 20,
    marginVertical: 100,
    marginHorizontal: 10,
    fontSize: 19,
    fontWeight: "300",
    borderRadius: 16,
    borderBottomColor: "#df8e00",
  },

  cityCountryText: {
    fontSize: 40,
    fontWeight: "bold",
  },

  infoView: {
    alignItems: "center",
  },

  dateText: {
    fontSize: 22,
    marginVertical: 10,
  },
  tempText: {
    fontSize: 45,
    marginVertical: 10,
  },
  minMaxText: {
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "500",
  },
});
