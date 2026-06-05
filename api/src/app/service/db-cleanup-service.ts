import { AppDataSource } from '../../data-source';
import { PvReadingEntity } from '../../entities/PvEntity';


/**
 * CleansUp db content of one day and sums it up to one entry per day.
 * This is to prevent the db from growing too much and to keep the performance of the app.
 */
export class DbCleanupService {
  static async cleanupPvData() {
    await AppDataSource.transaction(async (manager) => {
      const pvRepository = manager.getRepository(PvReadingEntity);

      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const entries = await pvRepository
        .createQueryBuilder('pv')
        .where('pv.measuredAt >= :start', { start: startOfYesterday })
        .andWhere('pv.measuredAt < :end', { end: startOfToday })
        .getMany();

      if (entries.length === 0) {
        console.log('No entries to clean up');
        return;
      }

      const avgVoltage =
        entries.reduce((sum, entry) => sum + entry.voltage, 0) / entries.length;
      const avgCurrent =
        entries.reduce((sum, entry) => sum + entry.current, 0) / entries.length;
      const avgPower =
        entries.reduce((sum, entry) => sum + entry.power, 0) / entries.length;
      const avgShuntVoltageMv =
        entries.reduce((sum, entry) => sum + entry.shuntVoltageMv, 0) / entries.length;

      const summaryEntry = pvRepository.create({
        voltage: avgVoltage,
        current: avgCurrent,
        power: avgPower,
        shuntVoltageMv: avgShuntVoltageMv,
        source: 'summary',
        measuredAt: startOfYesterday,
      });

      await pvRepository.save(summaryEntry);

      await pvRepository
        .createQueryBuilder()
        .delete()
        .from(PvReadingEntity)
        .where('measuredAt >= :start', { start: startOfYesterday })
        .andWhere('measuredAt < :end', { end: startOfToday })
        .andWhere('source != :source', { source: 'summary' })
        .execute();

      console.log(`Saved summary entry for ${startOfYesterday.toISOString()}`);
    });
  }
}