import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { DailyUptimeBucket } from "@/Types/Check";
import type { BarKind } from "./ThemedHistogram";

const MIN_HEIGHT_PCT = 6;

interface Props {
	buckets: DailyUptimeBucket[];
	days?: number;
	containerSx: SxProps<Theme>;
	barSx: (kind: BarKind, heightPct: number) => SxProps<Theme>;
	statsSx: SxProps<Theme>;
}

const formatDate = (dateStr: string): string => {
	const d = new Date(dateStr + "T00:00:00");
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const ThemedDailyHistogram = ({ buckets, days = 90, containerSx, barSx, statsSx }: Props) => {
	const { t } = useTranslation();

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const bucketMap = new Map(buckets.map((b) => [b.date, b]));

	const cells: { date: string; bucket: DailyUptimeBucket | null }[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
		const dateStr = d.toISOString().slice(0, 10);
		cells.push({ date: dateStr, bucket: bucketMap.get(dateStr) ?? null });
	}

	const { maxRt, avgRt, peak } = useMemo(() => {
		const valid = cells.filter((c) => c.bucket && c.bucket.avgResponseTime > 0).map((c) => c.bucket!.avgResponseTime);
		const m = valid.length ? Math.max(...valid) : 1;
		const a = valid.length ? Math.round(valid.reduce((s, v) => s + v, 0) / valid.length) : 0;
		return { maxRt: m, avgRt: a, peak: valid.length ? m : 0 };
	}, [cells]);

	return (
		<Stack gap={1}>
			<Box sx={containerSx}>
				{cells.map((cell) => {
					if (!cell.bucket || cell.bucket.avgResponseTime <= 0) {
						return <Box key={cell.date} sx={barSx("empty", MIN_HEIGHT_PCT)} />;
					}
					const { bucket } = cell;
					const kind: BarKind = bucket.uptimeFraction < 0.9 ? "down" : "up";
					const height = Math.max(MIN_HEIGHT_PCT, Math.round((bucket.avgResponseTime / maxRt) * 100));

					const tooltipContent = (
						<Stack gap="2px">
							<Typography variant="caption" fontWeight={700}>
								{formatDate(cell.date)}
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.9 }}>
								{`Avg: ${bucket.avgResponseTime} ms`}
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.8 }}>
								{`${(bucket.uptimeFraction * 100).toFixed(2)}% uptime`}
							</Typography>
						</Stack>
					);

					return (
						<Tooltip key={cell.date} title={tooltipContent} arrow placement="top">
							<Box sx={barSx(kind, height)} />
						</Tooltip>
					);
				})}
			</Box>
			<Stack direction="row" justifyContent="space-between" sx={statsSx}>
				<span>{t("pages.statusPages.monitorsList.chart.avg", { value: avgRt })}</span>
				<span>{t("pages.statusPages.monitorsList.chart.max", { value: peak })}</span>
			</Stack>
		</Stack>
	);
};
