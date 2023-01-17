import { PlatformColor, StyleProp, TextStyle } from "react-native";

export namespace TextStyles {

    export const h1: StyleProp<TextStyle> = {
        fontSize: 32,
        fontWeight: '800'
    }

    export const h2: StyleProp<TextStyle> = {
        fontSize: 24,
        fontWeight: 'bold'
    }

    export const h3: StyleProp<TextStyle> = {
        fontSize: 18,
        fontWeight: 'bold'
    }

    export const b1: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 16,
        fontWeight: '800',
        color: PlatformColor('systemBlue'),
    }
}