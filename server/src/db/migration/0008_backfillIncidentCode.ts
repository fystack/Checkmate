import mongoose from "mongoose";
import { logger } from "@/utils/logger.js";
import IncidentModel from "../models/Incident.js";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LENGTH = 6;

const generateCode = (): string => {
	let code = "";
	for (let i = 0; i < LENGTH; i++) {
		code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
	}
	return code;
};

export async function backfillIncidentCode(): Promise<void> {
	const SERVICE_NAME = "Migration:BackfillIncidentCode";

	try {
		logger.info({ service: SERVICE_NAME, message: "Starting backfill of Incident.code field" });

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection is not initialized");
		}

		const cursor = IncidentModel.collection.find({ $or: [{ code: { $exists: false } }, { code: null }, { code: "" }] });
		const seen = new Set<string>();
		let updated = 0;

		while (await cursor.hasNext()) {
			const doc = await cursor.next();
			if (!doc) break;

			let code = generateCode();
			while (seen.has(code) || (await IncidentModel.collection.findOne({ code }))) {
				code = generateCode();
			}
			seen.add(code);

			await IncidentModel.collection.updateOne({ _id: doc._id }, { $set: { code } });
			updated++;
		}

		logger.info({ service: SERVICE_NAME, message: `Backfilled code on ${updated} incident(s)` });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error({ service: SERVICE_NAME, message: `Error during Incident.code backfill: ${errorMessage}` });
		throw error;
	}
}
