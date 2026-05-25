import Box from "@mui/material/Box";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { ModernStyles } from "@/Pages/StatusPage/Status/themes/modern/styles";

export const ModernHero = ({
	overall,
	styles,
}: SlotProps<ModernStyles>) => {
	return (
		<Box sx={styles.hero}>
			<Box sx={styles.pulse(overall.tone)} />
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
