import type { SxProps, Theme } from "@mui/material/styles";
import type { StatusPageThemeTokens } from "../tokens";
import { type OverallTone, toneColor, toneSoft } from "../shared/overallStatus";
import { SANS_STACK, MONO_STACK } from "../shared/fontStacks";
import { MAX_RECENT_CHECKS } from "@/Types/Monitor";
import type { IncidentUpdateStatus } from "@/Types/Incident";
import type { DailyCellKind } from "../shared/ThemedDailyHeatmap";

export type StandardHeatCell = "fast" | "med" | "slow" | "down" | "empty";
export type StandardBarKind = "up" | "down" | "empty";
export type StandardGaugeFill = "ok" | "warm" | "hot";

export interface StandardStyles {
	page: SxProps<Theme>;
	top: SxProps<Theme>;
	brand: SxProps<Theme>;
	brandMark: SxProps<Theme>;
	logoImg: SxProps<Theme>;
	hero: (tone: OverallTone) => SxProps<Theme>;
	heroTitle: SxProps<Theme>;
	heroIcon: (tone: OverallTone) => SxProps<Theme>;
	pastIncidentsTitle: SxProps<Theme>;
	dayBlock: SxProps<Theme>;
	dayHeading: SxProps<Theme>;
	dayDivider: SxProps<Theme>;
	dayEmpty: SxProps<Theme>;
	pastIncident: SxProps<Theme>;
	pastIncidentTitle: (ongoing: boolean) => SxProps<Theme>;
	pastIncidentTimeline: SxProps<Theme>;
	pastIncidentEntry: SxProps<Theme>;
	pastIncidentEntryLine: SxProps<Theme>;
	pastIncidentStatus: SxProps<Theme>;
	pastIncidentSeparator: SxProps<Theme>;
	pastIncidentMessage: SxProps<Theme>;
	pastIncidentTime: SxProps<Theme>;
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
	heatmapCell: (kind: StandardHeatCell) => SxProps<Theme>;
	heatmapFooter: SxProps<Theme>;
	dailyHeatmap: SxProps<Theme>;
	dailyHeatmapCell: (kind: DailyCellKind) => SxProps<Theme>;
	histogram: SxProps<Theme>;
	bar: (kind: StandardBarKind, heightPct: number) => SxProps<Theme>;
	chartStats: SxProps<Theme>;
	infra: SxProps<Theme>;
	infraEmpty: SxProps<Theme>;
	gauge: SxProps<Theme>;
	gaugeLabel: SxProps<Theme>;
	gaugeValue: SxProps<Theme>;
	gaugeBar: SxProps<Theme>;
	gaugeFill: (level: StandardGaugeFill, widthPct: number) => SxProps<Theme>;
	gaugeSub: SxProps<Theme>;
	footer: SxProps<Theme>;
	incidentSection: SxProps<Theme>;
	incidentSectionTitle: SxProps<Theme>;
	incident: SxProps<Theme>;
	incidentHeader: SxProps<Theme>;
	incidentName: SxProps<Theme>;
	incidentBadge: (ongoing: boolean) => SxProps<Theme>;
	incidentBorderColor: (ongoing: boolean) => string;
	incidentMeta: SxProps<Theme>;
	incidentComment: SxProps<Theme>;
	incidentTimeline: SxProps<Theme>;
	incidentTimelineItem: SxProps<Theme>;
	incidentUpdateBadge: (status: IncidentUpdateStatus) => SxProps<Theme>;
	incidentUpdateMessage: SxProps<Theme>;
	incidentUpdateTime: SxProps<Theme>;
}

export const standardStyles = (
	tokens: StatusPageThemeTokens,
	isDark: boolean
): StandardStyles => {
	const heatCellBg: Record<StandardHeatCell, string> = {
		fast: tokens.up,
		med: `color-mix(in srgb, ${tokens.up} 70%, #ffffff 30%)`,
		slow: tokens.warn,
		down: tokens.down,
		empty: tokens.border,
	};

	const barBg: Record<StandardBarKind, string> = {
		up: tokens.up,
		down: tokens.down,
		empty: tokens.border,
	};

	const gaugeFillBg: Record<StandardGaugeFill, string> = {
		ok: tokens.up,
		warm: tokens.warn,
		hot: tokens.down,
	};

	return {
		page: {
			flex: "1 0 auto",
			maxWidth: 960,
			width: "100%",
			mx: "auto",
			p: { xs: "40px 16px 72px", sm: "56px 24px 88px" },
			fontFamily: SANS_STACK,
			fontSize: 14,
			lineHeight: 1.5,
			color: tokens.text,
			WebkitFontSmoothing: "antialiased",
		},

		top: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			mb: "28px",
		},

		brand: {
			display: "flex",
			alignItems: "center",
			gap: "10px",
			fontWeight: 600,
			fontSize: 15,
			color: tokens.text,
		},
		brandMark: {
			width: 28,
			height: 28,
			borderRadius: "6px",
			display: "grid",
			placeItems: "center",
			flexShrink: 0,
			color: "#ffffff",
			fontWeight: 700,
			fontSize: 12,
			background: tokens.up,
		},
		logoImg: {
			maxHeight: 28,
			maxWidth: 140,
			objectFit: "contain",
		},

		hero: (_tone) => ({
			mb: "28px",
			borderRadius: tokens.radius,
			padding: { xs: "18px 22px", sm: "22px 26px" },
			background: tokens.surface,
			border: `1px solid ${tokens.border}`,
			display: "flex",
			alignItems: "center",
			gap: "16px",
		}),
		heroTitle: {
			m: 0,
			display: "flex",
			alignItems: "center",
			gap: "12px",
			fontSize: { xs: 16, sm: 18 },
			fontWeight: 600,
			lineHeight: 1.3,
			color: tokens.text,
		},
		heroIcon: (tone) => ({
			display: "inline-grid",
			placeItems: "center",
			width: 32,
			height: 32,
			borderRadius: "50%",
			flexShrink: 0,
			background: toneSoft(tone, tokens),
			color: toneColor(tone, tokens),
		}),

		chartSwitchWrap: {
			display: "flex",
			justifyContent: "flex-end",
			mb: "12px",
		},
		chartSwitch: {
			display: "inline-flex",
			border: `1px solid ${tokens.border}`,
			borderRadius: "8px",
			background: tokens.surface,
			p: "3px",
			gap: "2px",
		},
		chartSwitchButton: (active) => ({
			border: 0,
			background: active ? tokens.upSoft : "transparent",
			fontFamily: "inherit",
			fontSize: 11,
			padding: "5px 14px",
			cursor: "pointer",
			color: active ? tokens.up : tokens.textMuted,
			fontWeight: 600,
			textTransform: "uppercase",
			letterSpacing: "0.06em",
			borderRadius: "6px",
			"&:hover": { color: active ? tokens.up : tokens.text },
		}),

		monitorList: {
			listStyle: "none",
			m: 0,
			p: 0,
			display: "flex",
			flexDirection: "column",
			gap: 0,
			background: tokens.surface,
			border: `1px solid ${tokens.border}`,
			borderRadius: tokens.radius,
			overflow: "hidden",
		},
		card: {
			background: tokens.surface,
			borderBottom: `1px solid ${tokens.border}`,
			"&:last-of-type": { borderBottom: 0 },
		},
		cardRow: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr) auto",
			alignItems: "center",
			gap: "16px",
			p: { xs: "14px 16px 10px", sm: "16px 20px 12px" },
		},
		cardLeft: { minWidth: 0 },
		monitorName: {
			fontWeight: 600,
			fontSize: 14,
			color: tokens.text,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		monitorMeta: {
			display: "flex",
			gap: "8px",
			alignItems: "center",
			mt: "4px",
			flexWrap: "wrap",
		},
		pill: {
			fontSize: 10,
			textTransform: "uppercase",
			letterSpacing: "0.07em",
			color: tokens.textMuted,
			background: isDark ? tokens.bg : "#f5f6f8",
			border: `1px solid ${tokens.border}`,
			padding: "2px 8px",
			borderRadius: "4px",
			fontWeight: 600,
		},
		pillHardware: {
			fontSize: 10,
			textTransform: "uppercase",
			letterSpacing: "0.07em",
			padding: "2px 8px",
			borderRadius: "4px",
			fontWeight: 600,
			color: tokens.up,
			background: tokens.upSoft,
			border: `1px solid color-mix(in srgb, ${tokens.up} 30%, transparent)`,
		},
		monitorUrl: {
			fontSize: 11,
			color: tokens.textMuted,
			fontFamily: MONO_STACK,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			maxWidth: 300,
		},

		badge: (tone) => ({
			fontSize: 11,
			fontWeight: 600,
			padding: "4px 10px",
			borderRadius: "999px",
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			whiteSpace: "nowrap",
			background: toneSoft(tone, tokens),
			color: toneColor(tone, tokens),
			"&::before": {
				content: '""',
				width: 6,
				height: 6,
				borderRadius: "50%",
				background: "currentColor",
			},
		}),

		heatmap: {
			padding: { xs: "0 16px 20px", sm: "0 20px 22px" },
			display: "grid",
			gridTemplateColumns: `repeat(${MAX_RECENT_CHECKS}, 1fr)`,
			gap: "3px",
			height: 46,
		},
		heatmapCell: (kind) => ({
			borderRadius: "2px",
			background: heatCellBg[kind],
			opacity: kind === "empty" ? 0.4 : 1,
		}),

		heatmapFooter: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			px: { xs: "16px", sm: "20px" },
			pb: { xs: "14px", sm: "16px" },
			fontSize: 11,
			color: tokens.textMuted,
			fontVariantNumeric: "tabular-nums",
			"& span:nth-of-type(2)": {
				fontWeight: 600,
				color: tokens.up,
			},
		},

		dailyHeatmap: {
			padding: { xs: "0 16px 0", sm: "0 20px 0" },
			display: "grid",
			gridTemplateColumns: "repeat(90, 1fr)",
			gap: "2px",
			height: 40,
		},
		dailyHeatmapCell: (kind) => {
			const bg: Record<DailyCellKind, string> = {
				up: tokens.up,
				degraded: tokens.warn,
				down: tokens.down,
				empty: tokens.border,
			};
			return {
				borderRadius: "3px",
				background: bg[kind],
				opacity: kind === "empty" ? 0.3 : 1,
				transition: "opacity 0.1s",
				"&:hover": { opacity: 0.75, cursor: "default" },
			};
		},

		histogram: {
			padding: { xs: "0 16px", sm: "0 20px" },
			display: "grid",
			gridTemplateColumns: "repeat(90, 1fr)",
			gap: "2px",
			alignItems: "flex-end",
			height: 46,
		},
		bar: (kind, heightPct) => ({
			background: barBg[kind],
			borderRadius: "2px 2px 0 0",
			minHeight: 3,
			opacity: kind === "empty" ? 0.4 : 1,
			height: `${heightPct}%`,
		}),
		chartStats: {
			padding: { xs: "0 16px 18px", sm: "0 20px 20px" },
			color: tokens.textMuted,
			fontSize: 11,
			fontWeight: 500,
			fontVariantNumeric: "tabular-nums",
		},

		infra: {
			padding: { xs: "0 16px 16px", sm: "0 20px 20px" },
			display: "grid",
			gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
			gap: "10px",
		},
		infraEmpty: {
			padding: { xs: "0 16px 16px", sm: "0 20px 20px" },
			color: tokens.textMuted,
			fontSize: 13,
		},
		gauge: {
			border: `1px solid ${tokens.border}`,
			borderRadius: "8px",
			p: "12px 14px",
			background: isDark ? tokens.bg : "#f9fafb",
		},
		gaugeLabel: {
			fontSize: 10,
			color: tokens.textMuted,
			fontWeight: 600,
			textTransform: "uppercase",
			letterSpacing: "0.08em",
		},
		gaugeValue: {
			fontSize: 20,
			fontWeight: 700,
			mt: "2px",
			fontVariantNumeric: "tabular-nums",
			color: tokens.text,
		},
		gaugeBar: {
			height: 4,
			background: tokens.border,
			borderRadius: "2px",
			overflow: "hidden",
			mt: "8px",
		},
		gaugeFill: (level, widthPct) => ({
			display: "block",
			height: "100%",
			background: gaugeFillBg[level],
			borderRadius: "2px",
			width: `${Math.max(0, Math.min(100, widthPct))}%`,
		}),
		gaugeSub: {
			fontSize: 11,
			color: tokens.textMuted,
			mt: "6px",
			fontVariantNumeric: "tabular-nums",
		},

		footer: {
			textAlign: "center",
			color: tokens.textMuted,
			fontSize: 12,
			mt: "40px",
			"& a": {
				color: tokens.up,
				textDecoration: "underline",
				textUnderlineOffset: "3px",
				fontWeight: 600,
			},
		},

		incidentSection: {
			mt: "40px",
		},
		incidentSectionTitle: {
			fontSize: 13,
			fontWeight: 700,
			color: tokens.textMuted,
			textTransform: "uppercase",
			letterSpacing: "0.08em",
			mb: "20px",
			pb: "10px",
			borderBottom: `1px solid ${tokens.border}`,
		},
		// date group header (reused as incidentComment slot for the date label)
		incidentComment: {
			fontSize: 13,
			fontWeight: 600,
			color: tokens.text,
			mt: "24px",
			mb: "10px",
			"&:first-of-type": { mt: 0 },
		},
		incident: {
			background: tokens.surface,
			border: `1px solid ${tokens.border}`,
			borderRadius: tokens.radius,
			p: { xs: "16px 18px", sm: "18px 22px" },
			mb: "10px",
			"&:last-of-type": { mb: 0 },
		},
		incidentHeader: {
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: "16px",
			mb: "4px",
		},
		incidentName: {
			fontWeight: 700,
			fontSize: 15,
			color: tokens.text,
			lineHeight: 1.35,
			flex: 1,
			minWidth: 0,
		},
		incidentBadge: (ongoing) => ({
			fontSize: 11,
			fontWeight: 700,
			padding: "3px 10px",
			borderRadius: "999px",
			whiteSpace: "nowrap",
			flexShrink: 0,
			mt: "2px",
			background: ongoing ? tokens.downSoft : tokens.upSoft,
			color: ongoing ? tokens.down : tokens.up,
			border: `1px solid ${ongoing ? `color-mix(in srgb, ${tokens.down} 25%, transparent)` : `color-mix(in srgb, ${tokens.up} 25%, transparent)`}`,
		}),
		incidentBorderColor: (_ongoing) => "transparent",

		incidentMeta: {
			display: "flex",
			gap: "8px",
			flexWrap: "wrap",
			fontSize: 12,
			color: tokens.textMuted,
			fontVariantNumeric: "tabular-nums",
			mb: "0px",
			"& span + span::before": {
				content: '"·"',
				mr: "8px",
			},
		},

		incidentTimeline: {
			mt: "14px",
			pt: "14px",
			borderTop: `1px solid ${tokens.border}`,
			display: "flex",
			flexDirection: "column",
			gap: "0px",
		},
		incidentTimelineItem: {
			display: "flex",
			gap: "14px",
			py: "10px",
			borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
			"&:last-of-type": { borderBottom: 0, pb: 0 },
		},
		incidentUpdateBadge: (status) => {
			const colorMap: Record<IncidentUpdateStatus, string> = {
				investigating: tokens.down,
				identified: tokens.warn,
				monitoring: tokens.warn,
				resolved: tokens.up,
			};
			const bgMap: Record<IncidentUpdateStatus, string> = {
				investigating: tokens.downSoft,
				identified: tokens.warnSoft,
				monitoring: tokens.warnSoft,
				resolved: tokens.upSoft,
			};
			return {
				flexShrink: 0,
				display: "inline-flex",
				alignItems: "center",
				fontSize: 10,
				fontWeight: 700,
				textTransform: "uppercase",
				letterSpacing: "0.07em",
				padding: "3px 8px",
				borderRadius: "4px",
				mt: "1px",
				height: "fit-content",
				background: bgMap[status],
				color: colorMap[status],
				border: `1px solid color-mix(in srgb, ${colorMap[status]} 20%, transparent)`,
			};
		},
		incidentUpdateMessage: {
			flex: 1,
			fontSize: 13,
			color: tokens.text,
			lineHeight: 1.55,
		},
		incidentUpdateTime: {
			flexShrink: 0,
			fontSize: 11,
			color: tokens.textMuted,
			fontVariantNumeric: "tabular-nums",
			mt: "2px",
			textAlign: "right" as const,
			minWidth: 110,
		},

		// Atlassian / status.io Past Incidents layout
		pastIncidentsTitle: {
			fontSize: { xs: 26, sm: 30 },
			fontWeight: tokens.headingWeight ?? 700,
			color: tokens.text,
			letterSpacing: "-0.01em",
			mt: "56px",
			mb: "28px",
		},
		dayBlock: {
			mb: "32px",
			"&:last-of-type": { mb: 0 },
		},
		dayHeading: {
			fontSize: { xs: 17, sm: 19 },
			fontWeight: 600,
			color: tokens.text,
			letterSpacing: "-0.005em",
			mb: "10px",
		},
		dayDivider: {
			height: "1px",
			background: tokens.border,
			mb: "14px",
		},
		dayEmpty: {
			fontSize: 14,
			color: tokens.textMuted,
			lineHeight: 1.6,
		},
		pastIncident: {
			mb: "20px",
			"&:last-of-type": { mb: 0 },
		},
		pastIncidentTitle: (ongoing) => ({
			display: "inline-block",
			fontSize: 15,
			fontWeight: 600,
			lineHeight: 1.45,
			textDecoration: "none",
			color: ongoing ? tokens.down : tokens.warn,
			mb: "10px",
			cursor: "pointer",
			scrollMarginTop: "80px",
			"&:hover": {
				textDecoration: "underline",
				textUnderlineOffset: "3px",
			},
			"&:focus-visible": {
				outline: `2px solid ${ongoing ? tokens.down : tokens.warn}`,
				outlineOffset: "2px",
				borderRadius: "2px",
			},
		}),
		pastIncidentTimeline: {
			display: "flex",
			flexDirection: "column",
			gap: "14px",
		},
		pastIncidentEntry: {
			display: "flex",
			flexDirection: "column",
			gap: "2px",
		},
		pastIncidentEntryLine: {
			fontSize: 14,
			lineHeight: 1.55,
			color: tokens.text,
		},
		pastIncidentStatus: {
			fontWeight: 600,
			color: tokens.text,
		},
		pastIncidentSeparator: {
			color: tokens.text,
			mx: "6px",
		},
		pastIncidentMessage: {
			color: tokens.text,
		},
		pastIncidentTime: {
			fontSize: 12,
			color: tokens.textMuted,
			fontVariantNumeric: "tabular-nums",
			mt: "2px",
		},
	};
};
