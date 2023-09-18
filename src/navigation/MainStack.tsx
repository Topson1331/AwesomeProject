import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SecondScreen from "../screens/SecondScreen";
import MainTabs from "./MainTabs";
import ThirdScreen from "../screens/ThirdScreen";

import MyMenu from "../screens/MyModule/MyMenu";
import QuestionAdd from "../screens/MyModule/QuestionAdd";
import QuestionList from "../screens/MyModule/QuestionList";
import MoneyManagement from "../screens/MyMoneyManagemnet/MoneyManagement";
import Addvalue from "../screens/MyMoneyManagemnet/Addvalue";
import BlogAdd from "../screens/MyModule/BlogAdd";
import Bloglist from "../screens/MyModule/Bloglist";
import EditBlogscreen from "../screens/MyModule/EditBlogscreen";
import Detail_value from "../screens/MyMoneyManagemnet/Detail_value";
import BlogDetail from "../screens/MyModule/BlogDetail";
import showvalue from "../screens/MyModule/showvalue";
import editvalue from "../screens/MyMoneyManagemnet/editvalue";
import NotificationOwner from "../screens/MyModule/NotificationOwner";
import NotificationOwnerOTher from "../screens/MyModule/NotificationOwnerOTher";
import ContactOwnerList from "../screens/MyModule/ContactOwnerList";
import BlogChart from "../screens/MyModule/BlogChart";
import QRCODEGenerate from "../screens/MyModule/QRCODEGenerate";
import QRSCANNER from "../screens/MyModule/QRSCANNER";
import PieChart from "../screens/MyMoneyManagemnet/PieChart";
import BlogPieChart from "../screens/MyModule/BlogChart";
import Myweather from "../screens/MyModule/Myweather";
import QRCODE from "../screens/MyMoneyManagemnet/QRCODE";
import myaudio from "../screens/MyMoneyManagemnet/myaudio";
import mydraw from "../screens/MyMoneyManagemnet/mydraw";
import myvideo from "../screens/MyMoneyManagemnet/myvideo";
import myprint from "../screens/MyMoneyManagemnet/myprint";
import camera from "../screens/MyMoneyManagemnet/camera";
import apiforc from "../screens/MyMoneyManagemnet/apiforc";
import Currency from "../screens/MyMoneyManagemnet/Currency";
//import Mylocation from "../screens/MyModule/Mylocation";//
import MyAccelerometer from "../screens/MyModule/MyAccelerometer";
const MainStack = createNativeStackNavigator();
//import Mapbasic from "../screens/MyModule/Mapbasic";//
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
      <MainStack.Screen name="ThirdScreen" component={ThirdScreen} />
      <MainStack.Screen name="MyMenu" component={MyMenu} />
      <MainStack.Screen name="QuestionAdd" component={QuestionAdd} />
      <MainStack.Screen name="QuestionList" component={QuestionList} />
      <MainStack.Screen name="MoneyManagement" component={MoneyManagement} />
      <MainStack.Screen name="addvalue1" component={Addvalue} />
      <MainStack.Screen name="BlogAdd" component={BlogAdd} />
      <MainStack.Screen name="Bloglist" component={Bloglist} />
      <MainStack.Screen name="apiforc" component={apiforc} />
      <MainStack.Screen name="BlogEdit" component={EditBlogscreen} />
      <MainStack.Screen name="BlogDetail" component={BlogDetail} />
      <MainStack.Screen name="Detail_value" component={Detail_value} />
      <MainStack.Screen name="editvalue" component={editvalue} />
      <MainStack.Screen name="showvalue" component={showvalue} />
      <MainStack.Screen name="ContactOwnerList" component={ContactOwnerList} />
      <MainStack.Screen name="BlogChart" component={BlogChart} />
      <MainStack.Screen name="QRCODEGenerate" component={QRCODEGenerate} />
      <MainStack.Screen name="QRSCANNER" component={QRSCANNER} />
      <MainStack.Screen name="BlogPieChart" component={BlogPieChart} />
      <MainStack.Screen name="PieChart" component={PieChart} />
      <MainStack.Screen name="MyweatherAPI" component={Myweather} />
      <MainStack.Screen name="QRCODE" component={QRCODE} />
      <MainStack.Screen name="myvideo" component={myvideo} />
      <MainStack.Screen name="myaudio" component={myaudio} />
      <MainStack.Screen name="camera" component={camera} />
      <MainStack.Screen name="Currency" component={Currency} />
      <MainStack.Screen name="mydraw" component={mydraw} />
      <MainStack.Screen name="myprint" component={myprint} />
      <MainStack.Screen name="MyAccelerometer" component={MyAccelerometer} />
      {/*<MainStack.Screen name="Mapbasic" component={Mapbasic} />
      <MainStack.Screen name="Mylocation" component={Mylocation} />*/}

      <MainStack.Screen
        name="NotificationOwnerOTher"
        component={NotificationOwnerOTher}
      />
      <MainStack.Screen
        name="NotificationOwner"
        component={NotificationOwner}
      />
    </MainStack.Navigator>
  );
};

export default Main;
