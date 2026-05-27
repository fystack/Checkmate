import { Schema, model, type Types } from "mongoose";
import { IncidentResolutionTypes, IncidentUpdateStatuses, type Incident, type IncidentUpdate } from "@/types/incident.js";

type IncidentUpdateDocument = Omit<IncidentUpdate, "id" | "createdAt"> & {
	_id: Types.ObjectId;
	createdAt: Date;
};

type IncidentDocumentBase = Omit<Incident, "id" | "code" | "monitorId" | "teamId" | "resolvedBy" | "startTime" | "endTime" | "updates" | "createdAt" | "updatedAt"> & {
	code: string;
	monitorId: Types.ObjectId;
	teamId: Types.ObjectId;
	resolvedBy?: Types.ObjectId | null;
	startTime: Date;
	endTime: Date | null;
	updates: IncidentUpdateDocument[];
	createdAt: Date;
	updatedAt: Date;
};

export interface IncidentDocument extends IncidentDocumentBase {
	_id: Types.ObjectId;
}

const IncidentUpdateSchema = new Schema<IncidentUpdateDocument>(
	{
		status: { type: String, enum: IncidentUpdateStatuses, required: true },
		message: { type: String, required: true },
		postedBy: { type: String, required: true },
		createdAt: { type: Date, default: Date.now, immutable: true },
	},
	{ _id: true, timestamps: false }
);

// Status.io / Atlassian-style 6-character public code (e.g. "FB520U").
// Unambiguous alphabet: skips 0/O/1/I to avoid copy-paste confusion.
const INCIDENT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INCIDENT_CODE_LENGTH = 6;

const generateIncidentCode = (): string => {
	let code = "";
	for (let i = 0; i < INCIDENT_CODE_LENGTH; i++) {
		code += INCIDENT_CODE_ALPHABET.charAt(Math.floor(Math.random() * INCIDENT_CODE_ALPHABET.length));
	}
	return code;
};

const IncidentSchema = new Schema<IncidentDocument>(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			immutable: true,
			default: generateIncidentCode,
			index: true,
		},
		monitorId: {
			type: Schema.Types.ObjectId,
			ref: "Monitor",
			required: true,
			immutable: true,
			index: true,
		},
		teamId: {
			type: Schema.Types.ObjectId,
			ref: "Team",
			required: true,
			immutable: true,
			index: true,
		},
		startTime: {
			type: Date,
			immutable: true,
			required: true,
		},
		endTime: {
			type: Date,
			default: null,
		},
		status: {
			type: Boolean,
			default: true,
			index: true,
		},
		message: {
			type: String,
			default: null,
		},
		statusCode: {
			type: Number,
			default: null,
			index: true,
		},
		resolutionType: {
			type: String,
			enum: IncidentResolutionTypes,
			default: null,
		},
		resolvedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		resolvedByEmail: {
			type: String,
			default: null,
		},
		comment: {
			type: String,
			default: null,
		},
		updates: {
			type: [IncidentUpdateSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

IncidentSchema.index({ monitorId: 1, status: 1 });
IncidentSchema.index({ teamId: 1, status: 1 });
IncidentSchema.index({ teamId: 1, startTime: -1 });
IncidentSchema.index({ status: 1, startTime: -1 });
IncidentSchema.index({ resolutionType: 1, status: 1 });
IncidentSchema.index({ resolvedBy: 1, status: 1 });
IncidentSchema.index({ createdAt: -1 });

const IncidentModel = model<IncidentDocument>("Incident", IncidentSchema);

export { IncidentModel };
export default IncidentModel;
