import { z } from "zod";
import { booleanCoercion } from "./shared.js";
import { IncidentUpdateStatuses } from "@/types/incident.js";

//****************************************
// Incident Validations
//****************************************

export const getIncidentsByTeamQueryValidation = z.object({
	sortOrder: z.enum(["asc", "desc"]),
	dateRange: z.enum(["recent", "hour", "day", "week", "month", "all"]).default("all"),
	page: z.coerce.number().int().min(0),
	rowsPerPage: z.coerce.number().int().min(1),
	status: booleanCoercion.optional(),
	monitorId: z.string().optional(),
	resolutionType: z.enum(["manual", "automatic"]).optional(),
});

export const getIncidentSummaryQueryValidation = z.object({
	limit: z.coerce.number().int().min(1).optional(),
});

export const postIncidentUpdateBodyValidation = z.object({
	status: z.enum([...IncidentUpdateStatuses] as [string, ...string[]]),
	message: z.string().min(1).max(2000),
});
