import { NativeModules } from 'react-native';
const { LocationCoder } = NativeModules;

interface CodedLocation {
    feature: string
    position: {
        lat: number
        lng: number
    }
    country: string
    countryCode: string
    locality: string
    subLocality: string
    streetName: string
    streetNumber: string
    postalCode: string
    adminArea: string
    subAdminArea: string
    formattedAddress: string
}

interface LocationCoderInterface {
    geocodePosition(position: { lat: number, lng: number }): Promise<CodedLocation[]>
}

export default LocationCoder as LocationCoderInterface;