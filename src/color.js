import { allow } from '@toolz/allow';

const Color = () => {
   allow.setFailureBehavior(allow.failureBehavior.WARN);
   let image = null;
   let lightInsensitivity = 200;
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
   
   const getClosestColorInThePalette = (referenceColor = rgbModel) => {
      allow.anInstanceOf(referenceColor, rgbModel);
      if (palette.length === 0) {
         console.warn('Colors must first be added to the palette!');
         return false;
      }
      const referenceCoordinates = getCoordinates(referenceColor);
      let closestColor = {};
      let shortestDistance = Number.MAX_SAFE_INTEGER;
      palette.forEach(paletteColor => {
         const paletteCoordinates = getCoordinates(paletteColor);
         const xDifferenceSquared = Math.pow((referenceCoordinates.x - paletteCoordinates.x), 2);
         const yDifferenceSquared = Math.pow((referenceCoordinates.y - paletteCoordinates.y), 2);
         const zDifferenceSquared = Math.pow((referenceCoordinates.z - paletteCoordinates.z), 2);
         const distance = Math.sqrt(xDifferenceSquared + yDifferenceSquared + zDifferenceSquared);
         if (distance < shortestDistance) {
            shortestDistance = distance;
            closestColor = paletteColor;
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
   
   const is = {
      not: {empty: 1},
      positive: 1,
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
      getClosestColorInThePalette,
      getCoordinates,
      getImage,
      getLightInsensitivity,
      getPalette,
      removeColorFromPalette,
      removeColorsFromPalette,
      setImage,
      setLightInsensitivity,
   };
};

export const color = Color();
