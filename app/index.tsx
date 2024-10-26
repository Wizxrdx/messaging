import { Text, View, StyleSheet, Alert, TouchableHighlight, Image } from "react-native";
import Status from "@/components/Status";
import MessageList from "@/components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "@/utils/MessageUtils";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from "react";

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };
    

  handlePressMessage = ({id, type}: {id: number, type: string}) => {
    switch (type) {
      case 'text':
        Alert.alert('Message Options', 'What do you want to do?', [
          { text: 'Delete', onPress: () => {
            this.setState({ messages: this.state.messages.filter(message => message.id !== id)});
          }},
          { text: 'Cancel' },
        ]);
        break;
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      default:
        break;
    }
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}/>
      </View>
    );
  };

  renderFullscreenImage() {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image: any = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;
    const { uri } = image;
    
    return (
      <TouchableHighlight style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}>
        <Image source={{ uri }} style={styles.fullscreenImage} />
      </TouchableHighlight>
    );
  };
  
  render() {
    return (<View style={styles.container}>
      <GestureHandlerRootView>

      { this.renderMessageList() }
      { this.renderFullscreenImage() }

      </GestureHandlerRootView>
    <Status />
    </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // flex: 1,
    height: '50%',
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
  fullscreenOverlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullscreenImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});