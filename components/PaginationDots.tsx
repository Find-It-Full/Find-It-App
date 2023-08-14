import React, { useState } from 'react';
import {
    View,
    Dimensions,
    Animated,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { Colors } from '../ui-base/colors';

export interface ExpandingDotProps {
    data: Array<Object>;
    scrollX: Animated.Value;
    containerStyle: ViewStyle;
    dotStyle: ViewStyle;
    inActiveDotOpacity?: number;
    inActiveDotColor?: string;
    expandingDotWidth?: number;
}

const { width } = Dimensions.get('screen');

const PaginationDots = ({
    scrollX,
    data,
    dotStyle,
    containerStyle,
    inActiveDotOpacity,
    inActiveDotColor,
    expandingDotWidth,
}: ExpandingDotProps) => {
    const defaultProps = {
        inActiveDotColor:
            inActiveDotColor || styles.dotStyle.backgroundColor.toString(),
        inActiveDotOpacity: inActiveDotOpacity || 0.5,
        expandingDotWidth: expandingDotWidth || 8,
        dotWidth: (dotStyle.width as number) || 8,
        maxDots: 20
    };

    // const [lastIndex, setLastIndex] = useState(Math.min(data.length, defaultProps.maxDots))

    return (
        <View style={[styles.containerStyle, containerStyle]}>
            {data.map((_, index) => {

                let widthScaleFactor: number = 1;

                // if (index === defaultProps.maxDots - 1) {
                //     widthScaleFactor = 0.45;
                // }
                // else if (index === defaultProps.maxDots - 2) {
                //     widthScaleFactor = 0.75;
                // }

                const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                ];

                const backgroundColor = dotStyle.backgroundColor ?? styles.dotStyle.backgroundColor;

                const colour = scrollX.interpolate({
                    inputRange,
                    outputRange: [
                        defaultProps.inActiveDotColor,
                        backgroundColor.toString(),
                        defaultProps.inActiveDotColor,
                    ],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [
                        defaultProps.inActiveDotOpacity,
                        1,
                        defaultProps.inActiveDotOpacity,
                    ],
                    extrapolate: 'clamp',
                });
                // const expand = scrollX.interpolate({
                //     inputRange: shownRange,
                //     outputRange: [
                //         defaultProps.dotWidth,
                //         defaultProps.expandingDotWidth,
                //         defaultProps.dotWidth,
                //     ],
                //     extrapolate: 'clamp',
                // });

                return (
                    <Animated.View
                        key={`dot-${index}`}
                        style={[
                            styles.dotStyle,
                            dotStyle,
                            { width: defaultProps.dotWidth * widthScaleFactor },
                            { height: defaultProps.dotWidth * widthScaleFactor },
                            { opacity },
                            { backgroundColor: colour },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: 5 + 6
    },
    dotStyle: {
        width: 6,
        height: 6,
        backgroundColor: 'rgb(120, 120, 120)',
        borderRadius: 5,
        marginHorizontal: 4,
    },
});

export default PaginationDots;
