import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { PvEntity } from '../../entities/PvEntity';
import { WeatherEntity } from '../../entities/WeatherEntity';

type TimeBucketKey =
  | 'morning'
  | 'forenoon'
  | 'midday'
  | 'afternoon'
  | 'evening';

type BucketDefinition = {
  key: TimeBucketKey;
  source: string;
  startHour: number;
};

type PvAverages = {
  voltage: number;
  current: number;
  power: number;
  shuntVoltageMv: number;
};

type WeatherSummary = {
  temperature_2m: number;
  apparent_temperature: number;
  precipitation: number;
  cloud_cover: number;
  wind_speed_10m: number;
  weather_code: number;
};

export class DbCleanupService {
  
  private static readonly BUCKET_DEFINITIONS: BucketDefinition[] = [
    { key: 'morning', source: 'summary_morning', startHour: 0 },
    { key: 'forenoon', source: 'summary_forenoon', startHour: 7 },
    { key: 'midday', source: 'summary_midday', startHour: 13 },
    { key: 'afternoon', source: 'summary_afternoon', startHour: 16 },
    { key: 'evening', source: 'summary_evening', startHour: 20 },
  ];

  /**
   * Aggregates raw PV measurements of the previous day into
   * a few summary entries to keep the database small while
   * preserving relevant historic information.
   */
  static async cleanupPvData(): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      const pvRepository = manager.getRepository(PvEntity);
      const { startOfYesterday, startOfToday } = this.getYesterdayRange();

      const entries = await this.loadYesterdayRawEntries(
        pvRepository,
        startOfYesterday,
        startOfToday,
      );

      if (entries.length === 0) {
        console.log('No PV entries to clean up');
        return;
      }

      const groupedEntries = this.groupEntriesByBucket(entries);
      const summaryEntries = this.buildSummaryEntries(
        pvRepository,
        groupedEntries,
        startOfYesterday,
      );

      if (summaryEntries.length > 0) {
        await pvRepository.save(summaryEntries);
      }

      await this.deleteYesterdayRawEntries(
        pvRepository,
        startOfYesterday,
        startOfToday,
      );

      console.log(
        `Saved ${summaryEntries.length} summary entries for ${startOfYesterday.toISOString()}`,
      );
    });
  }

  static async cleanupWeatherData(): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    const weatherRepository = manager.getRepository(WeatherEntity);
    const { startOfYesterday, startOfToday } = this.getYesterdayRange();

    const entries = await this.loadYesterdayRawWeatherEntries(
      weatherRepository,
      startOfYesterday,
      startOfToday,
    );

    if (entries.length === 0) {
      console.log('No weather entries to clean up');
      return;
    }

    const groupedEntries = this.groupWeatherEntriesByBucket(entries);
    const summaryEntries = this.buildWeatherSummaryEntries(
      weatherRepository,
      groupedEntries,
      startOfYesterday,
    );

    if (summaryEntries.length > 0) {
      await weatherRepository.save(summaryEntries);
    }

    await this.deleteYesterdayRawWeatherEntries(
        weatherRepository,
        startOfYesterday,
        startOfToday,
      );

      console.log(
        `Saved ${summaryEntries.length} weather summary entries for ${startOfYesterday.toISOString()}`,
      );
    });
  }

  /**
   * Returns the date range of the previous day:
   * [yesterday 00:00, today 00:00)
   */
  private static getYesterdayRange(): {
    startOfYesterday: Date;
    startOfToday: Date;
  } {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    return { startOfYesterday, startOfToday };
  }

  /**
   * Loads only raw entries from the previous day.
   * Summary entries are excluded by checking the source prefix.
   */
  private static async loadYesterdayRawEntries(
    pvRepository: Repository<PvEntity>,
    startOfYesterday: Date,
    startOfToday: Date,
  ): Promise<PvEntity[]> {
    return await pvRepository
      .createQueryBuilder('pv')
      .where('pv.measuredAt >= :start', { start: startOfYesterday })
      .andWhere('pv.measuredAt < :end', { end: startOfToday })
      .andWhere('pv.source NOT LIKE :summaryPrefix', {
        summaryPrefix: 'summary%',
      })
      .getMany();
  }

  /**
   * Assigns each entry to exactly one time bucket based on its local hour.
   * Rules:
   * 00:00-06:59 -> morning
   * 07:00-12:59 -> forenoon
   * 13:00-15:59 -> midday
   * 16:00-19:59 -> afternoon
   * 20:00-23:59 -> evening
   */
  private static groupEntriesByBucket(
    entries: PvEntity[],
  ): Record<TimeBucketKey, PvEntity[]> {
    const grouped: Record<TimeBucketKey, PvEntity[]> = {
      morning: [],
      forenoon: [],
      midday: [],
      afternoon: [],
      evening: [],
    };

    for (const entry of entries) {
      const bucket = this.getBucketForDate(entry.measuredAt);
      grouped[bucket].push(entry);
    }

    return grouped;
  }

  /**
   * Returns the bucket key for a given date based on its local hour.
   */
  private static getBucketForDate(date: Date): TimeBucketKey {
    const hour = new Date(date).getHours();

    if (hour >= 0 && hour <= 6) {
      return 'morning';
    }

    if (hour >= 7 && hour <= 12) {
      return 'forenoon';
    }

    if (hour >= 13 && hour <= 15) {
      return 'midday';
    }

    if (hour >= 16 && hour <= 19) {
      return 'afternoon';
    }

    return 'evening';
  }

  /**
   * Creates one summary entity per non-empty bucket.
   */
  private static buildSummaryEntries(
    pvRepository: Repository<PvEntity>,
    groupedEntries: Record<TimeBucketKey, PvEntity[]>,
    baseDate: Date,
  ): PvEntity[] {
    const summaries: PvEntity[] = [];

    for (const definition of this.BUCKET_DEFINITIONS) {
      const entries = groupedEntries[definition.key];

      if (entries.length === 0) {
        continue;
      }

      const averages = this.calculateAverages(entries);
      const measuredAt = this.createBucketTimestamp(baseDate, definition.startHour);

      const summary = pvRepository.create({
        voltage: averages.voltage,
        current: averages.current,
        power: averages.power,
        shuntVoltageMv: averages.shuntVoltageMv,
        source: definition.source,
        measuredAt,
      });

      summaries.push(summary);
    }

    return summaries;
  }

  /**
   * Calculates average values for a bucket.
   */
  private static calculateAverages(entries: PvEntity[]): PvAverages {
    const count = entries.length;

    return {
      voltage: entries.reduce((sum, entry) => sum + entry.voltage, 0) / count,
      current: entries.reduce((sum, entry) => sum + entry.current, 0) / count,
      power: entries.reduce((sum, entry) => sum + entry.power, 0) / count,
      shuntVoltageMv:
        entries.reduce((sum, entry) => sum + entry.shuntVoltageMv, 0) / count,
    };
  }

  /**
   * Creates a deterministic timestamp for a bucket on the previous day,
   * e.g. 07:00 for the forenoon summary entry.
   */
  private static createBucketTimestamp(baseDate: Date, hour: number): Date {
    const timestamp = new Date(baseDate);
    timestamp.setHours(hour, 0, 0, 0);
    return timestamp;
  }

  /**
   * Deletes all raw entries of the previous day.
   * Summary entries are preserved by excluding the summary source prefix.
   */
  private static async deleteYesterdayRawEntries(
    pvRepository: Repository<PvEntity>,
    startOfYesterday: Date,
    startOfToday: Date,
  ): Promise<void> {
    await pvRepository
      .createQueryBuilder()
      .delete()
      .from(PvEntity)
      .where('measuredAt >= :start', { start: startOfYesterday })
      .andWhere('measuredAt < :end', { end: startOfToday })
      .andWhere('source NOT LIKE :summaryPrefix', {
        summaryPrefix: 'summary%',
      })
      .execute();
  }

  private static async loadYesterdayRawWeatherEntries(
  weatherRepository: Repository<WeatherEntity>,
  startOfYesterday: Date,
  startOfToday: Date,
  ): Promise<WeatherEntity[]> {
    return await weatherRepository
      .createQueryBuilder('weather')
      .where('weather.measuredAt >= :start', { start: startOfYesterday })
      .andWhere('weather.measuredAt < :end', { end: startOfToday })
      .andWhere('weather.source NOT LIKE :summaryPrefix', {
        summaryPrefix: 'weather_summary%',
      })
      .getMany();
  }

  private static groupWeatherEntriesByBucket(
    entries: WeatherEntity[],
  ): Record<TimeBucketKey, WeatherEntity[]> {
    const grouped: Record<TimeBucketKey, WeatherEntity[]> = {
      morning: [],
      forenoon: [],
      midday: [],
      afternoon: [],
      evening: [],
    };

    for (const entry of entries) {
      const bucket = this.getBucketForDate(entry.measuredAt);
      grouped[bucket].push(entry);
    }

    return grouped;
  }

  private static buildWeatherSummaryEntries(
    weatherRepository: Repository<WeatherEntity>,
    groupedEntries: Record<TimeBucketKey, WeatherEntity[]>,
    baseDate: Date,
  ): WeatherEntity[] {
    const summaries: WeatherEntity[] = [];

    for (const definition of this.BUCKET_DEFINITIONS) {
      const entries = groupedEntries[definition.key];

      if (entries.length === 0) {
        continue;
      }

      const summary = this.calculateWeatherSummary(entries);
      const measuredAt = this.createBucketTimestamp(baseDate, definition.startHour);

      const entity = weatherRepository.create({
        temperature_2m: summary.temperature_2m,
        apparent_temperature: summary.apparent_temperature,
        precipitation: summary.precipitation,
        cloud_cover: summary.cloud_cover,
        wind_speed_10m: summary.wind_speed_10m,
        weather_code: summary.weather_code,
        source: `weather_${definition.source}`,
        measuredAt,
      });

      summaries.push(entity);
    }

    return summaries;
  }

  private static calculateWeatherSummary(
    entries: WeatherEntity[],
  ): WeatherSummary {
    const count = entries.length;

    return {
      temperature_2m:
        entries.reduce((sum, entry) => sum + entry.temperature_2m, 0) / count,
      apparent_temperature:
        entries.reduce((sum, entry) => sum + entry.apparent_temperature, 0) / count,
      precipitation:
        entries.reduce((sum, entry) => sum + entry.precipitation, 0),
      cloud_cover:
        entries.reduce((sum, entry) => sum + entry.cloud_cover, 0) / count,
      wind_speed_10m:
        entries.reduce((sum, entry) => sum + entry.wind_speed_10m, 0) / count,
      weather_code: this.getMostFrequentWeatherCode(
        entries.map((entry) => entry.weather_code),
      ),
    };
  }

  private static getMostFrequentWeatherCode(codes: number[]): number {
    const frequency = new Map<number, number>();
    let mostFrequent = codes[0];
    let maxCount = 0;

    for (const code of codes) {
      const count = (frequency.get(code) ?? 0) + 1;
      frequency.set(code, count);

      if (count > maxCount) {
        maxCount = count;
        mostFrequent = code;
      }
    }

    return mostFrequent;
  }

  private static async deleteYesterdayRawWeatherEntries(
    weatherRepository: Repository<WeatherEntity>,
    startOfYesterday: Date,
    startOfToday: Date,
  ): Promise<void> {
    await weatherRepository
      .createQueryBuilder()
      .delete()
      .from(WeatherEntity)
      .where('measuredAt >= :start', { start: startOfYesterday })
      .andWhere('measuredAt < :end', { end: startOfToday })
      .andWhere('source NOT LIKE :summaryPrefix', {
        summaryPrefix: 'weather_summary%',
      })
      .execute();
  }
}

