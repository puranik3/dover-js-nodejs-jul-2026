import fs from 'fs';
import path from 'path';
import Workshop from '../models/Workshop';
import { sequelize } from '../init';

type WorkshopSeed = {
    id: number;
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'mobile';
    description: string;
    startDate: string | Date;
    endDate: string | Date;
    startTime: { hours: number; minutes: number };
    endTime: { hours: number; minutes: number };
    location: { address: string; city: string; state: string };
    modes: { inPerson: boolean; online: boolean };
    imageUrl: string;
    speakers: string[];
};

const seedWorkshops = async () => {
    try {
        await sequelize.authenticate();

        // IMPORTANT:
        // This seed script runs from dist/, so ensure workshops.json is present in dist/data as well.
        const filePath = path.join(__dirname, 'workshops.json');
        const raw = fs.readFileSync(filePath, 'utf-8');
        const workshops: WorkshopSeed[] = JSON.parse(raw);

        // Upsert each workshop using the given id (primary key).
        // This allows re-running the seed without creating duplicates.
        for (const w of workshops) {
            await Workshop.upsert({
                ...w,
                startDate: new Date(w.startDate),
                endDate: new Date(w.endDate),
            } as any);
        }

        // IMPORTANT (Postgres):
        // After inserting rows with explicit ids, the id sequence may still be at 1.
        // This can cause future inserts to fail with duplicate key errors.
        // So we move the sequence to MAX(id).
        await sequelize.query(`
            SELECT setval(
                pg_get_serial_sequence('workshops', 'id'),
                COALESCE((SELECT MAX(id) FROM workshops), 1)
            );
        `);

        console.log(`Seed completed: ${workshops.length} workshop(s) processed.`);
        process.exit(0);
    } catch (error: any) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedWorkshops();
