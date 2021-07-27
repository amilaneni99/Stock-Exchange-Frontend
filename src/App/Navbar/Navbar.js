import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Avatar } from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import UserAuthService from '../UserAuthService';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '70px'
    },
    title: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    container: {
        height: '70px',
        display: 'flex',
        flexDirection:'row'
    },
    orange: {
        color: theme.palette.getContrastText('#E84545'),
        backgroundColor: '#E84545',
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
}));

export default function Navbar(props) {
    const classes = useStyles();
    const {initials} = props;
    const {setUser, user} = UserAuthService();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = (index) => {
        setAnchorEl(null);
        switch (index) {
            case 1:
                window.location.href="/profile"
                break;
            case 2:
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('token');
                window.location.href="/"
                break;
            default:
                break;
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.container}>
                    <Typography style={{fontFamily: 'Zen Tokyo Zoo, cursive', fontSize: '48px'}} variant="h6" className={classes.title}>
                        Stocked
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar className={classes.orange}>{initials}</Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={() => handleClose(0)}
                        >
                            <MenuItem onClick={() => handleClose(1)}>Profile</MenuItem>
                            <MenuItem onClick={() => handleClose(2)}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}