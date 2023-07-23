import React from 'react'
import { Colors } from './colors'

export namespace Shadows {
    export const SmallShadow = { shadowColor: 'black', shadowOpacity: 0.7, shadowOffset: { width: 0, height: 2 }, shadowRadius: 2 }
    export const ActionShadow = { shadowColor: Colors.DarkAccentColor, shadowOpacity: 0, shadowOffset: { width: 0, height: 2 }, shadowRadius: 2 }
    export const BigActionShadow = { shadowColor: Colors.DarkAccentColor, shadowOpacity: 0.1, shadowOffset: { width: 1, height: 2 }, shadowRadius: 4 }
}