import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Button, ButtonProps } from '@mui/material';

const HeaderButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    paddingInline: "15px",
    paddingBlock: '10px',
    borderRadius: '50px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    }
}))

const HeaderLink = styled("a")(({ theme }) => ({
    color: theme.palette.primary.main,
    border: 'none',
    backgroundColor: theme.palette.primary.light,
    borderRadius: '50px',
    minWidth: '80px',
    fontWeight: 'bold',
    textDecoration: "none",
    padding: "8px 8px",
    lineHeight: "1.75",
    fontSize: "0.875rem",
    alignSelf: "center",
    textAlign: "center",
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        border: 'none',
    }
}))

const ActionButton1 = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'rgba(250, 105, 0, 1)',
    border: 'none',
    backgroundColor: 'rgba(66, 66, 66, 1)',
    paddingInline: "1.2rem",
    borderRadius: '50px',
    minWidth: '80px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'rgba(56, 56, 56, 1)',
        border: 'none',
    }
}))

const ActionButton2 = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(250, 105, 0, 0.85)',
    border: 'none',
    borderRadius: '50px',
    fontWeight: 'bold',
    paddingInline: "1.2rem",
    minWidth: '80px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(250, 105, 0, 1)',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.9)'
    }
}))

const DownloadButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'white',
    cursor: 'pointer',
    width: '70px',
    height: '70px',
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: '8px',
    padding: '1rem 3rem',
    boxSizing: 'border-box',
    margin: '8px 1rem'
}))

const ActionLoadingButton1 = styled(LoadingButton)<any>(({ theme }) => ({
    color: theme.palette.primary.main,
    border: 'none',
    backgroundColor: theme.palette.primary.light,
    paddingInline: "1.2rem",
    paddingBlock: "1rem",
    borderRadius: '50px',
    minWidth: '80px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        border: 'none',
    }
}))

export { HeaderButton, HeaderLink, ActionButton1, ActionButton2, DownloadButton, ActionLoadingButton1 }