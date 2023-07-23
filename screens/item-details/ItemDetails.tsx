import React from 'react'
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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

export default function ItemDetails(props: ItemDetailsProps) {

    const dispatch = useAppDispatch()

    const itemID = props.route.params.itemID
    const item = useAppSelector((state) => state.items.items[itemID])
    const rawReports = useAppSelector((state) => state.reports.reports[item?.itemID]) || {}
    const reports = item ? Object.values(rawReports) : []
    const locations = getAllLocations(reports)
    const [selectedReport, setSelectedReport] = useState(getInitialState(reports))
    const windowWidth = useWindowDimensions().width
    const scrollRef = useRef<ScrollView>(null)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const [isChangingLostState, setIsChangingLostState] = useState<'none' | 'set-lost' | 'set-found'>('none')
    const [isClearingSightings, setIsClearingSightings] = useState(false)
    const [isPresentingMarkAsLostModal, setIsPresentingMarkAsLostModal] = useState(false)

    reports.sort((a, b) => a.timeOfCreation - b.timeOfCreation)

    useEffect(() => {

        // Handles independent sight clearings

        if (isChangingLostState === 'set-found') {
            return
        }

        if (reports.length === 0 && isClearingSightings) {
            setIsClearingSightings(false)
        }
    }, [reports.length])

    useEffect(() => {
        if (!selectedReport && reports.length) {
            setSelectedReport(getInitialState(reports))
        }
        else if (selectedReport && !reports.length) {
            setSelectedReport(null)
        }
    }, [reports])

    const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        if (reports.length === 0) {
            setSelectedReport(null)
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
            }
        }

        const locationField = reports[index].fields.EXACT_LOCATION
        const newSelectedReport = {
            reportID: reports[index].reportID,
            reportIndex: index,
            location: isExactLocation(locationField) ? locationField : null
        }
        console.log("analytics --- new selected report")
        await analytics().logEvent('new_selected_report', { newSelectedReport })
        setSelectedReport(newSelectedReport)
    }

    const scrollToOffset = (offset: number) => {

        if (!selectedReport) {
            return
        }

        scrollToIndex(selectedReport.reportIndex + offset)
    }

    const scrollToIndex = (index: number) => {

        if (!selectedReport) {
            return
        }

        const newIndex = Math.max(Math.min(index, reports.length - 1), 0)
        const position = newIndex * windowWidth
        scrollRef.current?.scrollTo({ x: position, animated: true })
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
                        console.log('clearing')
                        setIsClearingSightings(true)
                        await dispatch(clearReports({ itemID: item.itemID }))
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
                        await dispatch(removeItem(item.itemID))
                        props.navigation.goBack()
                        setIsClearingSightings(false)
                    }
                }
            ]
        );
    }

    const handleEditItem = () => {
        props.navigation.navigate('EditItem', { item })
    }

    const canScrollToNext = (selectedReport != null) && selectedReport.reportIndex < reports.length - 1
    const canScrollToPrev = (selectedReport != null) && selectedReport.reportIndex > 0

    if (!item) {
        return <EmptyItemDetails />
    }

    return (
        <View style={{ padding: 0, paddingBottom: Math.max(safeAreaInsets?.bottom ?? 0, Spacing.ScreenPadding), backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap
                locations={locations}
                primaryLocation={selectedReport ? selectedReport.location : null}
                itemIcon={item.icon}
                itemName={item.name}
                selectReportAtIndex={scrollToIndex}
            />
            <BackButton />
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>
                <View style={{ paddingTop: Spacing.BigGap, paddingHorizontal: Spacing.ScreenPadding, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                    <ItemProfile {...item} />
                    <MoreButton hasSightings={reports.length > 0} handleClearSightings={handleClearSightings} handleRemoveItem={handleRemoveItem} handleItemSettings={handleEditItem} />
                </View>
                {
                    selectedReport && reports.length > 0 ?
                        <>
                            <View style={{ position: 'relative' }}>
                                <ScrollView
                                    horizontal={true}
                                    pagingEnabled
                                    style={{ zIndex: 2, paddingTop: Spacing.ThreeQuartersGap }}
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={handleScroll}
                                    scrollEventThrottle={36}
                                    ref={scrollRef}
                                    onLayout={() => scrollRef.current?.scrollToEnd()}
                                >
                                    {
                                        reports.map((report) =>
                                            <ReportSummary
                                                report={report}
                                                isSelected={selectedReport?.reportID}
                                                key={report.reportID}
                                            />
                                        )
                                    }
                                </ScrollView>
                                {
                                    isClearingSightings && isChangingLostState === 'none' ?
                                        <View style={{ width: 42, height: 42, borderRadius: Radii.ItemRadius, backgroundColor: Colors.Background, position: 'absolute', zIndex: 3, left: '50%', top: '50%', transform: [{ translateX: -21 }, { translateY: -21 }], justifyContent: 'center' }}>
                                            <ActivityIndicator size={'small'} />
                                        </View>
                                        :
                                        null
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', marginTop: Spacing.HalfGap }}>
                                <TouchableOpacity onPress={() => scrollToOffset(-1)} disabled={!canScrollToPrev} style={{ position: 'absolute', left: Spacing.ScreenPadding, padding: Spacing.QuarterGap, paddingRight: Spacing.BigGap, borderRadius: Radii.ItemRadius }}>
                                    <VerticallyCenteringRow>
                                        <PlatformIcon icon={Icons.BACK_ARROW} style={{ opacity: canScrollToPrev ? 1 : Colors.DisabledOpacity  }}/>
                                    </VerticallyCenteringRow>
                                </TouchableOpacity>
                                <Text style={[TextStyles.p, { alignSelf: 'center' }]}>{`${selectedReport.reportIndex + 1} / ${reports.length}`}</Text>
                                <TouchableOpacity onPress={() => scrollToOffset(1)} disabled={!canScrollToNext} style={{ position: 'absolute', right: Spacing.ScreenPadding, padding: Spacing.QuarterGap, paddingLeft: Spacing.BigGap, borderRadius: Radii.ItemRadius }}>
                                    <VerticallyCenteringRow>
                                        <PlatformIcon icon={Icons.FORWARD_ARROW} style={{ opacity: canScrollToNext ? 1 : Colors.DisabledOpacity  }}/>
                                    </VerticallyCenteringRow>
                                </TouchableOpacity>
                            </View>
                        </>
                        :
                        <View style={{ backgroundColor: Colors.PanelColor, marginHorizontal: Spacing.ScreenPadding, marginTop: Spacing.Gap, borderRadius: Radii.ItemRadius, padding: Spacing.Gap }}>

                            <Text
                                style={[TextStyles.p, { textAlign: 'center' }]}
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
    const reversed = [...reports].reverse()
    let field: ExactLocationReportField | null = null
    let firstReport: Report = reversed[0]
    let firstIndex: number = 0
    reversed.every((report, index) => {
        if (isExactLocation(report.fields.EXACT_LOCATION)) {
            field = report.fields.EXACT_LOCATION
            firstReport = report
            firstIndex = index
            return false
        }
        return true
    })

    return { reportID: firstReport.reportID, reportIndex: reversed.length - firstIndex - 1, location: field }
}

function getAllLocations(reports: Report[]): LatLng[] {
    const locations: LatLng[] = []
    for (const report of reports) {
        if (isExactLocation(report.fields.EXACT_LOCATION)) {
            locations.push({
                latitude: report.fields.EXACT_LOCATION.latitude,
                longitude: report.fields.EXACT_LOCATION.longitude
            })
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
            />
            <BackButton />
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>

            </View>
        </View>
    )
}