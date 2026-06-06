import "reflect-metadata"
import { DataSource } from "typeorm"
import { PvEntity } from "./entities/PvEntity"
import { WeatherEntity } from "./entities/WeatherEntity"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "api/src/db/pi_portal_data.db",
    synchronize: true,
    logging: false,
    entities: [PvEntity, WeatherEntity],
    migrations: [],
    subscribers: [],
})
