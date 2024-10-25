import Constants from "expo-constants";
import { StyleSheet, View, Platform, StatusBar, Text } from "react-native";
import { addEventListener, NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";
import React from "react";

export default class Status extends React.Component {
    _subscription: NetInfoSubscription | null = null;
    state = {
        info: null,
      };

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        this.setState({
            info: connectionInfo.type,
        });
      };

    componentDidMount() {
    this._subscription = addEventListener(
        this._handleConnectionInfoChange,
    );
    }

    componentWillUnmount() {
    this._subscription && this._subscription();
    }

    render(): React.ReactNode {
        const { info } = this.state;

        const isConnected = info !== 'none';
        const backgroundColor = isConnected ? 'white' : 'red';

        const statusBar = (
            <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={false}
            />
        );

        const messageContainer = (
            <View style={styles.messageContainer} pointerEvents={'none'}>
                {statusBar}
                {!isConnected && (
                    <View style={styles.bubble}>
                        <Text style={styles.text}>No network Connection</Text>
                    </View>
                )}
            </View>
        );

        if(Platform.OS == 'ios') {
            return (
                <View style={[styles.status, { backgroundColor }]} />
            );
        }
        
        console.log(statusBar);
        return messageContainer;
    }
}

const statusHeight = (Platform.OS == 'ios' ? Constants.statusBarHeight : 0)

const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight
    },
    messageContainer: {
        zIndex: 1,
        position: 'absolute',
        top: statusHeight + 30,
        right: 0,
        left: 0,
        height: 80,
        alignItems: 'center'
    },
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red'
    },
    text: {
        color: 'white'
    }
})