import * as React from 'react';
import { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QRscanner from './scanner/QRscanner';
import NewItemTest from './newItem/newItemTest';
import { createNavigationContainerRef } from '@react-navigation/native';
import { navigationRef } from './navigation/rootNavigation';


export default function App(props:any) {
  



const Stack = createNativeStackNavigator();
    
    return ( 
        <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="home" component={Root} />
          <Stack.Screen name="QRscanner" component={QRscanner} />
        <Stack.Screen name="NewItemTest" component={NewItemTest}/>
      </Stack.Navigator>
      </NavigationContainer>
    );
  

}




  
function Root(props:any){
return (
<View style ={{
    flex: 1,
    flexDirection: 'column',
    justifyContent:"center"
  }
}>

  
<Button
  title="Scan"
  onPress={() => {
      console.log(props)
      props.navigation.navigate('QRscanner')}}
/>

</View>

)
}

