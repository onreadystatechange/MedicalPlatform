/**
 * Created by yjy on 2017/10/12.
 */
import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native'

const PlatformInfo = {
    sizeObj: Dimensions.get('window'),
    pixels: 2,
    width: () => {
        return PlatformInfo.sizeObj.width;
    },
    height: () => {
        return PlatformInfo.sizeObj.height - (Platform.OS === "android" ? StatusBar.currentHeight : 0);
    },
    pixel: px => {
        if (!PlatformInfo.pixels) {
            PlatformInfo.pixels = PixelRatio.get();
        }
        return px / PlatformInfo.pixels;
    }
};

const CSS = {
    pixel: PlatformInfo.pixel,
    width: PlatformInfo.width,
    height: PlatformInfo.height
};

const px = CSS.pixel;
const width = CSS.width();
const height = CSS.height();

export {px, width, height}