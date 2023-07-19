import React from 'react'
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Modal, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LatLng } from "react-native-maps";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { ExactLocationReportField, isExactLocation, Report } from "../../backend/databaseTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { VerticallyCenteringRow } from "../../ui-base/layouts";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "../../components/items/ReportSummary";
import { ModalFormScreenBase } from "../../ui-base/containers";
import { Colors } from "../../ui-base/colors";
import ItemProfile from "../../components/items/ItemProfile";
import { ContextMenuButton } from "react-native-ios-context-menu";
import BackButton from "../../components/BackButton";
import { clearReports, editItemDetails, removeItem, setItemIsFound } from "../../reducers/items";
import PrimaryActionButton from "../../components/PrimaryActionButton";
import ItemDetailsForm from "../../components/items/ItemDetailsForm";
import MarkAsLost from "../MarkAsLost";
import { viewReport } from '../../reducers/reports';
import SightingMap from '../../components/SightingMap';
import IconButton from '../../components/IconButton';
import { Radii } from '../../ui-base/radii';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'
import ContextMenu from "react-native-context-menu-view";
import PlatformIcon, { Icons } from '../../components/PlatformIcon';
import EditItemDetails from '../editing-items/EditItemDetails';

export default function ItemDetails(props: ItemDetailsProps) {

    const dispatch = useAppDispatch()

    const itemID = props.route.params.itemID
    const item = useAppSelector((state) => state.items.items[itemID])
    const reports = item ? Object.values(useAppSelector((state) => state.reports.reports[item.itemID]) || { }) : []
    const locations = getAllLocations(reports)
    const [selectedReport, setSelectedReport] = useState(getInitialState(reports))
    const windowWidth = useWindowDimensions().width
    const scrollRef = useRef<ScrollView>(null)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const [isChangingLostState, setIsChangingLostState] = useState<'none' | 'set-lost' | 'set-found'>('none')
    const [isClearingSightings, setIsClearingSightings] = useState(false)
    const [isPresentingEditModal, setIsPresentingEditModal] = useState(false)
    const [isPresentingMarkAsLostModal, setIsPresentingMarkAsLostModal] = useState(false)

    reports.sort((a, b) => a.timeOfCreation - b.timeOfCreation)

    useEffect(() => {

        // Handles independent changes to lost state

        if (isClearingSightings) {
            return
        }
        
        if (item.isMissing && isChangingLostState === 'set-lost') {
            setIsChangingLostState('none')
            setIsPresentingMarkAsLostModal(false)
        }

        if ( ! item.isMissing && isChangingLostState === 'set-found') {
            setIsChangingLostState('none')
        }
    }, [item.isMissing])

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

        // Handles the combined set-found and sight clearing

        if (isChangingLostState === 'set-found' && isClearingSightings) {
            if ( ! item.isMissing && reports.length === 0) {
                setIsChangingLostState('none')
                setIsClearingSightings(false)
            }
        }

    }, [item.isMissing, reports.length])

    useEffect(() => {
        if ( ! selectedReport && reports.length) {
            setSelectedReport(getInitialState(reports))
        }
        else if (selectedReport && ! reports.length) {
            setSelectedReport(null)
        }
    }, [reports])

    const onEditSubmit = async (name: string, icon: string, emailNotifications:boolean, pushNotifications:boolean) => {
        await dispatch(editItemDetails({ name, icon, itemID: item.itemID, emailNotifications:emailNotifications,pushNotifications:pushNotifications }))
        setIsPresentingEditModal(false)
    }

    

    const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        if (reports.length === 0) {
            setSelectedReport(null)
        }

        let index = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / windowWidth), reports.length - 1))

        if (index === selectedReport?.reportIndex) {
            return
        }

        if ( ! reports[index]) {
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
        await analytics().logEvent('new_selected_report', {newSelectedReport})
        setSelectedReport(newSelectedReport)
    }

    const scrollToOffset = (offset: number) => {
        
        if ( ! selectedReport) {
            return
        }

        scrollToIndex(selectedReport.reportIndex + offset)
    }

    const scrollToIndex = (index: number) => {

        if ( ! selectedReport) {
            return
        }

        const newIndex = Math.max(Math.min(index, reports.length - 1), 0)
        const position = newIndex * windowWidth
        scrollRef.current?.scrollTo({ x: position, animated: true })
    }

    useEffect(() => {
        if ( ! selectedReport) {
            return
        }

        if ( ! selectedReport.reportID) {
            return
        }

        dispatch(viewReport({ reportID: selectedReport.reportID, itemID: itemID, userID: item.ownerID }))
    }, [selectedReport])

    const handleChangeLostState = async () => {
        
        // If the item isn't missing, we're setting it as lost, hand over control to the modal
        if ( ! item.isMissing) {
            console.log("analytics --- set item lost")
            await analytics().logEvent('item_marked_lost', item)
            setIsChangingLostState('set-lost')
            setIsPresentingMarkAsLostModal(true)
            return
        }

        // Else, we're setting it as found
        setIsChangingLostState('set-found')
        console.log("analytics --- set item found")
        await analytics().logEvent('item_marked_found', item)

        const handleSetItemIsFound = async (clearRecentReports: boolean) => {

            if (clearRecentReports) {
                setIsClearingSightings(true)
            }

            const result = await dispatch(setItemIsFound({ itemID: item.itemID, clearRecentReports }))

            // If the action fails, we need to disable loading immediately.
            // Else, we wait for the effect to happen to disable loading to
            // prevent flicker.
            if (result.meta.requestStatus === 'rejected') {
                setIsChangingLostState('none')
                setIsClearingSightings(false)
            }
        }

        // If there are no reports, we can set the item as found immediately
        if (reports.length === 0) {
            handleSetItemIsFound(false)
            return
        }

        // Else, we need to ask whether to clear old sightings
        Alert.alert(
            `Great!`,
            `Do you want to clear this item's old sightings?`,
            [
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => handleSetItemIsFound(true)
                },
                {
                    text: 'No',
                    onPress: () => handleSetItemIsFound(false)
                }
            ]
        )
    }

    const handleRequestDirections = async () => {
        if ( ! selectedReport || ! selectedReport.location || ! item) {
            return
        }
        await analytics().logEvent('open_in_maps', selectedReport)
        openLocationInMaps({ lat: selectedReport.location.latitude, lng: selectedReport.location.longitude, label: `${item.name} location` })
    }

    const handleClearSightings = () => {
        Alert.alert(
            'Do you want to clear all sightings?',
            'You cannot undo this action',
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
            'You cannot undo this action, but you can always reuse your tag',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        dispatch(removeItem(item.itemID));
                        props.navigation.goBack()
                    }
                }
            ]
        );
    }

    const canScrollToNext = (selectedReport != null) && selectedReport.reportIndex < reports.length - 1
    const canScrollToPrev = (selectedReport != null) && selectedReport.reportIndex > 0

    if ( ! item) {
        return <EmptyItemDetails />
    }

    return (
        <View style={{ padding: 0, paddingBottom: Math.max(safeAreaInsets?.bottom ?? 0, Spacing.ScreenPadding), backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap 
                locations={locations} 
                primaryLocation={selectedReport ? selectedReport.location : null} 
                itemIcon={item.icon}
                selectReportAtIndex={scrollToIndex} 
            />
            <BackButton />
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>
                <View style={{ paddingVertical: Spacing.BigGap, paddingHorizontal: Spacing.ScreenPadding }}>
                    <ItemProfile {...item} />
                </View>
                <VerticallyCenteringRow style={{ paddingRight: Spacing.Gap }}>
                    <PrimaryActionButton 
                        label={item.isMissing ? 'Set as Found' : 'Set as Lost'}
                        icon={<PlatformIcon icon={item.isMissing ? Icons.SEAL : Icons.ALERT} style={{ color: item.isMissing ? Colors.TextColor : Colors.Red }} />}
                        textSyle={{ color: item.isMissing ? Colors.TextColor : Colors.Red }}
                        isLoading={isChangingLostState !== 'none'}
                        onPress={handleChangeLostState}
                        
                    />
                    <PrimaryActionButton
                        label='Directions'
                        icon={<PlatformIcon icon={Icons.MAP} />}
                        disabled={ ! selectedReport || ! selectedReport.location}
                        onPress={handleRequestDirections}
                    />
                    <MoreButton handleRemoveItem={handleRemoveItem} presentEditModal={() => setIsPresentingEditModal(true)} />
                </VerticallyCenteringRow>
                {
                    selectedReport && reports.length > 0 ?
                        <>
                            <VerticallyCenteringRow style={{ marginTop: Spacing.BigGap, paddingRight: Spacing.ScreenPadding }}>
                                <Text style={[TextStyles.h3, { marginLeft: Spacing.ScreenPadding }]}>Sightings</Text>
                                <IconButton icon={<PlatformIcon icon={Icons.TRASH} />} onPress={handleClearSightings} disabled={isClearingSightings} />
                            </VerticallyCenteringRow>
                            <View style={{ position: 'relative' }}>
                                <ScrollView 
                                    horizontal={true}
                                    pagingEnabled
                                    style={{ zIndex: 2, paddingTop: Spacing.ThreeQuartersGap, paddingBottom: reports.length > 1 ? Spacing.ThreeQuartersGap : 0 }}
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
                            {
                                reports.length > 1 ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
                                        <TouchableOpacity onPress={() => scrollToOffset(-1)} disabled={ ! canScrollToPrev} style={{ position: 'absolute', left: Spacing.ScreenPadding }}>
                                            <Text style={[TextStyles.h4, { opacity: canScrollToPrev ? 1 : Colors.DisabledOpacity }]}> <Icon style={[TextStyles.h4, { opacity: canScrollToPrev ? 1 : Colors.DisabledOpacity }]} name="ios-chevron-back"/> Previous</Text>
                                        </TouchableOpacity>
                                        <Text style={[TextStyles.p2, { alignSelf: 'center' }]}>{`${selectedReport.reportIndex + 1} / ${reports.length}`}</Text>
                                        <TouchableOpacity onPress={() => scrollToOffset(1)} disabled={ ! canScrollToNext} style={{ position: 'absolute', right: Spacing.ScreenPadding }}>
                                            <Text style={[TextStyles.h4, { opacity: canScrollToNext ? 1 : Colors.DisabledOpacity }]}>Next {<Icon style = {[TextStyles.h4, { opacity: canScrollToNext ? 1 : Colors.DisabledOpacity }]} name='ios-chevron-forward'/>}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                            }
                        </> :
                        <>
                            <Text 
                                style={[TextStyles.p, { marginHorizontal: Spacing.ScreenPadding * 3, marginTop: Spacing.BigGap, textAlign: 'center' }]}
                            >
                                {
                                    item.isMissing ? 
                                        `Nobody has spotted this item yet. You'll be notified when it's spotted.` : 
                                        `Nobody has spotted this item yet. If you want to be notified when it's spotted, set it as lost.`
                                }
                                
                            </Text>
                        </>
                }
                
            </View>
            <Modal
                animationType='fade'
                presentationStyle='overFullScreen'
                transparent={true}
                visible={isPresentingEditModal}
                onRequestClose={() => {
                    setIsPresentingEditModal(false)
                }}>
                <ModalFormScreenBase closeModal={() => setIsPresentingEditModal(false)}>
                    <EditItemDetails 
                        onSubmit={onEditSubmit}
                        currentValues={{ name: item.name, icon: item.icon, emailNotifications:item.emailNotifications, pushNotifications:item.pushNotifications }}
                        onCancel={() => setIsPresentingEditModal(false)}
                    />
                </ModalFormScreenBase>
            </Modal>
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

async function openLocationInMaps({ lat, lng, label }: { lat: number, lng: number, label: string }) {
    const scheme = Platform.select({ ios: 'http://maps.apple.com/?q=', android: 'geo:0,0?q=' })
    const latLng = `${lat},${lng}`
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    })

    if ( ! url) {
        console.error('could not generate url')
        return
    }
    console.warn(url)
    console.log("analytics --- open maps")
    await analytics().logEvent('open_directions', {lat:lat, lng:lng, label:label})
    Linking.openURL(url)
}

function MoreButton(props: { presentEditModal: () => void, handleRemoveItem: () => void }) {    
    return <ContextMenu
        actions={[{title:"Edit Item", systemIcon: 'pencil'},{title:"Remove Item", systemIcon: 'trash'}]}
        onPress={({ nativeEvent }) => {
            console.log(nativeEvent)
            if (nativeEvent.name === 'Edit Item') {
                props.presentEditModal()
            }
            else {
                props.handleRemoveItem()
            }
        } }
        style={{ flex: 1 }}
        dropdownMenuMode ={true}
    >
        <PrimaryActionButton
            label='More'
            icon={<PlatformIcon icon={Icons.MORE} />}
            onPress={() => { } }
        />
    </ContextMenu>
}

function EmptyItemDetails() {

    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

    return (
        <View style={{ padding: 0, paddingBottom: safeAreaInsets?.bottom, backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap 
                locations={null} 
                primaryLocation={null} 
                itemIcon={' '}
                selectReportAtIndex={() => { }} 
            />
            <BackButton />
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>
                
            </View>
        </View>
    )
}