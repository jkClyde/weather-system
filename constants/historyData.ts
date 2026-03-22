import { Status } from "@/type";

export interface HistoryReading {
    id: number;
    timestamp: string;
    date: string;
    temperature: number;
    humidity: number;
    vibration: number;
    status: Status;
    device: string;
    location: string;
}

export interface DailySummary {
    date: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    avgHumidity: number;
    maxHumidity: number;
    minHumidity: number;
    peakVibration: number;
    avgVibration: number;
    totalReadings: number;
    alerts: number;
    uptime: number;
}

function makeReadings(): HistoryReading[] {
    const days = ["Mar 16", "Mar 17", "Mar 18", "Mar 19", "Mar 20", "Mar 21", "Mar 22"];
    const locations = ["Server Room A", "Server Room B", "Lab Floor 2"];
    const devices = ["ESP32-001", "ESP32-002"];
    const readings: HistoryReading[] = [];
    let id = 1;

    days.forEach((date, di) => {
        const baseTemp = 26 + di * 0.4;
        const baseHum = 57 + di * 0.6;
        for (let h = 8; h <= 17; h++) {
            for (const m of [0, 30]) {
                const noise = (Math.random() - 0.5) * 1.5;
                const vNoise = Math.random() * 0.12;
                const temp = parseFloat((baseTemp + noise + (h >= 12 ? 2.1 : 0)).toFixed(1));
                const hum = parseFloat((baseHum + noise * 0.8 + (h >= 12 ? 3.5 : 0)).toFixed(1));
                const vib = parseFloat((0.02 + vNoise + (h === 14 ? 0.12 : 0)).toFixed(3));
                const status: Status = vib > 0.18 ? "critical" : vib > 0.09 ? "warning" : "normal";
                readings.push({
                    id: id++, timestamp: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
                    date, temperature: temp, humidity: hum, vibration: vib, status,
                    device: devices[di % 2], location: locations[di % 3],
                });
            }
        }
    });
    return readings;
}

export const historyReadings = makeReadings();

export const dailySummaries: DailySummary[] = [
    { date: "Mar 16", avgTemp: 26.8, maxTemp: 28.2, minTemp: 25.4, avgHumidity: 57.4, maxHumidity: 61.2, minHumidity: 54.8, peakVibration: 0.08, avgVibration: 0.03, totalReadings: 183, alerts: 1, uptime: 99.8 },
    { date: "Mar 17", avgTemp: 27.1, maxTemp: 28.9, minTemp: 25.9, avgHumidity: 58.1, maxHumidity: 62.5, minHumidity: 55.2, peakVibration: 0.11, avgVibration: 0.04, totalReadings: 186, alerts: 2, uptime: 100.0 },
    { date: "Mar 18", avgTemp: 27.5, maxTemp: 29.3, minTemp: 26.1, avgHumidity: 58.9, maxHumidity: 63.1, minHumidity: 55.9, peakVibration: 0.09, avgVibration: 0.03, totalReadings: 182, alerts: 1, uptime: 99.9 },
    { date: "Mar 19", avgTemp: 27.9, maxTemp: 30.1, minTemp: 26.4, avgHumidity: 59.7, maxHumidity: 64.8, minHumidity: 56.3, peakVibration: 0.16, avgVibration: 0.05, totalReadings: 184, alerts: 3, uptime: 99.7 },
    { date: "Mar 20", avgTemp: 28.2, maxTemp: 30.8, minTemp: 26.8, avgHumidity: 60.4, maxHumidity: 65.9, minHumidity: 57.1, peakVibration: 0.19, avgVibration: 0.06, totalReadings: 185, alerts: 4, uptime: 99.5 },
    { date: "Mar 21", avgTemp: 28.0, maxTemp: 30.4, minTemp: 26.6, avgHumidity: 60.0, maxHumidity: 65.2, minHumidity: 56.8, peakVibration: 0.14, avgVibration: 0.04, totalReadings: 187, alerts: 2, uptime: 100.0 },
    { date: "Mar 22", avgTemp: 28.4, maxTemp: 31.9, minTemp: 27.1, avgHumidity: 62.1, maxHumidity: 68.4, minHumidity: 58.3, peakVibration: 0.21, avgVibration: 0.05, totalReadings: 192, alerts: 5, uptime: 99.8 },
];

export const weeklyTrend = dailySummaries.map(d => ({
    date: d.date, temperature: d.avgTemp, humidity: d.avgHumidity,
    vibration: d.avgVibration, alerts: d.alerts,
}));

export interface AlertEntry {
    id: number; time: string; date: string;
    type: "temperature" | "humidity" | "vibration";
    severity: "warning" | "critical";
    value: string; threshold: string; device: string; resolved: boolean;
}

export const alertLog: AlertEntry[] = [
    { id: 1, time: "14:58:34", date: "Mar 22", type: "vibration", severity: "critical", value: "0.21g", threshold: ">0.18g", device: "ESP32-001", resolved: true },
    { id: 2, time: "14:59:34", date: "Mar 22", type: "temperature", severity: "warning", value: "30.8°C", threshold: ">30°C", device: "ESP32-001", resolved: true },
    { id: 3, time: "11:32:12", date: "Mar 22", type: "humidity", severity: "warning", value: "66.2%", threshold: ">65%", device: "ESP32-002", resolved: true },
    { id: 4, time: "09:14:55", date: "Mar 22", type: "vibration", severity: "warning", value: "0.14g", threshold: ">0.09g", device: "ESP32-001", resolved: true },
    { id: 5, time: "10:22:08", date: "Mar 21", type: "vibration", severity: "warning", value: "0.14g", threshold: ">0.09g", device: "ESP32-002", resolved: true },
    { id: 6, time: "14:05:41", date: "Mar 21", type: "temperature", severity: "warning", value: "30.4°C", threshold: ">30°C", device: "ESP32-001", resolved: true },
    { id: 7, time: "13:48:22", date: "Mar 20", type: "vibration", severity: "critical", value: "0.19g", threshold: ">0.18g", device: "ESP32-001", resolved: true },
    { id: 8, time: "11:21:09", date: "Mar 20", type: "humidity", severity: "warning", value: "65.9%", threshold: ">65%", device: "ESP32-002", resolved: true },
];