import { useMemo } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { Incident, IncidentUpdateStatus } from "@/Types/Incident";
import { formatDateWithTz } from "@/Utils/TimeUtils";
import { useStatusPageTheme } from "@/Pages/StatusPage/Status/themes/StatusPageThemeProvider";
import type { IncidentHistorySlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { StandardStyles } from "@/Pages/StatusPage/Status/themes/standard/styles";

const HISTORY_DAYS = 14;

const updateStatusKey = (status: IncidentUpdateStatus) =>
	`pages.statusPages.monitorsList.incidents.updateStatus.${status}`;

interface DayBucket {
	key: string;
	label: string;
	incidents: Incident[];
}

const buildDayBuckets = (incidents: Incident[], timezone: string): DayBucket[] => {
	const today = dayjs().tz(timezone).startOf("day");
	const buckets: DayBucket[] = [];
	const incidentsByDay = new Map<string, Incident[]>();

	for (const inc of incidents) {
		const key = dayjs(inc.startTime).tz(timezone).format("YYYY-MM-DD");
		if (!incidentsByDay.has(key)) incidentsByDay.set(key, []);
		incidentsByDay.get(key)!.push(inc);
	}

	for (let i = 0; i < HISTORY_DAYS; i++) {
		const day = today.subtract(i, "day");
		const key = day.format("YYYY-MM-DD");
		buckets.push({
			key,
			label: day.format("MMM D, YYYY"),
			incidents: (incidentsByDay.get(key) ?? []).sort(
				(a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
			),
		});
	}

	return buckets;
};

export const StandardIncidentHistory = ({
	incidents,
	monitors,
	styles,
}: IncidentHistorySlotProps<StandardStyles>) => {
	const { t } = useTranslation();
	const { timezone } = useStatusPageTheme();

	const monitorMap = useMemo(
		() => new Map(monitors.map((m) => [m.id, m.name])),
		[monitors]
	);

	const buckets = useMemo(
		() => buildDayBuckets(incidents, timezone),
		[incidents, timezone]
	);

	const todayKey = dayjs().tz(timezone).format("YYYY-MM-DD");

	return (
		<Box sx={styles.incidentSection}>
			<Box sx={styles.pastIncidentsTitle}>
				{t("pages.statusPages.monitorsList.incidents.pastTitle")}
			</Box>

			{buckets.map((bucket) => (
				<Box
					key={bucket.key}
					sx={styles.dayBlock}
				>
					<Box sx={styles.dayHeading}>{bucket.label}</Box>
					<Box sx={styles.dayDivider} />

					{bucket.incidents.length === 0 ? (
						<Box sx={styles.dayEmpty}>
							{bucket.key === todayKey
								? t("pages.statusPages.monitorsList.incidents.noIncidentsToday")
								: t("pages.statusPages.monitorsList.incidents.noIncidentsOnDay")}
						</Box>
					) : (
						bucket.incidents.map((incident) => {
							const ongoing = incident.status;
							const monitorName = monitorMap.get(incident.monitorId);
							const baseTitle = incident.message || monitorName || t("pages.statusPages.monitorsList.incidents.title");

							const sortedUpdates = [...(incident.updates ?? [])].sort(
								(a, b) =>
									new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
							);

							const hasUpdates = sortedUpdates.length > 0;
							const fallbackUpdates: { status: IncidentUpdateStatus; createdAt: string; message?: string | null }[] = [];
							if (!hasUpdates) {
								if (!ongoing && incident.endTime) {
									fallbackUpdates.push({
										status: "resolved",
										createdAt: incident.endTime,
										message: incident.comment ?? null,
									});
								}
								fallbackUpdates.push({
									status: ongoing ? "investigating" : "investigating",
									createdAt: incident.startTime,
									message: incident.message ?? null,
								});
							}
							const timelineEntries = hasUpdates
								? sortedUpdates
								: fallbackUpdates;

							return (
								<Box
									key={incident.id}
									sx={styles.pastIncident}
								>
									<Box
										component="a"
										href={`#incident-${incident.id}`}
										id={`incident-${incident.id}`}
										sx={styles.pastIncidentTitle(ongoing)}
									>
										{incident.code ? `${incident.code}: ${baseTitle}` : baseTitle}
									</Box>

									<Box sx={styles.pastIncidentTimeline}>
										{timelineEntries.map((update, idx) => (
											<Box
												key={`${incident.id}-${idx}`}
												sx={styles.pastIncidentEntry}
											>
												<Box sx={styles.pastIncidentEntryLine}>
													<Box
														component="span"
														sx={styles.pastIncidentStatus}
													>
														{t(updateStatusKey(update.status), {
															defaultValue: update.status,
														})}
													</Box>
													{update.message ? (
														<Box
															component="span"
															sx={styles.pastIncidentSeparator}
														>
															-
														</Box>
													) : null}
													{update.message ? (
														<Box
															component="span"
															sx={styles.pastIncidentMessage}
														>
															{update.message}
														</Box>
													) : null}
												</Box>
												<Box sx={styles.pastIncidentTime}>
													{t("pages.statusPages.monitorsList.incidents.timestampUtc", {
														value: formatDateWithTz(
															update.createdAt,
															"MMM D, HH:mm",
															timezone
														),
													})}
												</Box>
											</Box>
										))}
									</Box>
								</Box>
							);
						})
					)}
				</Box>
			))}
		</Box>
	);
};
