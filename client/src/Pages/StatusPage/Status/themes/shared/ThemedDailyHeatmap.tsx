import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { DailyUptimeBucket } from "@/Types/Check";
import { useStatusPageTheme } from "../StatusPageThemeProvider";

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

// Thresholds match industry convention (Statuspage.io / Atlassian):
//   ≥99.9% → operational (green)
//   ≥95%   → degraded performance (yellow) — partial outage
//   <95%   → major outage (red)
const classifyDay = (uptimeFraction: number): DailyCellKind => {
	if (uptimeFraction >= 0.999) return "up";
	if (uptimeFraction >= 0.95) return "degraded";
	return "down";
};

const formatDate = (dateStr: string): string => {
	const d = new Date(dateStr + "T00:00:00");
	return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

const formatMs = (ms: number): string => {
	if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
	return `${Math.round(ms)} ms`;
};

interface TooltipBodyProps {
	cell: { date: string; bucket: DailyUptimeBucket | null; kind: DailyCellKind };
}

const TooltipBody = ({ cell }: TooltipBodyProps) => {
	const { tokens } = useStatusPageTheme();

	const statusColor: Record<DailyCellKind, string> = {
		up: tokens.up,
		degraded: tokens.warn,
		down: tokens.down,
		empty: tokens.textMuted,
	};
	const statusLabel: Record<DailyCellKind, string> = {
		up: "Operational",
		degraded: "Partial outage",
		down: "Major outage",
		empty: "No data",
	};

	const color = statusColor[cell.kind];
	const { bucket } = cell;
	const failedChecks = bucket ? Math.round(bucket.totalChecks * (1 - bucket.uptimeFraction)) : 0;
	const uptimePct = bucket ? (bucket.uptimeFraction * 100).toFixed(2) : null;

	return (
		<Stack gap="10px" sx={{ minWidth: 200, p: "2px 0" }}>
			{/* Date header */}
			<Typography variant="caption" fontWeight={700} fontSize={12} sx={{ opacity: 1, lineHeight: 1.3 }}>
				{formatDate(cell.date)}
			</Typography>

			<Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: "-4px" }} />

			{/* Status badge row */}
			<Stack direction="row" alignItems="center" justifyContent="space-between" gap="12px">
				<Stack direction="row" alignItems="center" gap="6px">
					<Box
						sx={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							flexShrink: 0,
							background: color,
							boxShadow: `0 0 0 2px ${color}44`,
						}}
					/>
					<Typography variant="caption" fontWeight={700} fontSize={11} sx={{ color, lineHeight: 1 }}>
						{statusLabel[cell.kind]}
					</Typography>
				</Stack>
				{uptimePct !== null && (
					<Typography variant="caption" fontWeight={700} fontSize={11} sx={{ opacity: 0.95, fontVariantNumeric: "tabular-nums" }}>
						{uptimePct}% uptime
					</Typography>
				)}
			</Stack>

			{/* Stats rows */}
			{bucket && (
				<Stack gap="5px">
					{failedChecks > 0 && (
						<Stack direction="row" justifyContent="space-between" gap="16px">
							<Typography variant="caption" sx={{ opacity: 0.65, fontSize: 11 }}>Failed checks</Typography>
							<Typography variant="caption" fontWeight={600} fontSize={11} sx={{ color: tokens.down, fontVariantNumeric: "tabular-nums" }}>
								{failedChecks} / {bucket.totalChecks}
							</Typography>
						</Stack>
					)}
					{failedChecks === 0 && (
						<Stack direction="row" justifyContent="space-between" gap="16px">
							<Typography variant="caption" sx={{ opacity: 0.65, fontSize: 11 }}>Total checks</Typography>
							<Typography variant="caption" fontWeight={600} fontSize={11} sx={{ opacity: 0.9, fontVariantNumeric: "tabular-nums" }}>
								{bucket.totalChecks}
							</Typography>
						</Stack>
					)}
					{bucket.avgResponseTime > 0 && (
						<Stack direction="row" justifyContent="space-between" gap="16px">
							<Typography variant="caption" sx={{ opacity: 0.65, fontSize: 11 }}>Avg response</Typography>
							<Typography variant="caption" fontWeight={600} fontSize={11} sx={{ opacity: 0.9, fontVariantNumeric: "tabular-nums" }}>
								{formatMs(bucket.avgResponseTime)}
							</Typography>
						</Stack>
					)}
				</Stack>
			)}
		</Stack>
	);
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
				{cells.map((cell) => (
					<Tooltip
						key={cell.date}
						title={<TooltipBody cell={cell} />}
						arrow
						placement="top"
						componentsProps={{
							tooltip: { sx: { maxWidth: 260, p: "10px 14px" } },
						}}
					>
						<Box sx={cellSx(cell.kind)} />
					</Tooltip>
				))}
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
