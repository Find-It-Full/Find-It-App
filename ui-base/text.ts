import { PlatformColor, StyleProp, TextStyle } from "react-native";

export namespace TextStyles {

    export const h1: StyleProp<TextStyle> = {
        fontFamily: 'Poppins-Bold',
        fontSize: 32,
        fontWeight: '800'
    }

    export const h2: StyleProp<TextStyle> = {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        fontWeight: 'bold'
    }

    export const h3: StyleProp<TextStyle> = {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        fontWeight: 'bold'
    }

    export const p: StyleProp<TextStyle> = {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    }

    export const b1: StyleProp<TextStyle> = {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        fontWeight: '800',
        color: PlatformColor('systemBlue'),
    }

    export const i1: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        fontWeight: 'bold'
    }

    export const i2: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 16,
        fontWeight: 'bold',
        color: PlatformColor('systemBlue'),
    }
    
    export const i3: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 12,
        fontWeight: 'bold',
    }
}