import { View, StyleSheet, Alert, TouchableHighlight, Image, BackHandler } from "react-native";
import Status from "@/components/Status";
import MessageList from "@/components/MessageList";
import Toolbar from "@/components/Toolbar";
import { createImageMessage, createLocationMessage, createTextMessage } from "@/utils/MessageUtils";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from "react";
import * as Location from 'expo-location';

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
    isInputFocused: false,
  };

  subscription: any;

  handlePressToolbarCamera = () => {
    
  };

  handlePressToolbarLocation = async () => {
    const { messages } = this.state;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Location permission required', 'You need to grant location permission to send your location');
        return;
      }

      Location.getCurrentPositionAsync().then((position: any) => {
        const { coords: { latitude, longitude } } = position;
        this.setState({
          messages: [createLocationMessage({ latitude, longitude }), ...messages],
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleChangeFocus = (isFocused: boolean) => {
  };

  handleSubmit = (text: string) => {
    const { messages } = this.state;
    this.setState({ messages: [createTextMessage(text), ...messages], });
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };
    

  handlePressMessage = ({id, type}: {id: number, type: string}) => {
    this.setState({ isInputFocused: false });
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

  componentDidMount(): void {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount(): void {
    this.subscription.remove();
  }

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={ styles.toolbar }>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
          />
      </View>
    );
  }

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
      { this.renderToolbar() }
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullscreenImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});