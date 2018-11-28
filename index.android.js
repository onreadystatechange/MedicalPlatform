/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {Platform,AppRegistry } from 'react-native';
import App from './src/App';
import {Sentry} from  'react-native-sentry';
if (!__DEV__) {
    Sentry.config('https://f421f0826bf04c53933abbde76f345c0:8c1eb1695ff7416a91416c5a5fe33943@sentry.io/283672').install();
}

AppRegistry.registerComponent('MedicalPlatform', () => App);

