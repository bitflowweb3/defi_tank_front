import { styled } from "@mui/material/styles";
import { Stack, Paper } from "@mui/material";
import { LinearProgress, linearProgressClasses } from "@mui/material";

const ChampionBadgeContainer = styled(Stack)(({ theme }) => ({
    left: 0, top: 8,
    position: 'absolute',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    cursor: 'pointer',
    userSelect: "none",

    'img': {
        width: '20%',
    },

    'h5': {
        fontSize: 25,
        fontWeight: 600,
        color: '#207f22 !important',
    },

    'h6': {
        fontSize: 18,
        fontWeight: 600,
        color: '#207f22 !important',
    }
}))

const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 10,
    border: '1px solid #777',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: "transparent",
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: "#973800"
    }
}))

const ItemContainer = styled(Paper)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
    },
    [theme.breakpoints.up('sm')]: {
        flexDirection: "row",
    },
    background: "transparent",
    padding: theme.spacing(1),
    textAlign: "center",
    boxShadow: "none",
    display: "flex",
    gap: "10px",
}))

const menuStyle = {
    padding: '0.6rem 1rem',
    backgroundColor: '#000000a8',
    borderBottom: '1px solid #222'
}

export { ChampionBadgeContainer, BorderLinearProgress, ItemContainer, menuStyle }