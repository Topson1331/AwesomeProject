import React, { useState, useRef } from "react";

import { View, StyleSheet } from "react-native";

import { MainStackParamList } from "../../types/navigation";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  Button,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import { Video, AVPlaybackStatus } from "expo-av";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "myvideo">) {
  const { isDarkmode, setTheme } = useTheme();

  const video = useRef(null);

  const [status, setStatus] = useState<any>({});

  return (
    <Layout>
      <TopNav
        middleContent="Video"
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
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />

        <Button
          text={status.isPlaying ? "Pause" : "Play"}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",

    width: 320,

    height: 200,
  },
});
