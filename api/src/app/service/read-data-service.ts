import { Logger } from "@nestjs/common";
import { FlatWidgetData } from "shared-data";
import { AppDataSource } from "../../data-source";
import { PvEntity } from "../../entities/PvEntity";
import { mapPvEntityToFlatWidgetData } from "./mapper";

export class ReadDataService {

    async readData(): Promise<FlatWidgetData[]> {
        const widgetData: FlatWidgetData[] = [];
        const pvRepository = AppDataSource.getRepository(PvEntity);

        const pvData = await pvRepository
            .createQueryBuilder('pv')
            .orderBy('pv.createdAt', 'DESC')
            .getOne();

        if (pvData) {
            widgetData.push(mapPvEntityToFlatWidgetData(pvData));
        }

        return widgetData;
    }
}
