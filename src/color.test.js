import { heavyBodyAcrylicPaints } from './heavy.body.acrylic.paints';
import { color } from './color';

test('check accuracy of paint colors', () => {
   expect(heavyBodyAcrylicPaints.length).toEqual(203);
   expect(heavyBodyAcrylicPaints[50].name).toEqual('Liquitex: Light Blue Permanent');
   expect(heavyBodyAcrylicPaints[50].red).toEqual(75);
   expect(heavyBodyAcrylicPaints[50].green).toEqual(197);
   expect(heavyBodyAcrylicPaints[50].blue).toEqual(240);
   expect(heavyBodyAcrylicPaints[150].name).toEqual('Golden: Neutral Gray N5');
   expect(heavyBodyAcrylicPaints[150].red).toEqual(116);
   expect(heavyBodyAcrylicPaints[150].green).toEqual(116);
   expect(heavyBodyAcrylicPaints[150].blue).toEqual(116);
});

test('palette can be updated', () => {
   expect(color.getPalette()).toEqual([]);
   color.addColorToPalette({
      red: 40,
      green: 50,
      blue: 60,
      name: 'testIt',
   });
   expect(color.getPalette()).toEqual([{
      red: 40,
      green: 50,
      blue: 60,
      name: 'testIt',
   }]);
   color.removeColorFromPalette({
      red: 40,
      green: 50,
      blue: 60,
      name: 'testIt',
   });
   expect(color.getPalette()).toEqual([]);
   color.addColorsToPalette(heavyBodyAcrylicPaints);
   expect(color.getPalette()).toEqual(heavyBodyAcrylicPaints);
});

test('lightInsensitivity can be updated', () => {
   expect(color.getLightInsensitivity()).toEqual(200);
   color.setLightInsensitivity(1000);
   expect(color.getLightInsensitivity()).toEqual(1000);
   color.setLightInsensitivity(200);
});

test('close colors can be retrieved', () => {
   expect(color.getClosestColorInThePalette({
      red: 255,
      green: 0,
      blue: 0,
      name: '',
   })).toEqual({
      red: 219,
      green: 40,
      blue: 33,
      name: 'Liquitex: Naphthol Red Light',
   });
   expect(color.getClosestColorInThePalette({
      red: 0,
      green: 255,
      blue: 0,
      name: '',
   })).toEqual({
      red: 80,
      green: 204,
      blue: 81,
      name: 'Golden: Light Green (Blue Shade)',
   });
   expect(color.getClosestColorInThePalette({
      red: 0,
      green: 0,
      blue: 255,
      name: '',
   })).toEqual({
      red: 27,
      green: 61,
      blue: 169,
      name: 'Golden: Cobalt Blue',
   });
});
