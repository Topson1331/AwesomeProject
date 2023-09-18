import React, { useContext } from "react";
import { getApps, initializeApp } from "firebase/app";
import { AuthContext } from "../provider/AuthProvider";

import { NavigationContainer } from "@react-navigation/native";

import Main from "./MainStack";
import Auth from "./AuthStack";
import Loading from "../screens/utils/Loading";

// Better put your these secret keys in .env file
const firebaseConfig = {
  apiKey: "AIzaSyAhGy1o7P5FjxGrRlA_kzpB2N-DOBHlmDY",
  authDomain: "moonlit-shadow-287706.firebaseapp.com",
  projectId: "moonlit-shadow-287706",
  storageBucket: "moonlit-shadow-287706.appspot.com",
  messagingSenderId: "1001179819295",
  appId: "1:1001179819295:web:7751e72de770938e55d42a"
};
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
    </NavigationContainer>
  );
};
