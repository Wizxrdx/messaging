import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View, Text, Image  } from 'react-native';
import  MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { MessageShape } from '../utils/MessageUtils';
import { TouchableOpacity } from 'react-native-gesture-handler';

const KeyExtractor = (item: { id: { toString: () => any; }; }) => item.id.toString();

export default class MessageList extends React.Component<any> {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  renderMessageItem = ({ item }: {item: any }) => { const { onPressMessage } = this.props;
    return (
        <View key={item.id} style={styles.messageRow}>
            <TouchableOpacity onPress={() => onPressMessage(item)}>
                {this.renderMessageBody(item)}
            </TouchableOpacity>
        </View>
    )
  }

  renderMessageBody = ({type, text, uri, coordinate}: {type: string, text: string, uri: string, coordinate: { latitude: number; longitude: number }}) => {
    switch (type) {
        case 'text':
            return (
                <View style={styles.messageBubble}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            );
        case 'image':
            return <Image style={styles.image} source={{ uri }} />;

        case 'location':
            return (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...coordinate,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.04,
                    }}>
                    <Marker coordinate={coordinate} />
                </MapView>
            );

            default:
                return null;
    }
  }

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        style={styles.container}
        inverted={true}
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={KeyExtractor}
        keyboardShouldPersistTaps={'handled'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(16, 135, 255)',
    borderRadius: 20,
  },
  text: {
    color: 'white',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});