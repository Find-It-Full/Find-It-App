import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Button,
    useColorScheme,
    View,
    AppRegistry,
    TouchableOpacity,
    TextInput
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { addToFirestore } from './add';
export default function detailsAdd(props:any) {
    const [cont, setCont] = useState(false)
    const [name, setName] = useState("")
    const codeId = props.route.params.id
   
    
    return (
<View style={{flex:1}}>
        <TextInput
            placeholder={"Name"}
            onChangeText={(text:string)=>{setName(text) 
            if(text.length > 0){
                setCont(true)
            }}}
            
        ></TextInput>
            <Button title="Submit" disabled = {!cont} onPress={async ()=>{await addToFirestore(codeId,name,"URL")}} />
        </View>

    )



}