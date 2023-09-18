import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  Button,
  Section,
  SectionContent,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.config";

const styles = StyleSheet.create({
  btn: {
    marginTop: 10,
  },
});

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MoneyManagement">) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="My Money Management Screen"
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

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold">This is My Money Management Screen</Text>
            <Button
              text="Add value"
              onPress={() => {
                navigation.navigate("addvalue1");
              }}
              style={styles.btn}
            />
            <Button
              text="Show value"
              onPress={() => {
                navigation.navigate("showvalue");
              }}
              style={styles.btn}
            />
            <Button
              text="Chart"
              onPress={() => {
                navigation.navigate("PieChart");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="QR Generate"
              onPress={() => {
                navigation.navigate("QRCODE");
              }}
              style={styles.btn}
            />
            <Button
              text="Video"
              onPress={() => {
                navigation.navigate("myvideo");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Audio"
              onPress={() => {
                navigation.navigate("myaudio");
              }}
              style={styles.btn}
            />
            <Button
              text="Draw"
              onPress={() => {
                navigation.navigate("mydraw");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Print"
              onPress={() => {
                navigation.navigate("myprint");
              }}
              style={styles.btn}
            />
            <Button
              text="Camera"
              onPress={() => {
                navigation.navigate("camera");
              }}
              style={styles.btn}
            />
            <Button
              text="API"
              onPress={() => {
                navigation.navigate("apiforc");
              }}
              style={styles.btn}
            />
            <Button
              text="Currency"
              onPress={() => {
                navigation.navigate("Currency");
              }}
              style={styles.btn}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
