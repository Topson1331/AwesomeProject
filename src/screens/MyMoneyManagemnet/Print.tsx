import React, { useState } from "react";
import { View, Button, Platform, StyleSheet, Text } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const styles = StyleSheet.create({
  spacer: {
    height: 8,
    marginTop: 10,
  },
  printer: {3
    textAlign: "center",
  },
});

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

const PrintComponent = () => {
  const [selectedPrinter, setSelectedPrinter] = useState<any>();

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <Button title="Print" onPress={print} /> */}
      <View style={styles.spacer} />
      <Button title="Print to PDF file" onPress={printToFile} />
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text>Selected printer: {selectedPrinter.name}</Text>
          ) : null}
        </>
      )}
    </View>
  );
};

export default PrintComponent;
