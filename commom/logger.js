import { setLevel, LOGLEVEL, setFormatter, RotatingLogger, DailyLogger } from "napi-addon-spdlog";

setLevel(LOGLEVEL.TRACE);
setFormatter("[%H:%M:%S] [%l] -%v");

const dailyLogger = new DailyLogger("test", "./logs/all.log", 2, 30);

module.exports = {
    dailyLogger
}