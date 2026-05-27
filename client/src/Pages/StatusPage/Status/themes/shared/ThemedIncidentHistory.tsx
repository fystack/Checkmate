import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Incident, IncidentUpdateStatus } from "@/Types/Incident";
import type { Monitor } from "@/Types/Monitor";
import { formatDateWithTz } from "@/Utils/TimeUtils";
import { useStatusPageTheme } from "../StatusPageThemeProvider";

interface SxApi {
	sectionSx: SxProps<Theme>;
	sectionTitleSx: SxProps<Theme>;
	incidentSx: SxProps<Theme>;
	incidentHeaderSx: SxProps<Theme>;
	incidentNameSx: SxProps<Theme>;
	incidentBadgeSx: (ongoing: boolean) => SxProps<Theme>;
	incidentBorderColorFn?: (ongoing: boolean) => string;
	incidentMetaSx: SxProps<Theme>;
	incidentCommentSx: SxProps<Theme>;
	timelineSx?: SxProps<Theme>;
	timelineItemSx?: SxProps<Theme>;
	updateBadgeSx?: (status: IncidentUpdateStatus) => SxProps<Theme>;
	updateMessageSx?: SxProps<Theme>;
	updateTimeSx?: SxProps<Theme>;
}

interface Props {
	incidents: Incident[];
	monitors: Monitor[];
	sxApi: SxApi;
}

const formatDuration = (startTime: string, endTime: string | null): string => {
	const start = new Date(startTime).getTime();
	const end = endTime ? new Date(endTime).getTime() : Date.now();
	const ms = end - start;
	const mins = Math.floor(ms / 60000);
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	const rem = mins % 60;
	if (hours < 24) return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
	const days = Math.floor(hours / 24);
	const remH = hours % 24;
	return remH > 0 ? `${days}d ${remH}h` : `${days}d`;
};

const groupByDate = (incidents: Incident[], timezone: string): Map<string, Incident[]> => {
	const map = new Map<string, Incident[]>();
	for (const inc of incidents) {
		const label = formatDateWithTz(inc.startTime, "MMMM D, YYYY", timezone);
		if (!map.has(label)) map.set(label, []);
		map.get(label)!.push(inc);
	}
	return map;
};

export const ThemedIncidentHistory = ({ incidents, monitors, sxApi }: Props) => {
	const { t } = useTranslation();
	const { timezone } = useStatusPageTheme();

	const monitorMap = new Map(monitors.map((m) => [m.id, m.name]));

	const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
	const visible = incidents
		.filter((i) => new Date(i.startTime).getTime() >= cutoff)
		.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

	const hasTimeline = !!(
		sxApi.timelineSx &&
		sxApi.timelineItemSx &&
		sxApi.updateBadgeSx &&
		sxApi.updateMessageSx &&
		sxApi.updateTimeSx
	);

	const grouped = groupByDate(visible, timezone);

	return (
		<Box sx={sxApi.sectionSx}>
			<Box sx={sxApi.sectionTitleSx}>
				{t("pages.statusPages.monitorsList.incidents.title")}
			</Box>

			{visible.length === 0 ? (
				<Box sx={{ textAlign: "center", py: "36px" }}>
					<Box sx={{ ...sxApi.incidentMetaSx, justifyContent: "center", fontSize: 14, mb: "6px" }}>
						{t("pages.statusPages.monitorsList.incidents.noIncidents")}
					</Box>
				</Box>
			) : (
				Array.from(grouped.entries()).map(([dateLabel, group], groupIdx) => (
					<Box key={dateLabel} sx={{ mb: groupIdx < grouped.size - 1 ? "24px" : 0 }}>
						{/* Date group heading */}
						<Box sx={sxApi.incidentCommentSx}>{dateLabel}</Box>

						{group.map((incident) => {
							const ongoing = incident.status;
							const monitorName = monitorMap.get(incident.monitorId);
							const title = incident.message || monitorName || "Incident";
							const borderColor = sxApi.incidentBorderColorFn?.(ongoing);

							const sortedUpdates = hasTimeline
								? [...(incident.updates ?? [])].sort(
										(a, b) =>
											new Date(b.createdAt).getTime() -
											new Date(a.createdAt).getTime()
									)
								: [];

							return (
								<Box
									key={incident.id}
									sx={{
										...sxApi.incidentSx,
										...(borderColor && {
											borderLeft: `3px solid ${borderColor}`,
										}),
									}}
								>
									{/* Header */}
									<Box sx={sxApi.incidentHeaderSx}>
										<Box sx={sxApi.incidentNameSx}>{title}</Box>
										<Box sx={sxApi.incidentBadgeSx(ongoing)}>
											{ongoing
												? t("pages.statusPages.monitorsList.incidents.ongoing")
												: t("pages.statusPages.monitorsList.incidents.resolved")}
										</Box>
									</Box>

									{/* Meta */}
									<Box sx={sxApi.incidentMetaSx}>
										<span>
											{formatDateWithTz(incident.startTime, "HH:mm", timezone)}
										</span>
										{!ongoing && incident.endTime && (
											<span>
												{t(
													"pages.statusPages.monitorsList.incidents.duration",
													{ value: formatDuration(incident.startTime, incident.endTime) }
												)}
											</span>
										)}
										{monitorName && title !== monitorName && (
											<span>{monitorName}</span>
										)}
									</Box>

									{/* Timeline */}
									{hasTimeline && sortedUpdates.length > 0 && (
										<Box sx={sxApi.timelineSx}>
											{sortedUpdates.map((update) => (
												<Box key={update.id} sx={sxApi.timelineItemSx}>
													<Box sx={sxApi.updateBadgeSx!(update.status)}>
														{t(
															`pages.statusPages.monitorsList.incidents.updateStatus.${update.status}`,
															{ defaultValue: update.status }
														)}
													</Box>
													<Box sx={sxApi.updateMessageSx}>
														{update.message}
													</Box>
													<Box sx={sxApi.updateTimeSx}>
														{formatDateWithTz(update.createdAt, "MMM D, HH:mm", timezone)}
													</Box>
												</Box>
											))}
										</Box>
									)}

									{!hasTimeline && incident.comment && (
										<Box sx={{ ...sxApi.updateMessageSx, mt: "10px" }}>
											{incident.comment}
										</Box>
									)}
								</Box>
							);
						})}
					</Box>
				))
			)}
		</Box>
	);
};
