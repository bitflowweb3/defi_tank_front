import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface RatingProps {
	count: number
	progress: number
}

const Rating = ({ count, progress }: RatingProps) => {
	return (
		<RatingWrapper progress={progress * 10}>
			<Typography variant="body1">{count}</Typography>
		</RatingWrapper>
	)
}

const RatingWrapper = styled(Stack)<{ progress: number }>(({ theme, progress }) => ({
	position: "relative",

	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",

	width: 40,
	height: 40,
	overflow: "hidden",
	borderRadius: "100%",
	color: theme.palette.common.ratingColor,
	background: `conic-gradient(${theme.palette.common.ratingBackground} ${progress + 1}%, ${theme.palette.common.ratingBoxShadow} 0 100%)`,

	"&:after": {
		content: '""',
		position: "absolute",

		zIndex: 1,
		inset: "5px",
		borderRadius: "inherit",
		background: theme.palette.common.ratingBorderColor,
	},

	p: {
		zIndex: 2,
		overflow: "hidden",
		whiteSpace: "noWrap",
		textOverflow: "ellipsis",
		maxWidth: "calc(100% - 10px)",
		textAlign: "center",
	}
}))

export { Rating }