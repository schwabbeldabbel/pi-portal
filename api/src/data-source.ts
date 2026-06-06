import "reflect-metadata"
import { DataSource } from "typeorm"
import { PvEntity } from "./entities/PvEntity"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "api/src/db/pv_data.db",
    synchronize: true,
    logging: false,
    entities: [PvEntity],
    migrations: [],
    subscribers: [],
})
