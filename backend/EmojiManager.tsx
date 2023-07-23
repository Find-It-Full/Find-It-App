import React from "react"
import { createContext, useMemo } from "react"
import * as emojiData from '../assets/apple.json'

export interface EmojiData {
    categories: { id: string, emojis: string[] }[]
    emojis: {
        [key: string]: {
            id: string
            name: string
            keywords: string[]
            skins: {
                unified: string
                native: string
                x: number
                y: number
            }[]
            version: number
        }
    }
    aliases: {
        [key: string]: string
    }
    sheet: {
        cols: number
        rows: number
    }
}

interface EmojiManagerInterface {
    emojis: [string, string][]
    getEmojiAtScaledLocation: (category: number, rowPercentage: number, colPercentage: number) => string | null
    getCategorySize: (category: number) => number
}

const EmojiManagerContext = createContext({ } as EmojiManagerInterface)

export { EmojiManagerContext }

const emojiMatrix: string[][][] = []

const emojisByCategory: [string, string][] = []
const categories = emojiData.categories

let categoryIndex = 0
for (const category of categories) {
    emojiMatrix.push([[], [], [], [], []])
    const rows = ['', '', '', '', '']
    let rowIndex = 0
    for (const emojiName of category.emojis) {
        const emoji = (emojiData as EmojiData).emojis[emojiName].skins[0].native
        rows[rowIndex] += emoji
        emojiMatrix[categoryIndex][rowIndex].push(emoji)
        rowIndex = (rowIndex + 1) % 5
    }

    emojisByCategory.push([category.id, rows.join('\n')])
    categoryIndex ++;
}

const EmojiManager = (props: { children?: React.ReactNode }) => {

    const getEmojiAtScaledLocation = (category: number, rowPercentage: number, colPercentage: number) => {

        console.log(emojiMatrix[category][0][0])

        const numRows = emojiMatrix[category].length
        const numCols = emojiMatrix[category][0].length

        const row = Math.floor(numRows * rowPercentage)
        const col = Math.floor(numCols * colPercentage)

        console.log(row, col)

        return emojiMatrix.at(category)?.at(row)?.at(col) ?? null
    }

    const getCategorySize = (category: number) => {
        return emojiMatrix[category][0].length
    }

    return (
        <EmojiManagerContext.Provider value={{ emojis: emojisByCategory, getEmojiAtScaledLocation, getCategorySize }} >
            {props.children}
        </EmojiManagerContext.Provider>
    )
}

export default EmojiManager