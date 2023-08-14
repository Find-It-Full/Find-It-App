import { PlatformColor } from "react-native"

export namespace DarkModeColors {
    export const White = '#FFFFFF'
    export const Black = '#151515'
    export const Background = Black
    export const TextColor = White
    export const PanelColor = '#1D1D1D'
    export const ButtonColor = '#2C2C2C'
    export const ItemBorder = 'rgba(255, 255, 255, 0.1)'
    export const ModalBackground = 'rgba(0, 0, 0, 0.4)'
    export const Red = 'rgba(255, 59, 48, 1)'//PlatformColor('systemRed')
    export const Green = 'rgba(52, 199, 89, 1)'//PlatformColor('systemGreen')
    export const DisabledOpacity = 0.6
}

const lightGray = 'rgb(242, 242, 242)'

export namespace Colors {
    export const Line = 'rgb(100, 101, 112)'
    export const Blue = '#0000EE'
    export const White = '#151515'
    export const Black = '#FFFFFF'
    export const Background = '#FFFFFF'
    export const TextColor = White
    export const PanelColor = lightGray
    export const ItemBorder = lightGray
    export const ModalBackground = 'rgba(0, 0, 0, 0.4)'
    export const Red = '#FF0000'//PlatformColor('systemRed')
    export const Green = '#208041'//PlatformColor('systemGreen')
    export const DisabledOpacity = 0.75
    export const DarkAccentColor = '#151530'
    export const LightAccentColor = '#696bf0'
    export const ButtonColor = DarkAccentColor
}