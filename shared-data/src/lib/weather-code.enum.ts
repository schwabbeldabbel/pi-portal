export enum WeatherCode {
  ClearSky = 0,

  MainlyClear = 1,
  PartlyCloudy = 2,
  Overcast = 3,

  Fog = 45,
  DepositingRimeFog = 48,

  DrizzleLight = 51,
  DrizzleModerate = 53,
  DrizzleDense = 55,

  FreezingDrizzleLight = 56,
  FreezingDrizzleDense = 57,

  RainSlight = 61,
  RainModerate = 63,
  RainHeavy = 65,

  FreezingRainLight = 66,
  FreezingRainHeavy = 67,

  SnowFallSlight = 71,
  SnowFallModerate = 73,
  SnowFallHeavy = 75,

  SnowGrains = 77,

  RainShowersSlight = 80,
  RainShowersModerate = 81,
  RainShowersViolent = 82,

  SnowShowersSlight = 85,
  SnowShowersHeavy = 86,

  ThunderstormSlightOrModerate = 95,

  ThunderstormWithSlightHail = 96,
  ThunderstormWithHeavyHail = 99,
}

export function getWeatherCodeLabel(code: WeatherCode | number): string {
  switch (code) {
    case WeatherCode.ClearSky:
      return 'Klarer Himmel';

    case WeatherCode.MainlyClear:
      return 'Überwiegend klar';
    case WeatherCode.PartlyCloudy:
      return 'Teilweise bewölkt';
    case WeatherCode.Overcast:
      return 'Bedeckt';

    case WeatherCode.Fog:
      return 'Nebel';
    case WeatherCode.DepositingRimeFog:
      return 'Reifnebel';

    case WeatherCode.DrizzleLight:
      return 'Leichter Nieselregen';
    case WeatherCode.DrizzleModerate:
      return 'Mäßiger Nieselregen';
    case WeatherCode.DrizzleDense:
      return 'Starker Nieselregen';

    case WeatherCode.FreezingDrizzleLight:
      return 'Leichter gefrierender Nieselregen';
    case WeatherCode.FreezingDrizzleDense:
      return 'Starker gefrierender Nieselregen';

    case WeatherCode.RainSlight:
      return 'Leichter Regen';
    case WeatherCode.RainModerate:
      return 'Mäßiger Regen';
    case WeatherCode.RainHeavy:
      return 'Starker Regen';

    case WeatherCode.FreezingRainLight:
      return 'Leichter gefrierender Regen';
    case WeatherCode.FreezingRainHeavy:
      return 'Starker gefrierender Regen';

    case WeatherCode.SnowFallSlight:
      return 'Leichter Schneefall';
    case WeatherCode.SnowFallModerate:
      return 'Mäßiger Schneefall';
    case WeatherCode.SnowFallHeavy:
      return 'Starker Schneefall';

    case WeatherCode.SnowGrains:
      return 'Schneegriesel';

    case WeatherCode.RainShowersSlight:
      return 'Leichte Regenschauer';
    case WeatherCode.RainShowersModerate:
      return 'Mäßige Regenschauer';
    case WeatherCode.RainShowersViolent:
      return 'Heftige Regenschauer';

    case WeatherCode.SnowShowersSlight:
      return 'Leichte Schneeschauer';
    case WeatherCode.SnowShowersHeavy:
      return 'Starke Schneeschauer';

    case WeatherCode.ThunderstormSlightOrModerate:
      return 'Leichtes oder mäßiges Gewitter';

    case WeatherCode.ThunderstormWithSlightHail:
      return 'Gewitter mit leichtem Hagel';
    case WeatherCode.ThunderstormWithHeavyHail:
      return 'Gewitter mit starkem Hagel';

    default:
      return 'Unbekannter Wettercode';
  }
}

const weatherColorMapOpacity = 0.3;

export const weatherColorMap: Record<number, string> = {
  [WeatherCode.ClearSky]: `rgba(255, 193, 7, ${weatherColorMapOpacity})`,
  [WeatherCode.MainlyClear]: `rgba(255, 214, 79, ${weatherColorMapOpacity})`,
  [WeatherCode.PartlyCloudy]: `rgba(203, 226, 230, ${weatherColorMapOpacity})`,
  [WeatherCode.Overcast]: `rgba(120, 144, 156, ${weatherColorMapOpacity})`,

  [WeatherCode.Fog]: `rgba(189, 189, 189, ${weatherColorMapOpacity})`,
  [WeatherCode.DepositingRimeFog]: `rgba(207, 216, 220, ${weatherColorMapOpacity})`,

  [WeatherCode.DrizzleLight]: `rgba(129, 212, 250, ${weatherColorMapOpacity})`,
  [WeatherCode.DrizzleModerate]: `rgba(79, 195, 247, ${weatherColorMapOpacity})`,
  [WeatherCode.DrizzleDense]: `rgba(41, 182, 246, ${weatherColorMapOpacity})`,

  [WeatherCode.FreezingDrizzleLight]: `rgba(144, 202, 249, ${weatherColorMapOpacity})`,
  [WeatherCode.FreezingDrizzleDense]: `rgba(100, 181, 246, ${weatherColorMapOpacity})`,

  [WeatherCode.RainSlight]: `rgba(66, 164, 245, ${weatherColorMapOpacity})`,
  [WeatherCode.RainModerate]: `rgba(30, 136, 229, ${weatherColorMapOpacity})`,
  [WeatherCode.RainHeavy]: `rgba(21, 101, 192, ${weatherColorMapOpacity})`,

  [WeatherCode.FreezingRainLight]: `rgba(92, 107, 192, ${weatherColorMapOpacity})`,
  [WeatherCode.FreezingRainHeavy]: `rgba(63, 81, 181, ${weatherColorMapOpacity})`,

  [WeatherCode.SnowFallSlight]: `rgba(224, 247, 250, ${weatherColorMapOpacity})`,
  [WeatherCode.SnowFallModerate]: `rgba(179, 229, 252, ${weatherColorMapOpacity})`,
  [WeatherCode.SnowFallHeavy]: `rgba(129, 212, 250, ${weatherColorMapOpacity})`,
  [WeatherCode.SnowGrains]: `rgba(240, 248, 255, ${weatherColorMapOpacity})`,

  [WeatherCode.RainShowersSlight]: `rgba(3, 169, 244, ${weatherColorMapOpacity})`,
  [WeatherCode.RainShowersModerate]: `rgba(2, 136, 209, ${weatherColorMapOpacity})`,
  [WeatherCode.RainShowersViolent]: `rgba(1, 87, 155, ${weatherColorMapOpacity})`,

  [WeatherCode.SnowShowersSlight]: `rgba(186, 230, 253, ${weatherColorMapOpacity})`,
  [WeatherCode.SnowShowersHeavy]: `rgba(125, 211, 252, ${weatherColorMapOpacity})`,

  [WeatherCode.ThunderstormSlightOrModerate]: `rgba(255, 152, 0, ${weatherColorMapOpacity})`,
  [WeatherCode.ThunderstormWithSlightHail]: `rgba(255, 112, 67, ${weatherColorMapOpacity})`,
  [WeatherCode.ThunderstormWithHeavyHail]: `rgba(244, 67, 54, ${weatherColorMapOpacity})`,
};