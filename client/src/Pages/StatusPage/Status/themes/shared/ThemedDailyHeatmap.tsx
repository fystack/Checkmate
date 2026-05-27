import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { DailyUptimeBucket } from "@/Types/Check";

export type DailyCellKind = "up" | "degraded" | "down" | "empty";

interface Props {
	buckets: DailyUptimeBucket[];
	days?: number;
	containerSx: SxProps<Theme>;
	cellSx: (kind: DailyCellKind) => SxProps<Theme>;
	footerSx?: SxProps<Theme>;
	uptimeLabel?: string;
	uptimeFraction?: number | null;
}

const classifyDay = (uptimeFraction: number): DailyCellKind => {
	if (uptimeFraction >= 0.999) return "up";
	if (uptimeFraction >= 0.9) return "degraded";
	return "down";
};

const formatDate = (dateStr: string): string => {
	const d = new Date(dateStr + "T00:00:00");
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const ThemedDailyHeatmap = ({ buckets, days = 90, containerSx, cellSx, footerSx, uptimeLabel, uptimeFraction }: Props) => {
	const { t } = useTranslation();

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const bucketMap = new Map(buckets.map((b) => [b.date, b]));

	const cells: { date: string; bucket: DailyUptimeBucket | null; kind: DailyCellKind }[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
		const dateStr = d.toISOString().slice(0, 10);
		const bucket = bucketMap.get(dateStr) ?? null;
		const kind = bucket ? classifyDay(bucket.uptimeFraction) : "empty";
		cells.push({ date: dateStr, bucket, kind });
	}

	return (
		<>
			<Box sx={containerSx}>
				{cells.map((cell) => {
					const tooltipContent = (
						<Stack gap="2px">
							<Typography variant="caption" fontWeight={700} sx={{ opacity: 1 }}>
								{formatDate(cell.date)}
							</Typography>
							{cell.bucket ? (
								<>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										{`${(cell.bucket.uptimeFraction * 100).toFixed(2)}% uptime`}
									</Typography>
									{cell.bucket.avgResponseTime > 0 && (
										<Typography variant="caption" sx={{ opacity: 0.8 }}>
											{`Avg response: ${cell.bucket.avgResponseTime} ms`}
										</Typography>
									)}
									<Typography variant="caption" sx={{ opacity: 0.7 }}>
										{cell.kind === "down"
											? "Outage detected"
											: cell.kind === "degraded"
												? "Degraded performance"
												: "No downtime recorded"}
									</Typography>
								</>
							) : (
								<Typography variant="caption" sx={{ opacity: 0.7 }}>
									No data
								</Typography>
							)}
						</Stack>
					);

					return (
						<Tooltip key={cell.date} title={tooltipContent} arrow placement="top">
							<Box sx={cellSx(cell.kind)} />
						</Tooltip>
					);
				})}
			</Box>
			{footerSx && (
				<Box sx={footerSx}>
					<span>{t("pages.statusPages.monitorsList.chart.daysAgo", { count: 90 })}</span>
					<span>{uptimeFraction != null && uptimeLabel ? `${(uptimeFraction * 100).toFixed(2)}% ${uptimeLabel}` : ""}</span>
					<span>{t("pages.statusPages.monitorsList.chart.today")}</span>
				</Box>
			)}
		</>
	);
};
