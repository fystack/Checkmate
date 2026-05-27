import Box from "@mui/material/Box";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { StandardStyles } from "@/Pages/StatusPage/Status/themes/standard/styles";

export const StandardHero = ({ overall, styles }: SlotProps<StandardStyles>) => (
	<Box sx={styles.hero(overall.tone)}>
		<Box
			component="h1"
			sx={styles.heroTitle}
		>
			<Box
				component="span"
				sx={styles.heroIcon(overall.tone)}
			>
				{overall.icon}
			</Box>
			{overall.message}
		</Box>
	</Box>
);
