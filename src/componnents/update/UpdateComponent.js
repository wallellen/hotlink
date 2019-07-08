import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import CodePush from "react-native-code-push";

class UpdateComponent extends Component {
  constructor() {
    super();
    this.state = { restartAllowed: true };
  }

  /**
   * 
   * @param {*} syncStatus 状态监听
   */
  codePushStatusDidChange(syncStatus) {
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "检查更新中..." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "下载更新中" });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "等待用户操作..." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "安装更新中..." });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "已经是最新版本", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "用户取消操作", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "已经更新至最新版本，重启后生效.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "未知错误.", progress: false });
        break;
    }
  }

  /**
   * 
   * @param {*} progress 更新进度
   */
  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  /**
   * 是否更新后重启
   */
  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
      .then((metadata) => {
        this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version", progress: false });
      }, (error) => {
        this.setState({ syncMessage: "错误: " + error, progress: false });
      });
  }

  /**
   * 同步
   */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  /**
   * 立即检测同步
   */
  syncImmediate() {
    CodePush.sync(
      { installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  render() {
    let progressView;

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>已收到{this.state.progress.receivedBytes} of {this.state.progress.totalBytes}字节数据</Text>
      );
    }

    return (
      <View style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>
          测试热更代码
        </Text>
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>后台更新</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
          <Text style={styles.syncButton}>点击立即更新</Text>
        </TouchableOpacity>
        {progressView}
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={styles.restartToggleButton}>重启 { this.state.restartAllowed ? "开启" : "禁止"}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
          <Text style={styles.syncButton}>点击检测更新</Text>
        </TouchableOpacity> */}
        <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50,
    paddingBottom: 15,
  },
  messages: {
    marginTop: 30,
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
  scrollView: {
    ...Platform.select({
      android: {
        backgroundColor: '#f5f5f5',
      },
    }),
  },
  group: {
    marginTop: 15,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#424242',
  },
});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = { 
    checkFrequency: CodePush.CheckFrequency.MANUAL,
    updateDialog: {
      appendReleaseDescription:true,//是否显示更新description，默认为false
      descriptionPrefix:"更新内容：",//更新说明的前缀。 默认是” Description:
      mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue  
      mandatoryUpdateMessage:"",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
      optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
      optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
      optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
      title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
    },
};

UpdateComponent = CodePush(codePushOptions)(UpdateComponent);

export default UpdateComponent;