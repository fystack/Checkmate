import Box from "@mui/material/Box";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { RefinedStyles } from "@/Pages/StatusPage/Status/themes/refined/styles";

export const RefinedHero = ({
	overall,
	styles,
}: SlotProps<RefinedStyles>) => {
	return (
		<Box sx={styles.hero}>
			<Box sx={styles.statusDot(overall.tone)} />
			<Box sx={styles.statusCopy}>
				<Box
					component="h1"
					sx={styles.heroTitle}
				>
					{overall.message}
				</Box>
			</Box>
			<Box sx={styles.heroIcon(overall.tone)}>{overall.icon}</Box>
		</Box>
	);
};
