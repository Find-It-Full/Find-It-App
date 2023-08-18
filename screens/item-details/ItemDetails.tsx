import React from 'react'
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, FlatList, LayoutAnimation, Modal, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LatLng } from "react-native-maps";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { ExactLocationReportField, isExactLocation, Report } from "../../backend/databaseTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "../../components/items/ReportSummary";
import { Colors } from "../../ui-base/colors";
import ItemProfile from "../../components/items/ItemProfile";
import BackButton from "../../components/BackButton";
import { clearReports, removeItem } from "../../reducers/items";
import MarkAsLost from "../MarkAsLost";
import { viewReport } from '../../reducers/reports';
import SightingMap from '../../components/SightingMap';
import { Radii } from '../../ui-base/radii';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'
import ContextMenu from "react-native-context-menu-view";
import PlatformIcon, { Icons } from '../../components/PlatformIcon';
import SmallActionButton from '../../components/SmallActionButton';
import { VerticallyCenteringRow } from '../../ui-base/layouts';
import PaginationDots from '../../components/PaginationDots';

export default function ItemDetails(props: ItemDetailsProps) {

    const dispatch = useAppDispatch()

    const itemID = props.route.params.itemID
    const item = useAppSelector((state) => state.items.items[itemID])
    const rawReports = useAppSelector((state) => state.reports.reports[item?.itemID]) || {}
    const reports = item ? Object.values(rawReports) : []
    reports.sort((a, b) => b.timeOfCreation - a.timeOfCreation)
    const locations = getAllLocations(reports)
    const [selectedReport, setSelectedReport] = useState(getInitialState(reports))
    const windowWidth = useWindowDimensions().width
    const scrollRef = useRef<FlatList>(null)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const [isChangingLostState, setIsChangingLostState] = useState<'none' | 'set-lost' | 'set-found'>('none')
    const [isClearingSightings, setIsClearingSightings] = useState(false)
    const [isPresentingMarkAsLostModal, setIsPresentingMarkAsLostModal] = useState(false)
    const scrollX = React.useRef(new Animated.Value(0)).current
    const [scrollHeight, setScrollHeight] = useState(125)
    const [summaryHeights, setSummaryHeights] = useState(reports.map(() => 125))
    const [footerHeight, setFooterHeight] = useState(160)

    useEffect(() => {
        if (reports.length === 0 && isClearingSightings) {
            setIsClearingSightings(false)
        }
        setSummaryHeights(reports.map(() => 125))
        scrollToIndex(0)
    }, [reports.length])

    useEffect(() => {
        if (!selectedReport && reports.length) {
            // handles the first report coming in
            setSelectedReport(getInitialState(reports))
        }
        else if (selectedReport && !reports.length) {
            // handles reports being removed
            setSelectedReport(null)
        }
    }, [reports])

    const onScrollEvent = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
        }
    )

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        updateSelectedReport(event)
        onScrollEvent(event)
    }

    const updateSelectedReport = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        if (reports.length === 0) {
            setSelectedReport(null)
            return
        }

        let index = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / windowWidth), reports.length - 1))

        if (index === selectedReport?.reportIndex) {
            return
        }

        if (!reports[index]) {
            if (reports.length > 0) {
                index = 0
            } else {
                setSelectedReport(null)
                return
            }
        }

        const locationField = reports[index].fields.EXACT_LOCATION
        const newSelectedReport = {
            reportID: reports[index].reportID,
            reportIndex: index,
            location: isExactLocation(locationField) ? locationField : null
        }
        console.log("analytics --- new selected report")
        analytics().logEvent('new_selected_report', { newSelectedReport })
        updateScrollHeight(summaryHeights[index])
        setSelectedReport(newSelectedReport)
    }

    const scrollToIndex = (index: number) => {

        if (!selectedReport) {
            return
        }

        const newIndex = Math.max(Math.min(index, reports.length - 1), 0)
        scrollRef.current?.scrollToIndex({ index: newIndex, animated: false })
    }

    const handleNewSummaryHeight = (height: number, index: number) => {
        const newSummaryHeights = [...summaryHeights]
        newSummaryHeights[index] = height
        setSummaryHeights(newSummaryHeights)
        if (index === selectedReport?.reportIndex) {
            updateScrollHeight(height)
        }
    }

    const updateScrollHeight = (newHeight: number) => {
        if (Math.abs(newHeight - scrollHeight) > 1) {
            if(Platform.OS === 'android'){
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            }
            else{
            LayoutAnimation.configureNext({ 
                duration: 0,
                create: {
                    type: LayoutAnimation.Types.linear,
                    duration: 0,
                    property: LayoutAnimation.Properties.opacity
                },
                update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    duration: 350,
                    property: LayoutAnimation.Properties.opacity
                },
                delete: {
                    type: LayoutAnimation.Types.linear,
                    duration: 0,
                    property: LayoutAnimation.Properties.opacity
                }
            })
        }
            setScrollHeight(newHeight)
        }
    }

    useEffect(() => {
        if (!selectedReport) {
            return
        }

        if (!selectedReport.reportID) {
            return
        }

        dispatch(viewReport({ reportID: selectedReport.reportID, itemID: itemID, userID: item.ownerID }))
    }, [selectedReport])

    const handleClearSightings = () => {
        Alert.alert(
            'Do you want to clear all sightings?',
            'You cannot undo this action.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        setIsClearingSightings(true);
                        const status = (await dispatch(clearReports({ itemID: item.itemID }))).meta.requestStatus
                        if (status === 'rejected') {
                            setIsClearingSightings(false)
                        }
                    }
                }
            ]
        )
    }

    const handleRemoveItem = () => {
        Alert.alert(
            'Do you want to remove this item?',
            'You cannot undo this action, but you can always reuse your tag on something new!',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        setIsClearingSightings(true)
                        const status = (await dispatch(removeItem(item.itemID))).meta.requestStatus
                        setIsClearingSightings(false)

                        if (status === 'fulfilled') {
                            props.navigation.goBack()
                        }
                    }
                }
            ]
        );
    }

    const handleEditItem = () => {
        props.navigation.navigate('EditItem', { item })
    }

    if (!item) {
        return <EmptyItemDetails />
    }

    return (
        <View style={{ padding: 0, paddingBottom: Math.max(safeAreaInsets?.bottom ?? 0, Spacing.ScreenPadding), backgroundColor: Colors.Background, flex: 1 }}>
            <View style={{ flex: 1 }}/>
            <SightingMap
                locations={locations}
                primaryLocation={selectedReport ? selectedReport.location : null}
                itemIcon={item.icon}
                itemName={item.name}
                selectReportAtIndex={scrollToIndex}
                summaryHeight={footerHeight}
            />
            <BackButton />
            <View 
                style={{ backgroundColor: Colors.Background, borderRadius: 8, flexShrink: 1 }}
                onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
            >
                <View style={{ paddingTop: Spacing.Gap, paddingHorizontal: Spacing.ScreenPadding, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                    <ItemProfile {...item} />
                    <MoreButton hasSightings={reports.length > 0} handleClearSightings={handleClearSightings} handleRemoveItem={handleRemoveItem} handleItemSettings={handleEditItem} />
                </View>
                {
                    selectedReport && reports.length > 0 ?
                        <>
                            <View style={{ position: 'relative', paddingTop: Spacing.ThreeQuartersGap }}>
                                <FlatList
                                    data={reports}
                                    renderItem={(report) => (
                                        <ReportSummary
                                            report={report.item}
                                            isSelected={selectedReport?.reportID}
                                            itemName={item.name}
                                            key={report.item.reportID}
                                            onNewHeight={(height) => handleNewSummaryHeight(height, report.index)}
                                        />
                                    )}
                                    horizontal
                                    pagingEnabled
                                    style={{ zIndex: 2, height: scrollHeight }}
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                    ref={scrollRef}
                                />
                                {
                                    isClearingSightings ?
                                        <View style={{ width: 42, height: 42, borderRadius: Radii.ItemRadius, backgroundColor: Colors.Background, position: 'absolute', zIndex: 3, left: '50%', top: '50%', transform: [{ translateX: -21 }, { translateY: -21 }], justifyContent: 'center' }}>
                                            <ActivityIndicator size={'small'} />
                                        </View>
                                        :
                                        null
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', marginTop: Spacing.Gap, paddingHorizontal: Spacing.BigGap }}>
                                <PaginationDots data={reports} dotStyle={{}} containerStyle={{}} scrollX={scrollX} />
                            </View>
                        </>
                        :
                        <View style={{ backgroundColor: Colors.PanelColor, marginHorizontal: Spacing.ScreenPadding, marginTop: Spacing.Gap, borderRadius: Radii.ItemRadius, padding: Spacing.Gap }}>
                            <Text
                                style={[TextStyles.p2, { textAlign: 'center' }]}
                            >
                                {
                                    item.emailNotifications || item.pushNotifications ?
                                        `Nobody has spotted this item yet. You'll be notified when it's spotted.` :
                                        `Nobody has spotted this item yet. Sighting notifications are currently off for this item.`
                                }

                            </Text>
                            {
                                isClearingSightings && isChangingLostState === 'none' ?
                                    <View style={{ width: 42, height: 42, borderRadius: Radii.ItemRadius, backgroundColor: Colors.Background, position: 'absolute', zIndex: 3, left: '50%', top: '50%', transform: [{ translateX: -21 }, { translateY: -21 }], justifyContent: 'center' }}>
                                        <ActivityIndicator size={'small'} />
                                    </View>
                                    :
                                    null
                            }
                        </View>
                }

            </View>
            <Modal
                animationType='fade'
                presentationStyle='overFullScreen'
                transparent={true}
                visible={isPresentingMarkAsLostModal}
                onRequestClose={() => {
                    setIsPresentingMarkAsLostModal(false)
                }}>
                <MarkAsLost itemID={item.itemID} forceClose={() => {
                    setIsPresentingMarkAsLostModal(false)
                    setIsChangingLostState('none')
                }} />
            </Modal>
        </View>
    )
}

function getInitialState(reports: Report[]): { reportID: string, reportIndex: number, location: LatLng | null, } | null {
    // (A) No reports - return nulls
    if (reports.length === 0) {
        return null
    }

    // (B) ≥ 1 report
    let field: ExactLocationReportField | null = null
    let firstReport: Report = reports[0]
    let firstIndex: number = 0
    reports.every((report, index) => {
        if (isExactLocation(report.fields.EXACT_LOCATION)) {
            field = report.fields.EXACT_LOCATION
            firstReport = report
            firstIndex = index
            return false
        }
        return true
    })

    return { reportID: firstReport.reportID, reportIndex: firstIndex, location: field }
}

function getAllLocations(reports: Report[]): (LatLng | null)[] {
    const locations: (LatLng | null)[] = []
    for (const report of reports) {
        if (isExactLocation(report.fields.EXACT_LOCATION)) {
            locations.push({
                latitude: report.fields.EXACT_LOCATION.latitude,
                longitude: report.fields.EXACT_LOCATION.longitude
            })
        }
        else {
            locations.push(null)
        }
    }
    return locations
}

function MoreButton(props: { hasSightings: boolean, handleClearSightings: () => void, handleRemoveItem: () => void, handleItemSettings: () => void }) {
    return (
        <ContextMenu
            actions={[
                { title: 'Remove Item', systemIcon: 'trash' }, 
                { title: 'Clear Sightings', systemIcon: 'xmark.bin', disabled: !props.hasSightings },
                { title: 'Item Settings', systemIcon: 'gearshape' },
            ]}
            onPress={({ nativeEvent }) => {
                if (nativeEvent.index === 0) {
                    props.handleRemoveItem()
                }
                else if (nativeEvent.index === 1) {
                    props.handleClearSightings()
                }
                else {
                    props.handleItemSettings()
                }
            }}

            dropdownMenuMode={true}
        >
            <SmallActionButton icon={Icons.MORE} label='' onPress={() => { }} />
        </ContextMenu>
    )
}

function EmptyItemDetails() {

    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

    return (
        <View style={{ padding: 0, paddingBottom: safeAreaInsets?.bottom, backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap
                locations={null}
                primaryLocation={null}
                itemIcon={' '}
                itemName=' '
                selectReportAtIndex={() => { }}
                summaryHeight={10}
            />
            <BackButton />
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>

            </View>
        </View>
    )
}