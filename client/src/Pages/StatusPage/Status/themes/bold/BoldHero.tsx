import Box from "@mui/material/Box";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { BoldStyles } from "@/Pages/StatusPage/Status/themes/bold/styles";

export const BoldHero = ({ overall, styles }: SlotProps<BoldStyles>) => {
	return (
		<Box sx={styles.hero}>
			<Box
				component="h1"
				sx={styles.heroTitle}
			>
				<Box
					component="span"
					sx={styles.heroCheck(overall.tone)}
				>
					{overall.icon}
				</Box>
				{overall.message}
			</Box>
		</Box>
	);
};
