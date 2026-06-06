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