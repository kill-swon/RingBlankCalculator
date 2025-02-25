import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// We know a credit card is 85.60mm wide
const REFERENCE_WIDTH_MM = 85.60;

// Get the device's pixel ratio
const devicePixelRatio = PixelRatio.get();

// Calculate a base scale that adapts to the device's pixel density
const densityScale = Platform.select({
    ios: Math.min(devicePixelRatio, 2), // iOS tends to have higher ratios
    android: Math.min(devicePixelRatio, 2.5), // Android can handle slightly larger
    default: devicePixelRatio,
});

// Calculate reference width in pixels, scaled by density
const REFERENCE_WIDTH_PX = SCREEN_WIDTH * (densityScale / 2);

// Calculate the conversion factor
const MM_TO_PX_RATIO = REFERENCE_WIDTH_PX / REFERENCE_WIDTH_MM;

// Export as a default object containing all constants
export default {
    MM_TO_PX_RATIO,
    SCREEN_WIDTH,
    REFERENCE_WIDTH_MM,
    devicePixelRatio,
    densityScale,
    REFERENCE_WIDTH_PX
};
