import { baseHeavyBodyAcrylicPaints } from './heavy.body.acrylic.paints';
import { color } from './color';

test('check accuracy of paint colors', () => {
   expect(baseHeavyBodyAcrylicPaints.length).toEqual(203);
   expect(baseHeavyBodyAcrylicPaints[50].name).toEqual('Liquitex: Light Blue Permanent');
   expect(baseHeavyBodyAcrylicPaints[50].red).toEqual(73);
   expect(baseHeavyBodyAcrylicPaints[50].green).toEqual(165);
   expect(baseHeavyBodyAcrylicPaints[50].blue).toEqual(215);
   expect(baseHeavyBodyAcrylicPaints[150].name).toEqual('Golden: Neutral Gray N5');
   expect(baseHeavyBodyAcrylicPaints[150].red).toEqual(90);
   expect(baseHeavyBodyAcrylicPaints[150].green).toEqual(90);
   expect(baseHeavyBodyAcrylicPaints[150].blue).toEqual(90);
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
   color.addColorsToPalette(baseHeavyBodyAcrylicPaints);
   expect(color.getPalette()).toEqual(baseHeavyBodyAcrylicPaints);
});

test('lightInsensitivity can be updated', () => {
   expect(color.getLightInsensitivity()).toEqual(100);
   color.setLightInsensitivity(1000);
   expect(color.getLightInsensitivity()).toEqual(1000);
   color.setLightInsensitivity(100);
});

test('image can be updated', () => {
   expect(color.getImage()).toEqual(null);
   color.setImage('/static/media/some.image.35b26ddf.svg');
   expect(color.getImage()).toEqual('/static/media/some.image.35b26ddf.svg');
});
