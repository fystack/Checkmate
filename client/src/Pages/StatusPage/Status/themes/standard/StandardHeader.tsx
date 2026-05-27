import Box from "@mui/material/Box";
import { monoFirstChar } from "@/Pages/StatusPage/Status/themes/shared/overallStatus";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { StandardStyles } from "@/Pages/StatusPage/Status/themes/standard/styles";

export const StandardHeader = ({
	statusPage,
	logoSrc,
	styles,
}: SlotProps<StandardStyles>) => (
	<Box sx={styles.brand}>
		{logoSrc ? (
			<Box
				component="img"
				src={logoSrc}
				alt={statusPage.companyName}
				sx={styles.logoImg}
			/>
		) : (
			<Box sx={styles.brandMark}>{monoFirstChar(statusPage.companyName)}</Box>
		)}
		{statusPage.companyName}
	</Box>
);
