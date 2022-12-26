import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';

export default function NewItemTest(props:any){
return (

    <View>
        <Text>{props.route.params.id}</Text>
    </View>
)

}
  