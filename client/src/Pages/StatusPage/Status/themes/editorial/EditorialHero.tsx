import { useMemo } from "react";
import Box from "@mui/material/Box";
import type { SlotProps } from "@/Pages/StatusPage/Status/themes/shared/BaseStatusPage";
import type { EditorialStyles } from "@/Pages/StatusPage/Status/themes/editorial/styles";

export const EditorialHero = ({
	overall,
	styles,
}: SlotProps<EditorialStyles>) => {
	const todayLabel = useMemo(
		() =>
			new Date().toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
		[]
	);

	return (
		<>
			<Box
				component="p"
				sx={styles.statusLine}
			>
				<Box
					component="span"
					sx={styles.statusDot(overall.tone)}
				/>
				{overall.message}
			</Box>
			<Box
				component="p"
				sx={styles.dateline}
			>
				{todayLabel}
			</Box>
		</>
	);
};
