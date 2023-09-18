import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  TextInput,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function CovidScreen({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "apiforc">) {
  const { isDarkmode, setTheme } = useTheme();
  const [input, setInput] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${input}?lastdays=1`
      );

      if (response.ok) {
        const json = await response.json();
        setData(json.timeline);
      } else {
        // Handle error if the country data is not found
        setData(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Covid-19 Timeline"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? "white" : "black"}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? "white" : "black"}
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
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text fontWeight="bold" size="xl" style={{ marginTop: 20 }}>
          Covid-19 Vaccine Coverage Timeline
        </Text>
        <TextInput
          containerStyle={{ marginTop: 15 }}
          placeholder="Enter Country's name*"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <Button
          text={loading ? "Loading" : "Get"}
          onPress={handlePress}
          style={{ marginTop: 20 }}
          disabled={loading}
        />

        {loading && <ActivityIndicator size="large" color="#007BFF" />}

        {data && (
          <View style={{ marginTop: 20 }}>
            <Text fontWeight="bold" size="lg">
              Timeline for {input}:
            </Text>
            <ScrollView style={{ marginTop: 10 }}>
              {Object.entries(data).map(([date, value]) => (
                <View key={date} style={styles.timelineItem}>
                  <Text>Date: {date}</Text>
                  <Text>Number: {value}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {!loading && data === null && (
          <Text style={{ color: "red", marginTop: 20 }}>
            Data not found for {input}.
          </Text>
        )}
      </ScrollView>
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
