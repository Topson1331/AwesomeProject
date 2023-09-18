import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase.config";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { LineChart, PieChart } from "react-native-chart-kit";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, "editvalue">) {
  const { isDarkmode, setTheme } = useTheme();
  const [myLineChartLabel, setMyLineChartLabel] = useState<any>(null);
  const [myLineChartData, setMyLineChartData] = useState<any>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [expenseLineData, setExpenseLineData] = useState<any>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [pieChartData, setPieChartData] = useState({
    income: 0,
    expense: 0,
  });

  const pieData = [
    {
      name: "Expense",
      amount: pieChartData.expense,
      color: "#176B87",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Income",
      amount: pieChartData.income,
      color: "#64CCC5",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    getChartInformation();
  }, []);

  async function getChartInformation() {
    if (auth.currentUser) {
      const q = query(
        collection(db, "Add_value"),
        where("CreatedUserId", "==", auth.currentUser.uid)
      );

      await onSnapshot(q, (querySnapshot) => {
        const expenseData: any = [];
        const incomeData: any = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.key = doc.id;

          if (data.typeValue === "Expense") {
            expenseData.push(data);
          } else if (data.typeValue === "Income") {
            incomeData.push(data);
          }
        });

        //Calculate total for expense and income
        const expenseTotal = expenseData.reduce(
          (total: any, item: any) => total + parseFloat(item.amount || 0),
          0
        );

        const incomeTotal = incomeData.reduce(
          (total: any, item: any) => total + parseFloat(item.amount || 0),
          0
        );
        setPieChartData({ income: incomeTotal, expense: expenseTotal });

        if (expenseData.length > 0) {
          expenseData.sort((a: any, b: any) => a.updatedDate - b.updatedDate);
          console.log(expenseData);

          expenseData.forEach((el: any) => {
            var DateObj = new Date(el.startDate);
            var month = DateObj.getMonth();

            console.log("month", month + 1);

            expenseLineData[month] += parseFloat(el.amount);
            console.log(expenseLineData[month]);
          });

          setMyLineChartLabel(months);
        }

        if (incomeData.length > 0) {
          incomeData.sort((a: any, b: any) => a.updatedDate - b.updatedDate);

          incomeData.forEach((el: any) => {
            var DateObj = new Date(el.startDate);
            var month = DateObj.getMonth();

            console.log("month", month + 1);

            myLineChartData[month] += parseFloat(el.amount);
          });

          setMyLineChartLabel(months);
        }
      });
    }
  }

  let content;

  if (!myLineChartLabel) {
    content = (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>no data found</Text>
      </View>
    );
  } else if (myLineChartLabel.length === 0) {
    content = (
      <Layout>
        <TopNav
          middleContent="Chart"
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
  } else {
    content = (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout>
          <TopNav
            middleContent="Chart"
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

          <View style={{ flex: 1, marginHorizontal: 8, marginTop: 5 }}>
            <Text>Line Chart for Monthty Total Income</Text>
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
              yAxisSuffix=" RM"
              yAxisInterval={1000}
              bezier
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(5, 59, 80, ${opacity})`,
                style: {
                  borderRadius: 16,
                  marginLeft: 5,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginBottom: 5,
              }}
            />

            <Text>Line Chart for Monthty Total Expense</Text>
            <LineChart
              data={{
                labels: myLineChartLabel,
                datasets: [
                  {
                    data: expenseLineData,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get("window").width - 16}
              height={220}
              yAxisSuffix=" RM"
              yAxisInterval={200}
              bezier
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(23, 107, 135, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginBottom: 10,
              }}
            />
            <Text>Pie Chart for Total Expense and Income</Text>
            <PieChart
              data={pieData}
              width={Dimensions.get("window").width}
              height={220}
              chartConfig={{
                backgroundColor: "white",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Layout>
      </SafeAreaView>
    );
  }
  console.log(myLineChartData);
  return content;
}
