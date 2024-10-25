import { Text, View, StyleSheet } from "react-native";
import Status from "@/components/Status";
import MessageList from "@/components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "@/utils/MessageUtils";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>

      <MessageList messages={[
        createImageMessage('https://unsplash.it/300/300'),
        createTextMessage('World'),
        createTextMessage('Hello'),
        createLocationMessage({
          latitude: 37.78825,
          longitude: -122.4324,
        }),
      ]} />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
});