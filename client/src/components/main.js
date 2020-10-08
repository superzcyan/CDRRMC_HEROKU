import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Badge,
    ListItemAvatar,
    Avatar,
    Popover,
    SwipeableDrawer,
} from '@material-ui/core';
import Hover from 'material-ui-popup-state/HoverPopover';
import {
    usePopupState,
    bindHover,
    bindPopover,
} from 'material-ui-popup-state/hooks';
import { DomainDisabled, ExitToApp, Image as ImageIcon, Notifications as NotificationsIcon, AccountCircle, Menu as MenuIcon, ExpandLess, ExpandMore, Dashboard as DashboardIcon, AllInbox } from '@material-ui/icons';

// components
import Dashboard from './dashboard/dashboard';
import UserMaintenance from './maintenance/userMaintenance';
import Evacuees from './report/evacuees';
import UserContext from './context/userContext';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: '#383f48',
        width: '100%'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#1e88e5'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaperMobile: {
        width: drawerWidth,
        backgroundColor: '#242a33',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: '#242a33',
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        backgroundColor: '#242a33',
        '@media screen and (max-width: 768px)': {
            display: 'none'
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'flex-start',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: '100vh',
        maxHeight: '100vh'
    },
    drawerFontColor: {
        color: '#8d97ad'
    },
    nested: {
        paddingLeft: theme.spacing(9),
    },
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    notificationPopover: {
        backgroundColor: '#323840',
        width: 100 + theme.spacing(20),
        color: '#fff',
    },
    userPopover: {
        backgroundColor: '#323840',
        width: 100 + theme.spacing(20),
        color: '#fff',
    },
    messagePopover: {
        backgroundColor: '#323840',
        width: 100 + theme.spacing(20),
        color: '#fff',
    },
}));

function Main() {
    const classes = useStyles();
    const theme = useTheme();
    const { userData, setUserData } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const [maintenanceMenu, setMaintenanceMenu] = useState(false);
    const [maintenanceMobileMenu, setMaintenanceMobileMenu] = useState(false);
    const [submitAReportMenu, setSubmitAReportMenu] = useState(false);
    const [notificationPopup, setNotificationPopup] = useState(null);
    const [userPopup, setUserPopup] = useState(null);
    const [page, setPage] = useState("HOME");

    useEffect(() => {
        const data = sessionStorage.getItem('page');
        if (data) setPage(data);
    }, []);
    useEffect(() => {
        sessionStorage.setItem('page', page);
    });

    const handlePage = (value) => {
        setMaintenanceMenu(false);
        setMaintenanceMobileMenu(false);
        setPage(value);
        // setOpen(false);
        setOpenMobile(false);
    };

    const handleDrawer = () => {
        setOpen(!open);
        setMaintenanceMenu(false);
    };

    const handleDrawerMobile = () => {
        setOpenMobile(!openMobile);
        setMaintenanceMobileMenu(false);
    };

    const handleMaintenanceMenu = () => {
        if (open === true) setMaintenanceMenu(!maintenanceMenu);
    };
    const handleMaintenanceMobileMenu = () => {
        if (openMobile === true) setMaintenanceMobileMenu(!maintenanceMobileMenu);
    };

    const handleSubmitAReportMenu = () => {
        if (openMobile === true) setSubmitAReportMenu(!submitAReportMenu);
    };

    const hoverMaintenanceState = usePopupState({
        variant: 'popover',
        popupId: 'maintenancePopover',
    });

    const hoverSarState = usePopupState({
        variant: 'popover',
        popupId: 'sarPopover',
    });

    const logOut = () => {
        setUserData({
            token: undefined,
            user: undefined
        });
        sessionStorage.setItem("auth-token", "");
        sessionStorage.setItem("userData", "");
        sessionStorage.setItem("page", "HOME");
        // Storage.empty();
    }

    return (
        <div className={classes.root}>
            <CssBaseline />

            {
                //region appbar
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        {window.innerWidth <= 558 ?
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => handleDrawerMobile()}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    //[classes.hide]: open,
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                            :
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => handleDrawer()}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    //[classes.hide]: open,
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        <Typography variant="h6" noWrap>
                            CDRRMC Disaster Management System
                        </Typography>

                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="show 17 new notifications" color="inherit" onClick={(e) => setNotificationPopup(e.currentTarget)}>
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Popover
                                // id={id}
                                open={Boolean(notificationPopup)}
                                anchorEl={notificationPopup}
                                onClose={() => setNotificationPopup(null)}
                                anchorOrigin={{
                                    vertical: 60,
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <List className={classes.notificationPopover}>
                                    <ListItem>
                                        <ListItemText primary='Notifications' />
                                    </ListItem>

                                    <Divider />

                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ImageIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary='Sample'
                                            secondary={<Typography style={{ color: '#8d97ad' }}>test</Typography>}
                                        />
                                    </ListItem>
                                </List>
                            </Popover>

                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={(e) => setUserPopup(e.currentTarget)}
                            >
                                <AccountCircle />
                                <Typography style={{ marginLeft: 5 }}>{userData.user.name}</Typography>
                            </IconButton>

                            <Popover
                                // id={id}
                                open={Boolean(userPopup)}
                                anchorEl={userPopup}
                                onClose={() => setUserPopup(null)}
                                anchorOrigin={{
                                    vertical: 60,
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <List className={classes.userPopover}>
                                    <ListItem>
                                        <ListItemText primary='User' />
                                    </ListItem>

                                    <Divider />

                                    <ListItem button onClick={logOut}>
                                        <ListItemIcon style={{ color: '#fff' }}>
                                            <ExitToApp />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary='Logout'
                                        />
                                    </ListItem>
                                </List>
                            </Popover>

                        </div>
                    </Toolbar>
                </AppBar>
                //end region            
            }

            {window.innerWidth <= 558 ?
                //region sidebar
                <Drawer
                    variant="temporary"
                    open={openMobile}
                    onClose={() => handleDrawerMobile()}
                    classes={{
                        paper: classes.drawerPaperMobile,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <div className={classes.toolbar}>
                        {openMobile === true &&
                            <Typography variant="h6" noWrap style={{ color: '#fff' }}>
                                CDRRMC
                            </Typography>
                        }
                    </div>

                    <Divider />

                    <List>
                        <ListItem button component="a" onClick={() => handlePage("HOME")} className={classes.drawerFontColor}>
                            <ListItemIcon className={classes.drawerFontColor}>{<DashboardIcon />}</ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>


                        <ListItem button className={classes.drawerFontColor} onClick={handleMaintenanceMobileMenu}>
                            <ListItemIcon className={classes.drawerFontColor}>{<DomainDisabled />}</ListItemIcon>
                            <ListItemText primary="Maintenance" />
                            {maintenanceMobileMenu ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={maintenanceMobileMenu} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.drawerFontColor}>
                                <ListItem button onClick={() => handlePage("USER_MAINTENANCE")} className={classes.nested}>
                                    <ListItemText primary="User Maintenance" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="List of Barangays" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Department Records" />
                                </ListItem>

                                <ListItem button onClick={() => handlePage("EVACUEES")} className={classes.nested}>
                                    <ListItemText primary="Evacuee Kiosk" />
                                </ListItem>
                            </List>
                        </Collapse>

                        <ListItem button className={classes.drawerFontColor} onClick={handleSubmitAReportMenu}>
                            <ListItemIcon className={classes.drawerFontColor}>{<AllInbox />}</ListItemIcon>
                            <ListItemText primary="Submit a Report" />
                            {submitAReportMenu ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={submitAReportMenu} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.drawerFontColor}>
                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Dep-Ed Reports" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Barangay Reports" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="CSWD Reports" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
                :
                <SwipeableDrawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        {/* <IconButton onClick={handleDrawer}>
                        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton> */}
                        {open === true &&
                            <Typography variant="h6" noWrap style={{ color: '#fff' }}>
                                CDRRMC
                            </Typography>
                        }
                    </div>

                    <Divider />

                    <List>
                        {open === false ?
                            <ListItem button component="a" onClick={() => handlePage("HOME")} className={classes.drawerFontColor}>
                                <ListItemIcon className={classes.drawerFontColor}>{<DashboardIcon style={{ height: '40px', width: '40px' }} />}</ListItemIcon>
                            </ListItem>
                            :
                            <ListItem button component="a" onClick={() => handlePage("HOME")} className={classes.drawerFontColor}>
                                <ListItemIcon className={classes.drawerFontColor}>{<DashboardIcon />}</ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                        }

                        {open === false ?
                            <ListItem button {...bindHover(hoverMaintenanceState)}>
                                <ListItemIcon className={classes.drawerFontColor}>{<DomainDisabled style={{ height: '40px', width: '40px' }} />}</ListItemIcon>
                                <Hover
                                    {...bindPopover(hoverMaintenanceState)}
                                    anchorOrigin={{
                                        vertical: -10,
                                        horizontal: 220,
                                        backgroundColor: '#242a33'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    disableRestoreFocus
                                >
                                    <List component="div" disablePadding className={classes.drawerFontColor} style={{ backgroundColor: '#242a33', width: 300 }}>
                                        <ListItem>
                                            <h2>Maintenance</h2>
                                        </ListItem>
                                        <Divider />

                                        <ListItem button onClick={() => handlePage("USER_MAINTENANCE")}>
                                            <ListItemText primary="User Maintenance" />
                                        </ListItem>

                                        <ListItem button>
                                            <ListItemText primary="List of Barangays" />
                                        </ListItem>

                                        <ListItem button>
                                            <ListItemText primary="Department Records" />
                                        </ListItem>

                                        <ListItem button onClick={() => handlePage("EVACUEES")}>
                                            <ListItemText primary="Evacuee Kiosk" />
                                        </ListItem>
                                    </List>
                                </Hover>
                            </ListItem>
                            :
                            <ListItem button className={classes.drawerFontColor} onClick={handleMaintenanceMenu}>
                                <ListItemIcon className={classes.drawerFontColor}>{<DomainDisabled />}</ListItemIcon>
                                <ListItemText primary="Maintenance" />
                                {maintenanceMenu ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                        }

                        <Collapse in={maintenanceMenu} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.drawerFontColor}>
                                <ListItem button onClick={() => handlePage("USER_MAINTENANCE")} className={classes.nested}>
                                    <ListItemText primary="User Maintenance" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="List of Barangays" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Department Records" />
                                </ListItem>

                                <ListItem button onClick={() => handlePage("EVACUEES")} className={classes.nested}>
                                    <ListItemText primary="Evacuee Kiosk" />
                                </ListItem>
                            </List>
                        </Collapse>

                        {open === false ?
                            <ListItem button {...bindHover(hoverSarState)}>
                                <ListItemIcon className={classes.drawerFontColor}>{<AllInbox style={{ height: '40px', width: '40px' }} />}</ListItemIcon>
                                <Hover
                                    {...bindPopover(hoverSarState)}
                                    anchorOrigin={{
                                        vertical: -10,
                                        horizontal: 220,
                                        backgroundColor: '#242a33'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    disableRestoreFocus
                                >
                                    <List component="div" disablePadding className={classes.drawerFontColor} style={{ backgroundColor: '#242a33', width: 300 }}>
                                        <ListItem>
                                            <h2>Submit a Report</h2>
                                        </ListItem>
                                        <Divider />
                                        <ListItem button>
                                            <ListItemText primary="Dep-Ed Reports" />
                                        </ListItem>

                                        <ListItem button>
                                            <ListItemText primary="Barangay Reports" />
                                        </ListItem>

                                        <ListItem button>
                                            <ListItemText primary="CSWD Reports" />
                                        </ListItem>
                                    </List>
                                </Hover>
                            </ListItem>
                            :
                            <ListItem button className={classes.drawerFontColor} onClick={handleSubmitAReportMenu}>
                                <ListItemIcon className={classes.drawerFontColor}>{<AllInbox />}</ListItemIcon>
                                <ListItemText primary="Submit a Report" />
                                {submitAReportMenu ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                        }

                        <Collapse in={submitAReportMenu} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.drawerFontColor}>
                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Dep-Ed Reports" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Barangay Reports" />
                                </ListItem>

                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="CSWD Reports" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </SwipeableDrawer>
                //end region 
            }

            {
                //region content
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {page === "HOME" &&
                        <Dashboard />
                    }
                    {page === "USER_MAINTENANCE" &&
                        <UserMaintenance />
                    }
                    {page === "EVACUEES" &&
                        <Evacuees />
                    }
                </main>
                //end region
            }
        </div >
    );
}

export default React.memo(Main);
