import Constants from "expo-constants";
import { StyleSheet, View, Platform, StatusBar, Text, Animated } from "react-native";
import { addEventListener, NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";
import React from "react";

export default class Status extends React.Component {
    _subscription: NetInfoSubscription | null = null;
    state = {
        info: null,
    };

    animatedValue = new Animated.Value(-50);

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        this.setState({
            info: connectionInfo.type,
        });
    }

    componentDidMount() {
    this._subscription = addEventListener(
        this._handleConnectionInfoChange,
    );
    }

    componentWillUnmount() {
    this._subscription && this._subscription();
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.info !== this.state.info) {
            const isConnected = this.state.info !== 'none';
            
            Animated.timing(this.animatedValue, {
                toValue: isConnected ? -50 : 20,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    renderStatusBar = (isConnected: boolean) => {
        const backgroundColor = isConnected ? 'white' : 'red';

        return (
            <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={true} />
        );
    }

    renderMessageBubble = () => {
        return (
            <Animated.View
                style={[styles.bubble, { transform: [{ translateY: this.animatedValue }] }]}>
                    <Text style={styles.text}>No network Connection</Text>
            </Animated.View>
        );
    }

    render(): React.ReactNode {
        const { info } = this.state;

        const isConnected = info !== 'none';
        const backgroundColor = isConnected ? 'white' : 'red';

        const messageContainer = (
            <View style={styles.messageContainer} pointerEvents={'none'}>
                { this.renderStatusBar(isConnected) }
                { this.renderMessageBubble() }
            </View>
        );

        if(Platform.OS == 'ios') {
            return (
                <View style={[styles.status, { backgroundColor }]} />
            );
        }

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
        top: statusHeight + 20,
        right: 0,
        left: 0,
        height: 80,
        alignItems: 'center',
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