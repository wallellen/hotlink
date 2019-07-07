/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import CodePush from 'react-native-code-push';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restartAllowed: true
    }
  }

  async sync() {
    let self = this;
    try {
      return await CodePush.sync(
        {
          installMode: CodePush.InstallMode.IMMEDIATE,
          updateDialog: {
            appendReleaseDescription:true, //是否显示更新description，默认为false
            descriptionPrefix:"更新内容: ",//更新说明的前缀。 默认是” Description:
            mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue
            mandatoryUpdateMessage:"",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
            optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
            optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
            optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
            title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
          }
        },
        (syncStatus) => {
          console.log("-syncStatus-" + syncStatus);
          switch(syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              self.setState({
                syncMessage: "检查更新..."
              });
              break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              self.setState({
                syncMessage: "下载更新中..."
              });
              break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
              self.setState({
                syncMessage: "等待用户操作"
              });
              break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
              self.setState({
                syncMessage: "安装更新中"
              });
              break;
            case CodePush.SyncStatus.UP_TO_DATE:
              self.setState({
                syncMessage: "已经是最新版本",
                progress: false
              });
              break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
              self.setState({
                syncMessage: "用户已取消更新",
                progress: false
              });
              break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
              self.setState({
                syncMessage: "更新完成",
                progress: false
              });
              break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
              self.setState({
                syncMessage: "未知错误",
                progress: false
              });
              break;
          }
        },
        (progress) => {
          self.setState({
            progress: progress
          });
        }
      );
    } catch (error) {
      CodePush.log(error);
    }
  }

  toggleAllowRestart() {
    if (this.state.restartAllowed) {
      CodePush.disallowRestart();
    } else {
      CodePush.allowRestart();
    }
    this.setState({restartAllowed: !this.state.restartAllowed});
  }

  componentDidMount() {
    CodePush.notifyApplicationReady();
  }
  

  render() {
    let syncView, syncButton, progressView;

    if (this.state.syncMessage) {
      syncView = (
        <Text style={styles.messages}>{this.state.syncMessage}</Text>
      );
    } else {
      syncButton = (
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={{color: 'green', fontSize: 17}}>开始检测-6</Text>
        </TouchableOpacity>
      );
    }

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>已收到 {this.state.progress.receivedBytes}/{this.state.progress.totalBytes}字节数据</Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          测试更新操作中
        </Text>
        {syncButton}
        {syncView}
        {progressView}
        {/*<Image style={styles.image} resizeMode={Image.resizeMode.contain} source={require('./images/laptop_phone_howitworks.png')}/>*/}
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={{color: 'blue', fontSize: 17}}>重启状态 { this.state.restartAllowed ? "允许" : "禁止"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    marginTop: 50,
    width: Dimensions.get('window').width - 100,
    height: 365 * (Dimensions.get('window').width - 100) / 651,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  messages: {
    textAlign: 'center',
  },
});

export default App;