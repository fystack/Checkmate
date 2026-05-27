import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Monitor } from "@/Types/Monitor";
import type { StatusPage } from "@/Types/StatusPage";
import type { Incident, IncidentUpdateStatus } from "@/Types/Incident";
import { getMonitorTypeLabel } from "@/Types/StatusPage";
import type { StatusPageThemeTokens } from "@/Pages/StatusPage/Status/themes/tokens";
import {
	ThemedHeatmap,
	type HeatCellKind,
} from "@/Pages/StatusPage/Status/themes/shared/ThemedHeatmap";
import {
	ThemedHistogram,
	type BarKind,
} from "@/Pages/StatusPage/Status/themes/shared/ThemedHistogram";
import {
	ThemedDailyHeatmap,
	type DailyCellKind,
} from "@/Pages/StatusPage/Status/themes/shared/ThemedDailyHeatmap";
import { ThemedDailyHistogram } from "@/Pages/StatusPage/Status/themes/shared/ThemedDailyHistogram";
import {
	ThemedInfrastructure,
	type GaugeFillLevel,
} from "@/Pages/StatusPage/Status/themes/shared/ThemedInfrastructure";
import {
	type OverallStatus,
	type OverallTone,
	monitorBadgeTone,
	resolveOverallStatus,
	statusBadgeKey,
} from "@/Pages/StatusPage/Status/themes/shared/overallStatus";
import { useStatusPageTheme } from "@/Pages/StatusPage/Status/themes/StatusPageThemeProvider";
import { ThemedIncidentHistory } from "@/Pages/StatusPage/Status/themes/shared/ThemedIncidentHistory";

type StatusPageMonitor = Monitor & { checks?: Monitor["recentChecks"] };

export interface BaseStyles {
	page: SxProps<Theme>;
	top: SxProps<Theme>;
	chartSwitchWrap: SxProps<Theme>;
	chartSwitch: SxProps<Theme>;
	chartSwitchButton: (active: boolean) => SxProps<Theme>;
	monitorList: SxProps<Theme>;
	card: SxProps<Theme>;
	cardRow: SxProps<Theme>;
	cardLeft: SxProps<Theme>;
	monitorName: SxProps<Theme>;
	monitorMeta: SxProps<Theme>;
	pill: SxProps<Theme>;
	pillHardware: SxProps<Theme>;
	monitorUrl: SxProps<Theme>;
	badge: (tone: OverallTone) => SxProps<Theme>;
	heatmap: SxProps<Theme>;
	heatmapCell: (kind: HeatCellKind) => SxProps<Theme>;
	heatmapFooter?: SxProps<Theme>;
	dailyHeatmap?: SxProps<Theme>;
	dailyHeatmapCell?: (kind: DailyCellKind) => SxProps<Theme>;
	histogram: SxProps<Theme>;
	bar: (kind: BarKind, heightPct: number) => SxProps<Theme>;
	chartStats: SxProps<Theme>;
	infra: SxProps<Theme>;
	infraEmpty: SxProps<Theme>;
	gauge: SxProps<Theme>;
	gaugeLabel: SxProps<Theme>;
	gaugeValue: SxProps<Theme>;
	gaugeBar: SxProps<Theme>;
	gaugeFill: (level: GaugeFillLevel, widthPct: number) => SxProps<Theme>;
	gaugeSub: SxProps<Theme>;
	footer: SxProps<Theme>;
	incidentSection?: SxProps<Theme>;
	incidentSectionTitle?: SxProps<Theme>;
	incident?: SxProps<Theme>;
	incidentHeader?: SxProps<Theme>;
	incidentName?: SxProps<Theme>;
	incidentBadge?: (ongoing: boolean) => SxProps<Theme>;
	incidentBorderColor?: (ongoing: boolean) => string;
	incidentMeta?: SxProps<Theme>;
	incidentComment?: SxProps<Theme>;
	incidentTimeline?: SxProps<Theme>;
	incidentTimelineItem?: SxProps<Theme>;
	incidentUpdateBadge?: (status: IncidentUpdateStatus) => SxProps<Theme>;
	incidentUpdateMessage?: SxProps<Theme>;
	incidentUpdateTime?: SxProps<Theme>;
}

export interface SlotProps<S extends BaseStyles = BaseStyles> {
	statusPage: StatusPage;
	logoSrc: string | null;
	overall: OverallStatus;
	monitorCount: number;
	styles: S;
}

export interface IncidentHistorySlotProps<S extends BaseStyles = BaseStyles> {
	incidents: Incident[];
	monitors: Monitor[];
	styles: S;
}

export interface ThemeConfig<S extends BaseStyles = BaseStyles> {
	createStyles: (
		tokens: StatusPageThemeTokens,
		isDark: boolean,
		statusPage: StatusPage
	) => S;
	HeaderSlot: React.ComponentType<SlotProps<S>>;
	HeroSlot: React.ComponentType<SlotProps<S>>;
	IncidentHistorySlot?: React.ComponentType<IncidentHistorySlotProps<S>>;
	overallStatusOptions?: { iconSize?: number; allUpKey?: string };
}

interface Props {
	statusPage: StatusPage;
	monitors: StatusPageMonitor[];
	incidents: Incident[];
	config: ThemeConfig<any>;
}

export const BaseStatusPage = ({ statusPage, monitors, incidents, config }: Props) => {
	const { t } = useTranslation();
	const { tokens, mode } = useStatusPageTheme();
	const styles = useMemo(
		() => config.createStyles(tokens, mode === "dark", statusPage),
		[config, tokens, mode, statusPage]
	);
	const [chartMode, setChartMode] = useState<"heatmap" | "histogram">("heatmap");

	const overall = resolveOverallStatus(monitors, t, config.overallStatusOptions);
	const logoSrc = statusPage.logo?.data
		? `data:${statusPage.logo.contentType};base64,${statusPage.logo.data}`
		: null;

	const { HeaderSlot, HeroSlot, IncidentHistorySlot } = config;

	return (
		<Box sx={styles.page}>
			<Box
				component="header"
				sx={styles.top}
			>
				<HeaderSlot
					statusPage={statusPage}
					logoSrc={logoSrc}
					overall={overall}
					monitorCount={monitors.length}
					styles={styles}
				/>
			</Box>

			<HeroSlot
				statusPage={statusPage}
				logoSrc={logoSrc}
				overall={overall}
				monitorCount={monitors.length}
				styles={styles}
			/>

			{statusPage.showCharts && (
				<Box sx={styles.chartSwitchWrap}>
					<Box
						sx={styles.chartSwitch}
						role="radiogroup"
					>
						<Box
							component="button"
							type="button"
							role="radio"
							aria-checked={chartMode === "heatmap"}
							onClick={() => setChartMode("heatmap")}
							sx={styles.chartSwitchButton(chartMode === "heatmap")}
						>
							{t("pages.statusPages.monitorsList.chartTypeHeatmap")}
						</Box>
						<Box
							component="button"
							type="button"
							role="radio"
							aria-checked={chartMode === "histogram"}
							onClick={() => setChartMode("histogram")}
							sx={styles.chartSwitchButton(chartMode === "histogram")}
						>
							{t("pages.statusPages.monitorsList.chartTypeHistogram")}
						</Box>
					</Box>
				</Box>
			)}

			<Stack
				component="ul"
				sx={styles.monitorList}
			>
				{monitors.map((monitor) => {
					const isHardware = monitor.type === "hardware";
					const showInfra = isHardware && statusPage.showInfrastructure !== false;
					const showChart = !isHardware && statusPage.showCharts !== false;
					const badgeTone = monitorBadgeTone(monitor.status);
					const lastCheck = monitor.recentChecks?.at(-1);
					const lastResponseTime =
						lastCheck?.status && lastCheck.responseTime > 0
							? Math.round(lastCheck.responseTime)
							: null;

					return (
						<Box
							component="li"
							key={monitor.id}
							sx={styles.card}
						>
							<Box sx={styles.cardRow}>
								<Box sx={styles.cardLeft}>
									<Box sx={styles.monitorName}>{monitor.name}</Box>
									<Box sx={styles.monitorMeta}>
										<Box
											component="span"
											sx={isHardware ? styles.pillHardware : styles.pill}
										>
											{getMonitorTypeLabel(monitor.type, t)}
										</Box>
										{monitor.url && (
											<Box
												component="span"
												sx={styles.monitorUrl}
												title={monitor.url}
											>
												{monitor.url}
											</Box>
										)}
										{lastResponseTime !== null && (
											<Box
												component="span"
												sx={{
													fontSize: 11,
													color: tokens.textMuted,
													fontVariantNumeric: "tabular-nums",
												}}
											>
												{lastResponseTime}ms
											</Box>
										)}
									</Box>
								</Box>
								<Box
									display="flex"
									flexDirection="column"
									alignItems="flex-end"
									gap="4px"
								>
									<Box
										component="span"
										sx={styles.badge(badgeTone)}
									>
										{t(statusBadgeKey[monitor.status])}
									</Box>
									{statusPage.showUptimePercentage &&
										monitor.uptimePercentage != null &&
										!styles.heatmapFooter && (
											<Box
												component="span"
												sx={{
													fontSize: 12,
													fontWeight: 700,
													color: tokens.textMuted,
													fontVariantNumeric: "tabular-nums",
													whiteSpace: "nowrap",
												}}
											>
												{(monitor.uptimePercentage * 100).toFixed(2)}%
											</Box>
										)}
								</Box>
							</Box>

							{showInfra && (
								<ThemedInfrastructure
									monitor={monitor}
									sxApi={{
										containerSx: styles.infra,
										emptySx: styles.infraEmpty,
										gaugeSx: styles.gauge,
										gaugeLabelSx: styles.gaugeLabel,
										gaugeValueSx: styles.gaugeValue,
										gaugeBarSx: styles.gaugeBar,
										gaugeFillSx: styles.gaugeFill,
										gaugeSubSx: styles.gaugeSub,
									}}
								/>
							)}
							{showChart &&
								(chartMode === "heatmap" ? (
									<>
										{styles.dailyHeatmap && styles.dailyHeatmapCell && monitor.dailyHeatmap ? (
											<ThemedDailyHeatmap
												buckets={monitor.dailyHeatmap}
												days={90}
												containerSx={styles.dailyHeatmap}
												cellSx={styles.dailyHeatmapCell}
												footerSx={styles.heatmapFooter}
												uptimeLabel={statusPage.showUptimePercentage ? t("pages.statusPages.monitorsList.uptime.title") : undefined}
												uptimeFraction={statusPage.showUptimePercentage ? monitor.uptimePercentage ?? null : null}
											/>
										) : (
											<>
												<ThemedHeatmap
													checks={monitor.recentChecks ?? []}
													containerSx={styles.heatmap}
													cellSx={styles.heatmapCell}
												/>
												{styles.heatmapFooter && (
													<Box sx={styles.heatmapFooter}>
														<span>
															{t(
																"pages.statusPages.monitorsList.chart.daysAgo",
																{ count: 90 }
															)}
														</span>
														<span>
															{statusPage.showUptimePercentage &&
															monitor.uptimePercentage != null
																? `${(monitor.uptimePercentage * 100).toFixed(2)}% ${t("pages.statusPages.monitorsList.uptime.title")}`
																: ""}
														</span>
														<span>
															{t("pages.statusPages.monitorsList.chart.today")}
														</span>
													</Box>
												)}
											</>
										)}
									</>
								) : (
									styles.dailyHeatmap && monitor.dailyHeatmap ? (
										<ThemedDailyHistogram
											buckets={monitor.dailyHeatmap}
											days={90}
											containerSx={styles.histogram}
											barSx={styles.bar}
											statsSx={styles.chartStats}
										/>
									) : (
										<ThemedHistogram
											checks={monitor.recentChecks ?? []}
											containerSx={styles.histogram}
											barSx={styles.bar}
											statsSx={styles.chartStats}
										/>
									)
								))}
						</Box>
					);
				})}
			</Stack>

			{IncidentHistorySlot ? (
				<IncidentHistorySlot
					incidents={incidents}
					monitors={monitors}
					styles={styles}
				/>
			) : styles.incidentSection && styles.incidentSectionTitle && styles.incident && styles.incidentHeader && styles.incidentName && styles.incidentBadge && styles.incidentMeta && styles.incidentComment && (
				<ThemedIncidentHistory
					incidents={incidents}
					monitors={monitors}
					sxApi={{
						sectionSx: styles.incidentSection,
						sectionTitleSx: styles.incidentSectionTitle,
						incidentSx: styles.incident,
						incidentHeaderSx: styles.incidentHeader,
						incidentNameSx: styles.incidentName,
						incidentBadgeSx: styles.incidentBadge,
						incidentBorderColorFn: styles.incidentBorderColor,
						incidentMetaSx: styles.incidentMeta,
						incidentCommentSx: styles.incidentComment,
						timelineSx: styles.incidentTimeline,
						timelineItemSx: styles.incidentTimelineItem,
						updateBadgeSx: styles.incidentUpdateBadge,
						updateMessageSx: styles.incidentUpdateMessage,
						updateTimeSx: styles.incidentUpdateTime,
					}}
				/>
			)}
		</Box>
	);
};
