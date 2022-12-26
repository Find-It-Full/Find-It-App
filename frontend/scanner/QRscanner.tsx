import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    TouchableOpacity
} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { navigate } from '../navigation/rootNavigation';
import { Camera } from 'expo-camera';


export default class QRscanner extends React.Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: (status == "granted")
        });
    };
    scan(data: any) {
        navigate("NewItemTest", { id: data.data })
    }
    render() {
        const { hasCameraPermission, scanned } = this.state;
        console.warn(hasCameraPermission)
        if (hasCameraPermission === null) {
            return (<Text> Requesting for camera permission </Text>);
        }
        if (hasCameraPermission === false) {
            return (<Text> No access to camera </Text>);
        }
        return (<View style={
            {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }
        } >
            <View style={styles.container}>
                <Camera style={styles.camera}  autoFocus={true} onBarCodeScanned={this.scan} >
                    <View style={styles.buttonContainer}>
                        
                    </View>
                </Camera>
            </View>

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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});