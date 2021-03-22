import { allow } from '@toolz/allow';
import { baseHeavyBodyAcrylicPaints, halfWhiteHeavyBodyAcrylicPaints } from './heavy.body.acrylic.paints';

const Color = () => {
   allow.setFailureBehavior(allow.failureBehavior.WARN);
   let closestColors = {};
   let currentAlgorithm = 0;
   let image = null;
   let lightInsensitivity = 100;
   const algorithm = {
      HSV_3D: 0,
      HSV_SIMPLE: 1,
      RGB_SIMPLE: 2,
      RGB_SQUARED: 3,
   };
   let palette = [];
   const rgbModel = {
      blue: 0,
      green: 0,
      name: '',
      red: 0,
   };
   
   const addColorToPalette = (color = rgbModel) => {
      allow.anInstanceOf(color, rgbModel);
      palette.push(color);
      return palette;
   };
   
   const addColorsToPalette = (colors = [rgbModel]) => {
      allow.anArrayOfInstances(colors, rgbModel);
      palette = palette.concat(colors);
      return palette;
   };
   
   const calculateAverageColor = (imageData = {}) => {
      allow.anObject(imageData, is.not.empty);
      const reds = [];
      const greens = [];
      const blues = [];
      for (let x = 0; x < imageData.width; x++) {
         for (let y = 0; y < imageData.height; y++) {
            const pixel = getPixelObjectFromImageData(imageData, x, y);
            reds.push(pixel.red[0]);
            greens.push(pixel.green[0]);
            blues.push(pixel.blue[0]);
         }
      }
      const redSum = reds.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      const greenSum = greens.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      const blueSum = blues.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      return {
         red: redSum / reds.length,
         green: greenSum / greens.length,
         blue: blueSum / blues.length,
      };
   };
   
   const getAlgorithm = () => currentAlgorithm;
   
   const getClosestColorInThePalette = (referenceColor = rgbModel) => {
      allow.anInstanceOf(referenceColor, rgbModel);
      if (palette.length === 0) {
         console.warn('Colors must first be added to the palette!');
         return false;
      }
      const key = `${referenceColor.red},${referenceColor.green},${referenceColor.blue}`;
      if (closestColors[key])
         return closestColors[key];
      const referenceCoordinates = getCoordinates(referenceColor);
      let closestColor = {
         blue: -1,
         green: -1,
         name: '',
         red: -1,
      };
      let shortestDistance = Number.MAX_SAFE_INTEGER;
      palette.forEach(paletteColor => {
         if (shortestDistance === 0)
            return;
         let distance;
         switch (currentAlgorithm) {
            case algorithm.HSV_3D:
               const paletteCoordinates = getCoordinates(paletteColor);
               const xDifferenceSquared = Math.pow((referenceCoordinates.x - paletteCoordinates.x), 2);
               const yDifferenceSquared = Math.pow((referenceCoordinates.y - paletteCoordinates.y), 2);
               const zDifferenceSquared = Math.pow((referenceCoordinates.z - paletteCoordinates.z), 2);
               distance = Math.sqrt(xDifferenceSquared + yDifferenceSquared + zDifferenceSquared);
               break;
            case algorithm.HSV_SIMPLE:
               const paletteHsv = getHsvObjectFromRgbObject(paletteColor);
               const referenceHsv = getHsvObjectFromRgbObject(referenceColor);
               distance = Math.abs(paletteHsv.hue - referenceHsv.hue) + Math.abs(paletteHsv.saturation - referenceHsv.saturation) + Math.abs(paletteHsv.value - referenceHsv.value);
               break;
            case algorithm.RGB_SQUARED:
               distance = Math.pow((paletteColor.red - referenceColor.red), 2) + Math.pow((paletteColor.green - referenceColor.green), 2) + Math.pow((paletteColor.blue - referenceColor.blue), 2);
               break;
            case algorithm.RGB_SIMPLE:
            default:
               distance = Math.abs(paletteColor.red - referenceColor.red) + Math.abs(paletteColor.green - referenceColor.green) + Math.abs(paletteColor.blue - referenceColor.blue);
               break;
         }
         if (distance < shortestDistance) {
            shortestDistance = distance;
            closestColor = paletteColor;
            closestColors[key] = paletteColor;
         }
      });
      return closestColor;
   };

   const getCoordinates = (rgbObject = rgbModel) => {
      allow.anInstanceOf(rgbObject, rgbModel);
      const hsvObject = getHsvObjectFromRgbObject(rgbObject);
      const theta = hsvObject.hue * 2 * Math.PI;
      const maxRadius = lightInsensitivity / 2;
      const radius = hsvObject.saturation * maxRadius;
      const x = radius * Math.cos(theta) + maxRadius;
      const y = radius * Math.sin(theta) + maxRadius;
      return {
         x,
         y,
         z: hsvObject.value * 100,
      };
   };
   
   const getHsvObjectFromRgbObject = (rgbObject = rgbModel) => {
      allow.anInstanceOf(rgbObject, rgbModel);
      const red = rgbObject.red / 255;
      const green = rgbObject.green / 255;
      const blue = rgbObject.blue / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      let hue = max;
      const value = max;
      const range = max - min;
      const saturation = max === 0 ? 0 : range / max;
      if (max === min) {
         hue = 0;
      } else {
         if (max === red)
            hue = (green - blue) / range + (green < blue ? 6 : 0);
         else if (max === green)
            hue = (blue - red) / range + 2;
         else if (max === blue)
            hue = (red - green) / range + 4;
         hue = hue / 6;
      }
      return {
         hue,
         saturation,
         value,
      };
   };
   
   const getImage = () => image;
   
   const getLightInsensitivity = () => lightInsensitivity;
   
   const getPalette = () => palette;
   
   const getPixelIndex = (x = -1, y = -1, imageWidth = -1) => {
      allow.anInteger(x, is.not.negative).anInteger(y, is.not.negative).anInteger(imageWidth, is.positive);
      return ((imageWidth * y) + x) * 4;
   };
   
   const getPixelObjectFromImageData = (imageData = {}, x = -1, y = -1) => {
      allow.anObject(imageData).anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      const index = getPixelIndex(x, y, imageData.width);
      return {
         alpa: [imageData.data[index + 3], index + 3],
         blue: [imageData.data[index + 2], index + 2],
         green: [imageData.data[index + 1], index + 1],
         red: [imageData.data[index], index],
         x,
         y,
      };
   };
   
   const is = {
      not: {
         empty: 1,
         negative: 0,
      },
      positive: 1,
   };
   
   const pixelate = (canvas = {}, blockSize = 0, matchToPalette = true) => {
      allow.anObject(canvas, is.not.empty).anInteger(blockSize, is.positive).aBoolean(matchToPalette);
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const stats = {};
      for (let y = 0; y < imageData.height; y += blockSize) {
         for (let x = 0; x < imageData.width; x += blockSize) {
            const remainingX = imageData.width - x;
            const remainingY = imageData.height - y;
            const blockX = remainingX > blockSize ? blockSize : remainingX;
            const blockY = remainingY > blockSize ? blockSize : remainingY;
            const averageColor = calculateAverageColor(context.getImageData(x, y, blockX, blockY));
            const referenceColor = {
               blue: averageColor.blue,
               green: averageColor.green,
               red: averageColor.red,
               name: '',
            };
            const color = matchToPalette ? getClosestColorInThePalette(referenceColor) : averageColor;
            if (color.name) {
               if (stats.hasOwnProperty(color.name))
                  stats[color.name]++;
               else
                  stats[color.name] = 1;
            }
            context.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            context.fillRect(x, y, blockX, blockY);
         }
      }
      return stats;
   };
   
   const removeColorFromPalette = (color = rgbModel) => {
      allow.anInstanceOf(color, rgbModel);
      palette = palette.filter(paletteColor => !(paletteColor.red === color.red && paletteColor.green === color.green && paletteColor.blue === color.blue && paletteColor.name === color.name));
      return palette;
   };
   
   const removeColorsFromPalette = (colors = [rgbModel]) => {
      allow.anArrayOfInstances(colors, rgbModel);
      colors.forEach(color => removeColorFromPalette(color));
      return palette;
   };
   
   const setAlgorithm = (matchingAlgorithm = -1) => {
      allow.oneOf(matchingAlgorithm, algorithm);
      currentAlgorithm = matchingAlgorithm;
      return currentAlgorithm;
   };
   
   const setImage = (newImage = '') => {
      allow.aString(newImage, is.not.empty);
      image = newImage;
      return image;
   };
   
   const setLightInsensitivity = (insensitivity = 0) => {
      allow.aNumber(insensitivity, is.positive);
      lightInsensitivity = insensitivity;
      return lightInsensitivity;
   };
   
   return {
      addColorsToPalette,
      addColorToPalette,
      algorithm,
      baseHeavyBodyAcrylicPaints,
      getAlgorithm,
      getClosestColorInThePalette,
      getCoordinates,
      getImage,
      getLightInsensitivity,
      getPalette,
      halfWhiteHeavyBodyAcrylicPaints,
      heavyBodyAcrylicPaints: [...baseHeavyBodyAcrylicPaints, ...halfWhiteHeavyBodyAcrylicPaints],
      pixelate,
      removeColorFromPalette,
      removeColorsFromPalette,
      setAlgorithm,
      setImage,
      setLightInsensitivity,
   };
};

export const color = Color();
