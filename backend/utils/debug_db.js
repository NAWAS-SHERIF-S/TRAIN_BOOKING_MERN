import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Train from '../models/Train.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find a train with at least 3 stations
        // We select ONE random train to test against
        const train = await Train.findOne({ 'stations.2': { $exists: true } }).lean();

        if (!train) {
            console.log('No suitable train found');
            process.exit(0);
        }

        const s1 = train.stations[0];
        const s2 = train.stations[2]; // Use index 2 to skip one

        console.log(`\nSelected Train: ${train.trainNumber} (${train.trainName})`);
        console.log(`Station 1: ${s1.name} (${s1.stationCode})`);
        console.log(`Station 2: ${s2.name} (${s2.stationCode})`);

        // Simulate Frontend Input
        const fromInput = `${s1.name} (${s1.stationCode})`;
        const toInput = `${s2.name} (${s2.stationCode})`;
        console.log(`\nSimulating Search: From="${fromInput}", To="${toInput}"`);

        // Replicate Controller Logic EXACTLY
        const parser = (input) => {
            if (!input) return { term: '', isCode: false };
            const match = input.match(/\(([^)]+)\)$/);
            if (match) {
                return { term: match[1].trim(), isCode: true };
            }
            return { term: input.trim(), isCode: false };
        };

        const fromData = parser(fromInput);
        const toData = parser(toInput);

        console.log(`Parsed: From=${fromData.term} (Code? ${fromData.isCode}), To=${toData.term} (Code? ${toData.isCode})`);

        let query = {};
        if (fromData.isCode && toData.isCode) {
            query = {
                'stations.stationCode': { $all: [new RegExp(`^${fromData.term}$`, 'i'), new RegExp(`^${toData.term}$`, 'i')] }
            };
        }

        console.log('Constructed Query:', JSON.stringify(query, null, 2));

        const potentialTrains = await Train.find(query).lean();
        console.log(`Potential Matches: ${potentialTrains.length}`);

        const validTrains = [];
        for (const t of potentialTrains) {
            let fromIndex = -1;
            let toIndex = -1;

            if (fromData.isCode) {
                fromIndex = t.stations.findIndex(s => s.stationCode.toLowerCase() === fromData.term.toLowerCase());
            }
            if (toData.isCode) {
                toIndex = t.stations.findIndex(s => s.stationCode.toLowerCase() === toData.term.toLowerCase());
            }

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                validTrains.push(t.trainNumber);
            }
        }

        console.log(`Valid Matched Trains (IDs): ${validTrains.slice(0, 5)}`);

        if (validTrains.includes(train.trainNumber)) {
            console.log('\nSUCCESS: Found the original train in search results.');
        } else {
            console.log('\nFAILURE: Did not find original train.');
            // Debug failure
            const originalInPotential = potentialTrains.find(t => t.trainNumber === train.trainNumber);
            if (originalInPotential) {
                const fIdx = originalInPotential.stations.findIndex(s => s.stationCode.toLowerCase() === fromData.term.toLowerCase());
                const tIdx = originalInPotential.stations.findIndex(s => s.stationCode.toLowerCase() === toData.term.toLowerCase());
                console.log(`Debug Indices: From=${fIdx}, To=${tIdx}`);
            } else {
                console.log('Original train not even in potential matches (Query failure)');
                // Check why query failed
                const t1Code = s1.stationCode;
                const t2Code = s2.stationCode;
                console.log(`Checking codes in DB: Station 0: '${t1Code}', Station 2: '${t2Code}'`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debug();
