import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// We know a credit card is 85.60mm wide
const REFERENCE_WIDTH_MM = 85.60;

// Get the device's pixel ratio
const devicePixelRatio = PixelRatio.get();

// Calculate a base scale that adapts to the device's pixel density
// Use a smaller factor for high-density screens to prevent rings from being too large
const densityScale = Platform.select({
    ios: Math.min(devicePixelRatio, 2), // iOS tends to have higher ratios
    android: Math.min(devicePixelRatio, 2.5), // Android can handle slightly larger
    default: devicePixelRatio,
});

// Calculate reference width in pixels, scaled by density
const REFERENCE_WIDTH_PX = SCREEN_WIDTH * (densityScale / 2);

// This gives us our conversion factor
export const MM_TO_PX_RATIO = REFERENCE_WIDTH_PX / REFERENCE_WIDTH_MM;
