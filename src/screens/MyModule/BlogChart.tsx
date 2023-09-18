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
  Dimensions,
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

import { LineChart } from "react-native-chart-kit";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "BlogChart">) {
  const { isDarkmode, setTheme } = useTheme();

  const auth = getAuth();

  const db = getFirestore();

  const storage = getStorage();

  const [loading, setLoading] = useState<boolean>(true); // Set loading to true on component mount

  const [blogArray, setBlogArray] = useState<object[]>(); // Initial empty

  const [myLineChartLabel, setMyLineChartLabel] = useState<any>(null);

  const [myLineChartData, setMyLineChartData] = useState<any>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    getMyLineChartInformation();
  }, []);

  async function getMyLineChartInformation() {
    if (auth.currentUser) {
      const q = query(
        collection(db, "Blog"),

        where("CreatedUserId", "==", auth.currentUser.uid)
      );

      await onSnapshot(q, (querySnapshot) => {
        const blogData: any = [];

        querySnapshot.forEach((doc) => {
          blogData.push({
            ...doc.data(),

            key: doc.id,
          });
        });

        if (blogData.length > 0) {
          blogData.sort((a: any, b: any) => a.updatedDate - b.updatedDate);

          blogData.forEach((el: any) => {
            var DateObj = new Date(el.startDate);

            var months = DateObj.getMonth();

            console.log("month", months);

            myLineChartData[months] += 1;

            console.log(myLineChartData[months]);
          });

          setMyLineChartLabel([
            "January",

            "February",

            "March",

            "April",

            "May",

            "June",

            "July",

            "August",

            "September",

            "October",

            "November",

            "December",
          ]);
        }
      });
    }
  }

  if (myLineChartLabel) {
    if (myLineChartLabel.length) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Layout>
            <TopNav
              middleContent="Blog Line Chart"
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
              <LineChart
                data={{
                  labels: myLineChartLabel,

                  datasets: [
                    {
                      data: myLineChartData,

                      strokeWidth: 2,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 16}
                height={220}
                chartConfig={{
                  backgroundColor: "#1cc910",

                  backgroundGradientFrom: "#eff3ff",

                  backgroundGradientTo: "#efefef",

                  decimalPlaces: 2,

                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,

                  borderRadius: 16,
                }}
              />
            </View>
          </Layout>
        </SafeAreaView>
      );
    } else {
      return (
        <Layout>
          <TopNav
            middleContent="Blog Line Chart"
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
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" />
          </View>
        </Layout>
      );
    }
  } else {
    return (
      <Layout>
        <TopNav
          middleContent="Blog Line Chart"
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
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>no data found</Text>
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

    flex: 1,
  },

  backTextWhite: {
    color: "#FFF",
  },

  rowFront: {
    alignItems: "center",

    backgroundColor: "#CCC",

    borderBottomColor: "black",

    borderBottomWidth: 1,

    justifyContent: "center",

    height: 180,
  },

  rowBack: {
    alignItems: "center",

    backgroundColor: "#DDD",

    flex: 1,

    flexDirection: "row",

    justifyContent: "space-between",

    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: "center",

    bottom: 0,

    justifyContent: "center",

    position: "absolute",

    top: 0,

    width: 75,
  },

  backRightBtnLeft: {
    backgroundColor: "blue",

    right: 150,
  },

  backRightBtnMiddle: {
    backgroundColor: "green",

    right: 75,
  },

  backRightBtnRight: {
    backgroundColor: "red",

    right: 0,
  },

  row: {
    flex: 1,

    flexDirection: "row",

    flexWrap: "wrap",

    alignItems: "center",

    marginBottom: 10,
  },
});
