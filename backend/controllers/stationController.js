import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATION_FILE = path.join(__dirname, '../utils/stations.json');

let stationsCache = null;

const loadStations = () => {
    if (stationsCache) return stationsCache;
    try {
        const data = fs.readFileSync(STATION_FILE, 'utf8');
        const json = JSON.parse(data);
        // Filter valid stations and map to simple structure
        stationsCache = json.features
            .filter(f => f.properties && f.properties.code && f.properties.name)
            .map(f => ({
                code: f.properties.code,
                name: f.properties.name,
                state: f.properties.state
            }));
        return stationsCache;
    } catch (error) {
        console.error('Error loading stations:', error);
        return [];
    }
};

export const searchStations = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.json({ success: true, data: [] });
        }

        const stations = loadStations();
        const searchTerm = query.toLowerCase();

        // prioritized search: starts with code > starts with name > includes code > includes name
        const results = stations.filter(s =>
            s.code.toLowerCase().includes(searchTerm) ||
            s.name.toLowerCase().includes(searchTerm)
        ).slice(0, 20); // Limit results

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
