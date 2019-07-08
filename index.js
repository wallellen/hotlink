/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {StackNavigator} from 'react-navigation';

import Update from './src/componnents/update/UpdateComponent';
import Controls from './src/componnents/amap/ControlsComponent';
import Home from './src/Home.js';

const  App = StackNavigator({
    Home:{screen:Home},
    Update:{screen:Update},
    Controls:{screen:Controls},
  });

AppRegistry.registerComponent(appName, () => App);
