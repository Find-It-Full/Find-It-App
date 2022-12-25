import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import {BarCodeScanner} from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async() => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: (status == "granted")
    });
  };
  scan (data:any){
    console.log(data)
  }
  render() {
    const {hasCameraPermission,scanned} = this.state;
    console.warn(hasCameraPermission)
    if (hasCameraPermission === null) {
      return (<Text> Requesting for camera permission </Text>);
    }
    if (hasCameraPermission === false) {
      return (<Text> No access to camera </Text>);
    }
    return ( <View style = {
        {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }
      } >
      <BarCodeScanner onBarCodeScanned ={this.scan}
      style = {
        StyleSheet.absoluteFillObject
      }/>

      </View>
    );
  }

  handleBarCodeScanned = ({
    type,
    data
  }) => {
    this.setState({
      scanned: true
    });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}