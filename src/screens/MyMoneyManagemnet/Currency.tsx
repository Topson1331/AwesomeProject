import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import {
  Layout,
  Picker,
  TopNav,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import navigation from "../../navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types/navigation";

const API_BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    // backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  convertButton: {
    marginTop: 20,
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 5,
  },
  convertButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  result: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  switchIcon: {
    marginRight: 10,
    marginBottom: 30,
  },
  darkBackground: {
    backgroundColor: "black",
    color: "white",
  },
  lightBackground: {
    backgroundColor: "white",
    color: "black",
  },
});

export default function ({
  route,
  navigation,
}: NativeStackScreenProps<MainStackParamList, "Detail_value">) {
  const { isDarkmode, setTheme } = useTheme();
  const [info, setInfo] = useState<any>({});
  const [input, setInput] = useState<string>("0");
  const [from, setFrom] = useState<string>("myr");
  const [to, setTo] = useState<string>("usd");
  const [options, setOptions] = useState<string[]>([]);
  const [output, setOutput] = useState<number | null>(0);

  useEffect(() => {
    axios.get(`${API_BASE_URL}${from}.json`).then((res) => {
      setInfo(res.data[from]);
    });
  }, [from]);

  useEffect(() => {
    setOptions(Object.keys(info));
    convert();
  }, [info]);

  const convert = () => {
    const rate = info[to];
    setOutput(parseFloat(input) * rate);
  };

  const flip = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };
  return (
    <Layout>
      <TopNav
        middleContent="Currency Converter"
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
        style={[
          styles.container,
          isDarkmode ? styles.darkBackground : styles.lightBackground,
        ]}
      >
        <Text
          style={[
            styles.heading,
            isDarkmode ? styles.darkBackground : styles.lightBackground,
          ]}
        >
          Currency Converter
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isDarkmode ? styles.darkBackground : styles.lightBackground,
            ]}
            placeholder="Enter the amount"
            keyboardType="numeric"
            value={input}
            onChangeText={(text) => setInput(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.dropdownLabel,
              isDarkmode ? styles.darkBackground : styles.lightBackground,
            ]}
          >
            From
          </Text>
          <Picker
            items={options.map((value) => ({
              label: value,
              value: value,
            }))}
            placeholder="From"
            value={from}
            onValueChange={(val: any) => setFrom(val)}
          />
        </View>
        <TouchableOpacity style={styles.switchButton} onPress={flip}>
          <Ionicons
            name="swap-vertical"
            size={24}
            color={isDarkmode ? "white" : "black"}
            style={styles.switchIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.dropdownLabel,
              isDarkmode ? styles.darkBackground : styles.lightBackground,
            ]}
          >
            To
          </Text>
          <Picker
            items={options.map((value) => ({
              label: value,
              value: value,
            }))}
            placeholder="To"
            value={to}
            onValueChange={(val: any) => setTo(val)}
          />
        </View>
        <TouchableOpacity style={styles.convertButton} onPress={convert}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>
        {output !== null && (
          <View style={styles.result}>
            <Text
              style={[
                styles.resultText,
                isDarkmode ? styles.darkBackground : styles.lightBackground,
              ]}
            >
              {`${input} ${from} = ${output.toFixed(2)} ${to}`}
            </Text>
          </View>
        )}
      </View>
    </Layout>
  );
}
