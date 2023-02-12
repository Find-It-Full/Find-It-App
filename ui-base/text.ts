import { PlatformColor, StyleProp, TextStyle } from "react-native";
import { Colors } from "./colors";

export namespace TextStyles {

    export const h1: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Bold',
        fontSize: 32,
        fontWeight: '800',
        color: Colors.TextColor
    }

    export const h2: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.TextColor
    }

    export const h3: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.TextColor
    }

    export const h4: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Bold',
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.TextColor
    }

    export const p: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 14,
        color: Colors.TextColor
    }

    export const p2: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Regular',
        fontSize: 14,
        color: Colors.TextColor,
        opacity: 0.6
    }

    export const b1: StyleProp<TextStyle> = {
        fontFamily: 'SFPro-Bold',
        fontSize: 16,
        fontWeight: '800',
        color: Colors.TextColor,
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