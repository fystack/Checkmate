import type { SxProps, Theme } from "@mui/material/styles";
import { MAX_RECENT_CHECKS } from "@/Types/Monitor";
import type { StatusPage } from "@/Types/StatusPage";
import type { StatusPageThemeTokens } from "../tokens";
import { type OverallTone, toneColor, toneSoft } from "../shared/overallStatus";
import { MONO_STACK, SANS_STACK } from "../shared/fontStacks";

export type RefinedHeatCell = "fast" | "med" | "slow" | "down" | "empty";
export type RefinedBarKind = "up" | "down" | "empty";
export type RefinedGaugeFill = "ok" | "warm" | "hot";

export interface RefinedStyles {
	page: SxProps<Theme>;
	top: SxProps<Theme>;
	brand: SxProps<Theme>;
	logoMono: SxProps<Theme>;
	logoImg: SxProps<Theme>;
	company: SxProps<Theme>;
	hero: SxProps<Theme>;
	statusDot: (tone: OverallTone) => SxProps<Theme>;
	statusCopy: SxProps<Theme>;
	heroTitle: SxProps<Theme>;
	heroSub: SxProps<Theme>;
	heroIcon: (tone: OverallTone) => SxProps<Theme>;
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
	heatmapCell: (kind: RefinedHeatCell) => SxProps<Theme>;
	histogram: SxProps<Theme>;
	bar: (kind: RefinedBarKind, heightPct: number) => SxProps<Theme>;
	chartStats: SxProps<Theme>;
	infra: SxProps<Theme>;
	infraEmpty: SxProps<Theme>;
	gauge: SxProps<Theme>;
	gaugeLabel: SxProps<Theme>;
	gaugeValue: SxProps<Theme>;
	gaugeBar: SxProps<Theme>;
	gaugeFill: (level: RefinedGaugeFill, widthPct: number) => SxProps<Theme>;
	gaugeSub: SxProps<Theme>;
	footer: SxProps<Theme>;
}

const defaultAccent = "#4e7eea";

const cardShadow = "0 1px 2px rgba(17, 24, 39, 0.04), 0 10px 26px rgba(46, 64, 96, 0.07)";
const cardShadowHover =
	"0 2px 6px rgba(17, 24, 39, 0.05), 0 16px 34px rgba(46, 64, 96, 0.1)";

const pillBase = {
	fontSize: 10,
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
	padding: "2px 8px",
	borderRadius: "999px",
	fontWeight: 600,
};

const resolveAccent = (color: string | undefined) =>
	/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color ?? "") ? color : defaultAccent;

export const refinedStyles = (
	tokens: StatusPageThemeTokens,
	_isDark: boolean,
	statusPage?: StatusPage
): RefinedStyles => {
	const accent = resolveAccent(statusPage?.color);
	const accentSoft = _isDark
		? `color-mix(in srgb, ${accent} 18%, ${tokens.surface} 82%)`
		: `color-mix(in srgb, ${accent} 12%, #ffffff 88%)`;
	const accentBorder = _isDark
		? `color-mix(in srgb, ${accent} 36%, ${tokens.border} 64%)`
		: `color-mix(in srgb, ${accent} 28%, #ffffff 72%)`;

	const heatCellBg: Record<RefinedHeatCell, string> = {
		fast: tokens.up,
		med: `color-mix(in srgb, ${tokens.up} 60%, #ffffff 40%)`,
		slow: tokens.warn,
		down: tokens.down,
		empty: tokens.border,
	};

	const barBg: Record<RefinedBarKind, string> = {
		up: tokens.up,
		down: tokens.down,
		empty: tokens.border,
	};

	const gaugeFillBg: Record<RefinedGaugeFill, string> = {
		ok: tokens.up,
		warm: tokens.warn,
		hot: tokens.down,
	};

	return {
		page: {
			flex: "1 0 auto",
			maxWidth: 1040,
			width: "100%",
			mx: "auto",
			p: { xs: "32px 16px 64px", sm: "48px 24px 80px" },
			fontFamily: SANS_STACK,
			fontSize: 14,
			lineHeight: 1.5,
			color: tokens.text,
			WebkitFontSmoothing: "antialiased",
			position: "relative",
			"&::before": {
				content: '""',
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				height: "3px",
				background: `linear-gradient(90deg, ${accent} 0%, ${tokens.up} 100%)`,
				pointerEvents: "none",
			},
		},

		top: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			mb: "30px",
		},
		brand: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			fontWeight: 700,
			color: tokens.text,
		},
		logoMono: {
			width: 34,
			height: 34,
			borderRadius: "10px",
			background: accent,
			display: "grid",
			placeItems: "center",
			color: "#fff",
			fontWeight: 700,
			fontSize: 14,
			boxShadow: `0 8px 18px color-mix(in srgb, ${accent} 24%, transparent)`,
		},
		logoImg: { maxHeight: 42, maxWidth: 160, objectFit: "contain" },
		company: { fontSize: 15, lineHeight: 1.2 },

		hero: {
			background: tokens.surface,
			border: `1px solid ${tokens.border}`,
			borderRadius: tokens.radius,
			padding: { xs: "20px", sm: "24px 28px" },
			display: "flex",
			alignItems: "center",
			gap: "18px",
			boxShadow: cardShadow,
			mb: "24px",
			position: "relative",
			overflow: "hidden",
			"&::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				bottom: 0,
				width: "5px",
				background: accent,
			},
		},
		statusDot: (tone) => ({
			width: 12,
			height: 12,
			borderRadius: "50%",
			background: toneColor(tone, tokens),
			boxShadow: `0 0 0 4px ${toneSoft(tone, tokens)}`,
			flexShrink: 0,
			ml: "2px",
		}),
		statusCopy: { flex: 1, minWidth: 0 },
		heroTitle: {
			m: 0,
			mb: "2px",
			fontSize: { xs: 18, sm: 20 },
			fontWeight: 700,
			color: tokens.text,
		},
		heroSub: { m: 0, color: tokens.textMuted, fontSize: 14, fontWeight: 500 },
		heroIcon: (tone) => ({
			color: toneColor(tone, tokens),
			display: "flex",
			alignItems: "center",
			background: toneSoft(tone, tokens),
			borderRadius: "999px",
			p: "5px",
		}),

		chartSwitchWrap: { display: "flex", justifyContent: "flex-end", mb: "16px" },
		chartSwitch: {
			display: "inline-flex",
			border: `1px solid ${tokens.border}`,
			borderRadius: "8px",
			background: tokens.surface,
			p: "4px",
			gap: "2px",
			boxShadow: "0 1px 2px rgba(17, 24, 39, 0.04)",
		},
		chartSwitchButton: (active) => ({
			border: 0,
			background: active ? accentSoft : "transparent",
			fontFamily: "inherit",
			fontSize: 12,
			padding: "6px 16px",
			cursor: "pointer",
			color: active ? accent : tokens.textMuted,
			borderRadius: "5px",
			transition: "background 0.15s ease, color 0.15s ease",
			fontWeight: active ? 700 : 600,
			"&:hover": { color: active ? accent : tokens.text },
		}),

		monitorList: {
			listStyle: "none",
			m: 0,
			p: 0,
			display: "flex",
			flexDirection: "column",
			gap: "14px",
		},
		card: {
			background: tokens.surface,
			border: `1px solid ${tokens.border}`,
			borderRadius: tokens.radius,
			boxShadow: cardShadow,
			overflow: "hidden",
			position: "relative",
			transition: "transform 0.15s, box-shadow 0.15s",
			"&::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: "3px",
				background: accentSoft,
			},
			"&:hover": { transform: "translateY(-1px)", boxShadow: cardShadowHover },
		},
		cardRow: {
			display: "grid",
			gridTemplateColumns: "1fr auto",
			alignItems: "center",
			gap: "16px",
			p: { xs: "18px 18px 14px", sm: "20px 24px 16px" },
		},
		cardLeft: { minWidth: 0 },
		monitorName: {
			fontWeight: 600,
			fontSize: 15,
			color: tokens.text,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		monitorMeta: {
			display: "flex",
			gap: "10px",
			alignItems: "center",
			mt: "4px",
			flexWrap: "wrap",
		},
		pill: {
			...pillBase,
			color: tokens.textMuted,
			border: `1px solid ${tokens.border}`,
			background: "#fff",
		},
		pillHardware: {
			...pillBase,
			color: accent,
			border: `1px solid ${accentBorder}`,
			background: accentSoft,
		},
		monitorUrl: {
			fontSize: 12,
			color: tokens.textMuted,
			fontFamily: MONO_STACK,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			maxWidth: 280,
		},

		badge: (tone) => ({
			fontSize: 12,
			fontWeight: 700,
			padding: "6px 12px",
			borderRadius: "999px",
			whiteSpace: "nowrap",
			background: toneSoft(tone, tokens),
			color: toneColor(tone, tokens),
		}),

		heatmap: {
			padding: { xs: "0 18px 20px", sm: "0 24px 22px" },
			display: "grid",
			gridTemplateColumns: `repeat(${MAX_RECENT_CHECKS}, 1fr)`,
			gap: "4px",
			height: 44,
		},
		heatmapCell: (kind) => ({
			borderRadius: "3px",
			background: heatCellBg[kind],
			opacity: kind === "empty" ? 0.4 : 1,
			transition: "transform 0.15s",
			"&:hover": { transform: "scaleY(1.15)" },
		}),

		histogram: {
			padding: { xs: "0 18px", sm: "0 24px" },
			display: "grid",
			gridTemplateColumns: `repeat(${MAX_RECENT_CHECKS}, 1fr)`,
			gap: "4px",
			alignItems: "flex-end",
			height: 44,
		},
		bar: (kind, heightPct) => ({
			background: barBg[kind],
			borderRadius: "3px 3px 0 0",
			minHeight: 3,
			opacity: kind === "empty" ? 0.4 : 1,
			height: `${heightPct}%`,
		}),
		chartStats: {
			padding: { xs: "0 18px 20px", sm: "0 24px 22px" },
			fontSize: 11,
			color: tokens.textMuted,
			fontVariantNumeric: "tabular-nums",
		},

		infra: {
			padding: "14px 20px 18px",
			display: "grid",
			gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
			gap: "12px",
		},
		infraEmpty: {
			padding: "14px 20px 18px",
			color: tokens.textMuted,
			fontSize: 13,
		},
		gauge: {
			border: `1px solid ${tokens.border}`,
			borderRadius: "10px",
			p: "12px 14px",
			background: tokens.bg,
		},
		gaugeLabel: {
			fontSize: 11,
			color: tokens.textMuted,
			textTransform: "uppercase",
			letterSpacing: "0.08em",
			fontWeight: 600,
		},
		gaugeValue: {
			fontSize: 20,
			fontWeight: 600,
			letterSpacing: "-0.01em",
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
			transition: "width 0.6s",
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
				"&:hover": { color: tokens.upStrong || tokens.up },
			},
		},
	};
};
