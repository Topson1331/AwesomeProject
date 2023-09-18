import React, { useState, useRef } from "react";

import { View, StyleSheet, TouchableOpacity } from "react-native";

import { MainStackParamList } from "../../types/navigation";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  Button,
  TextInput,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import QRCode from "react-native-qrcode-svg";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "QRCODEGenerate">) {
  const { isDarkmode, setTheme } = useTheme();

  const [inputText, setInputText] = useState("");

  const [qrvalue, setQrvalue] = useState("");

  let myQRCode = useRef();

  return (
    <Layout>
      <TopNav
        middleContent="QRCode Generate"
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
        <QRCode
          getRef={(ref) => (myQRCode = ref)}
          // ref={myQRCode}

          //QR code value

          value={qrvalue ? qrvalue : "NA"}
          //size of QR Code

          size={250}
          //Color of the QR Code (Optional)

          color="black"
          //Background Color of the QR Code (Optional)

          backgroundColor="white"
          //Center Logo size (Optional)

          logoSize={30}
          //Center Logo margin (Optional)

          //Center Logo radius (Optional)

          logoBorderRadius={15}
          //Center Logo background (Optional)

          logoBackgroundColor="yellow"
        />

        <Text style={styles.textStyle}>
          Please insert any value to generate QR code
        </Text>

        <TextInput
          style={styles.textInputStyle}
          onChangeText={(inputText) => setInputText(inputText)}
          placeholder="Enter Any Value"
          value={inputText}
        />

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => setQrvalue(inputText)}
        >
          <Text style={styles.buttonTextStyle}>Generate QR Code</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",

    justifyContent: "center",

    alignItems: "center",

    textAlign: "center",

    padding: 10,
  },

  titleStyle: {
    fontSize: 20,

    textAlign: "center",

    margin: 10,
  },

  textStyle: {
    textAlign: "center",

    margin: 10,
  },

  textInputStyle: {
    flexDirection: "row",

    height: 40,

    marginTop: 20,

    marginLeft: 35,

    marginRight: 35,

    margin: 10,
  },

  buttonStyle: {
    backgroundColor: "#51D8C7",

    borderWidth: 0,

    color: "#FFFFFF",

    borderColor: "#51D8C7",

    alignItems: "center",

    borderRadius: 5,

    marginTop: 30,

    padding: 10,
  },

  buttonTextStyle: {
    color: "#FFFFFF",

    paddingVertical: 10,

    fontSize: 16,
  },
});
