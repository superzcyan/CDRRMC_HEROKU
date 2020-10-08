import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, fade, withStyles, ThemeProvider } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { Paper, TextField, Typography, Divider, Slide, Modal, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent, Fade, Snackbar, FormControl, InputLabel, Button, Backdrop, InputAdornment, Tooltip, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, Input, OutlinedInput } from '@material-ui/core';
import { Add as AddIcon, FilterList as FilterListIcon, Edit, Delete, VpnKey, Visibility, VisibilityOff } from '@material-ui/icons';
import Select from 'react-select';
//Components
import UsersLoading from './usersLoader';
const axios = require('axios');

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        //   backgroundColor: theme.palette.common.black,
        backgroundColor: '#272c33',
        color: theme.palette.common.white,
        // minWidth: 180
    },
    body: {
        // minWidth: 180
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            // backgroundColor: theme.palette.action.hover,
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const customSelectStyle = {
    control: base => ({
        ...base,
        height: 56,
        minHeight: 56,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
    }),
};

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        width: '100%',
        padding: 15,
        '@media screen and (max-width: 768px)': {
            padding: 0
        }
    },
    titleDiv: {
        color: '#1e88e5',
        marginBottom: '20px',
    },
    contentDiv: {
        width: '100%',
        height: '100%',
        maxHeight: '300vh',
        backgroundColor: '#272c33',
        padding: '15px',
        borderRadius: 5
    },
    paper: {
        width: '100%'
    },
    root: {
        width: '100%',
        backgroundColor: '#272c33',
    },
    container: {
        height: '54vh',
        maxHeight: '54vh',
        '@media screen and (max-width: 768px)': {
            overflowX: 'auto',
            maxWidth: '50vh',
            width: '50vh',
        }
    },
    table: {
        minWidth: 650,
        tableLayout: 'fixed',
        overflowX: 'auto'
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        '@media screen and (max-width: 768px)': {
            fontSize: 11
        }
    },
    tableCell: {
        fontSize: 17,
        '@media screen and (max-width: 768px)': {
            fontSize: 10
        }
    },
    addModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addModalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10,
        width: '25%',
        '@media screen and (max-width: 768px)': {
            width: '70%'
        }
    },
    input: {
        color: '#67757c',
    },
}));

function UserMaintenance() {
    const classes = useStyles();
    const [usersData, setUsersData] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [id, setId] = useState(-1);
    const [displayName, setDisplayName] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [barangay, setBarangay] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [saveSnackbar, setSaveSnackbar] = useState(false);
    const [deleteSnackbar, setDeleteSnackbar] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [btnAddLoading, setBtnAddLoading] = useState(false);
    const [btnEditLoading, setBtnEditLoading] = useState(false);
    const [btnDelLoading, setBtnDelLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        var route = 'users';
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios.get(url, {
            headers: { "auth-token": token },
        })
            .then(function (response) {
                // handle success
                // console.log('Result:' + JSON.stringify(response.data));
                if (Array.isArray(response.data)) {
                    setUsersData(response.data);
                    setUsersLoading(false);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setUsersData(obj);
                    setUsersLoading(false);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setUsersLoading(false);
            })
            .finally(function () {
                // always executed
            });
    }, [usersData]);

    const usersList = usersData ? usersData.map(x => ({
        id: x._id,
        name: x.name,
        userName: x.userName,
        role: x.role,
        barangay: x.barangay
    })) : [];

    const onRegister = () => {
        setBtnAddLoading(true);
        const url = window.apihost + "users";
        const newUser = {
            "name": displayName,
            "userName": userName,
            "role": role,
            //   "barangay": barangay,
            "password": password,
            "passwordCheck": passwordCheck
        };
        axios.post(url, newUser)
            .then(function (response) {
                // handle success
                setAddModal(false);
                setSaveSnackbar(true);
                setBtnAddLoading(false);
                setDisplayName("");
                setUserName("");
                setRole("");
                setBarangay("");
                setPassword("");
                setPasswordCheck("");
            })
            .catch(err => {
                const errors = {
                    msg: err.response.data,
                    status: err.response.status
                }
                alert(JSON.stringify(errors));
                setBtnAddLoading(false);
            });
    }

    const handleAddModal = () => {
        setAddModal(true);
    }

    const handleCloseModal = () => {
        setAddModal(false);
        setEditModal(false);
        setId(-1);
        setDisplayName("");
        setUserName("");
        setRole("");
        setBarangay("");
        setPassword("");
        setPasswordCheck("");
    }

    const handleEditModal = (e) => {
        setEditModal(true);
        setId(e.id);
        setDisplayName(e.name);
        setUserName(e.userName);
        setRole(e.role);
        // setBarangay(e.barangay);
        // setPassword("");
        // setPasswordCheck("");
    }

    const onEdit = () => {
        setBtnEditLoading(true);
        var token = sessionStorage.getItem("auth-token");
        var url = window.apihost + `users/${id}/`;
        var data = {
            // 'id': id,
            "name": displayName,
            "userName": userName,
            "role": role,
            // "barangay": barangay
        };
        axios.put(url, data, {
            headers: { "auth-token": token }
        })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    setEditModal(false);
                    setSaveSnackbar(true);
                    setId(-1);
                    setDisplayName("");
                    setUserName("");
                    setRole("");
                    setBarangay("");
                    setPassword("");
                    setPasswordCheck("");
                    setBtnEditLoading(false);
                }
            })
            .catch(err => {
                const errors = {
                    msg: err.response.data,
                    status: err.response.status
                }
                if (err.response.status > 200) {
                    alert("ERROR: " + err.response.data.message + " Status: " + err.response.status);
                    setBtnEditLoading(false);
                }
            });
    }

    const handleOpenDelModal = (e) => {
        setDeleteModal(true);
        setId(e);
    }

    const handleCloseDelModal = () => {
        setDeleteModal(false);
        setId(-1);
        setAddModal(false);
        setBtnDelLoading(false);
        setDisplayName("");
        setUserName("");
        setRole("");
        setBarangay("");
        setPassword("");
        setPasswordCheck("");
    }

    const handleDelete = () => {
        setBtnDelLoading(true);
        const token = sessionStorage.getItem('auth-token');
        const url = window.apihost + `users/${id}/`;
        axios
            .delete(url, {
                headers: { "auth-token": token }
            })
            .then(res => {
                if (res.status <= 200) {
                    setId(-1);
                    setDeleteModal(false);
                    setDeleteSnackbar(true);
                    setBtnDelLoading(false);
                    setDisplayName("");
                    setUserName("");
                    setRole("");
                    setBarangay("");
                    setPassword("");
                    setPasswordCheck("");
                }
            })
            .catch(err => {
                const errors = {
                    msg: err.response.data,
                    status: err.response.status
                }
                if (err.response.status > 200) {
                    alert("ERROR: " + err.response.data.message + " Status: " + err.response.status);
                    setDeleteModal(false);
                    setBtnDelLoading(false);
                }
            });
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleDisplayName = (e) => {
        setDisplayName(e.target.value);
    }

    const handleUserName = (e) => {
        setUserName(e.target.value);
    }

    const handleRole = (e) => {
        setRole(e.target.value);
    }

    const handleBarangay = (e) => {
        setBarangay(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handlePasswordCheck = (e) => {
        setPasswordCheck(e.target.value);
    }

    return (
        <div className={classes.mainDiv}>
            <div className={classes.titleDiv}>
                <Typography variant='h5'>Users Records</Typography>
            </div>

            <div className={classes.contentDiv}>
                <Typography variant='h6' style={{ color: '#fff' }}>All User Data</Typography>

                <Divider /><br />

                <Button variant="contained" style={{ backgroundColor: '#24d2b5', color: '#fff' }} onClick={handleAddModal} disableElevation startIcon={<AddIcon />}>
                    Create User
                </Button>

                <br /><br />
                <Divider />

                <Paper className={classes.root}>
                    <TableContainer component={Paper} className={classes.container}>
                        <Table className={classes.table} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell className={classes.tableHeader}>Display Name</StyledTableCell>
                                    <StyledTableCell className={classes.tableHeader}>Username</StyledTableCell>
                                    <StyledTableCell className={classes.tableHeader}>Role</StyledTableCell>
                                    <StyledTableCell className={classes.tableHeader}>Barangay</StyledTableCell>
                                    <StyledTableCell className={classes.tableHeader} align='center'>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersData !== null && usersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(x =>
                                    <StyledTableRow key={x.id}>
                                        <StyledTableCell className={classes.tableCell}>
                                            {x.name}
                                        </StyledTableCell>

                                        <StyledTableCell className={classes.tableCell}>
                                            {x.userName}
                                        </StyledTableCell>

                                        <StyledTableCell className={classes.tableCell}>
                                            {x.role}
                                        </StyledTableCell>

                                        <StyledTableCell className={classes.tableCell}>
                                            {x.barangay}
                                        </StyledTableCell>

                                        <StyledTableCell align='center'>
                                            <Tooltip title='Edit'>
                                                <IconButton aria-label="edit" onClick={() => handleEditModal(x)}>
                                                    <Edit fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title='Change Password'>
                                                <IconButton aria-label="password">
                                                    <VpnKey fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title='Delete'>
                                                <IconButton aria-label="delete" onClick={() => handleOpenDelModal(x.id)}>
                                                    <Delete fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                            {usersLoading === true &&
                                <UsersLoading />
                            }
                        </Table>
                    </TableContainer>
                    <TablePagination
                        style={{ color: '#fff' }}
                        rowsPerPageOptions={rowsPerPage}
                        component="div"
                        count={usersList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                    />
                </Paper>
            </div>

            <Dialog
                open={deleteModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDelModal}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <div style={{ backgroundColor: '#272c33' }}>
                    <DialogTitle id="alert-dialog-slide-title" style={{ color: 'red' }}>{"Warning!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" style={{ color: '#fff' }}>
                            Are you sure you want to delete this user?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={handleCloseDelModal}>
                            No
                        </Button>
                        <Button variant='contained' disabled={btnDelLoading} onClick={handleDelete}>
                            Yes
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                autoHideDuration={6000}
                open={saveSnackbar}
                onClose={() => setSaveSnackbar(false)}
            >
                <Alert onClose={() => setSaveSnackbar(false)} severity="success">
                    Successfully Saved!
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                autoHideDuration={6000}
                open={deleteSnackbar}
                onClose={() => setDeleteSnackbar(false)}
            >
                <Alert onClose={() => setSaveSnackbar(false)} severity="success">
                    Successfully Deleted!
                </Alert>
            </Snackbar>

            {
                // region add modal
                <Modal
                    open={addModal}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.addModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={addModal}>
                        <div className={classes.addModalPaper}>
                            <ThemeProvider>
                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Display Name" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={displayName}
                                        onChange={e => handleDisplayName(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Username" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={userName}
                                        onChange={e => handleUserName(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Role" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={role}
                                        onChange={e => handleRole(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Barangay" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={barangay}
                                        onChange={e => handleBarangay(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth>
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput id="outlined-basic" size='medium' fullWidth label="Password" variant="outlined"
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            value={password}
                                            onChange={e => handlePassword(e)}
                                        />
                                    </FormControl>
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth>
                                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                        <OutlinedInput as='TextField' id="outlined-basic" size='medium' fullWidth label="Confirm Password" variant="outlined"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownConfirmPassword}
                                                    >
                                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            value={passwordCheck}
                                            onChange={e => handlePasswordCheck(e)}
                                        />
                                    </FormControl>
                                </div>
                            </ThemeProvider>

                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                <Button variant='contained' size='large' style={{ float: 'right', marginLeft: 10 }} disabled={btnAddLoading} disableElevation onClick={onRegister}>
                                    Save
                            </Button>

                                <Button variant='contained' size='large' style={{ float: 'right' }} disableElevation onClick={handleCloseModal}>
                                    Cancel
                            </Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
                // end region
            }

            {
                // region edit modal
                <Modal
                    open={editModal}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.addModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={editModal}>
                        <div className={classes.addModalPaper}>
                            <ThemeProvider>
                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Display Name" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={displayName}
                                        onChange={e => handleDisplayName(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Username" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={userName}
                                        onChange={e => handleUserName(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Role" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={role}
                                        onChange={e => handleRole(e)}
                                    />
                                </div>

                                <div style={{ width: '100%', marginTop: 10 }}>
                                    <TextField id="outlined-basic" size='medium' fullWidth label="Barangay" variant="outlined"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        value={barangay}
                                        onChange={e => handleBarangay(e)}
                                    />
                                </div>
                            </ThemeProvider>

                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                <Button variant='contained' size='large' style={{ float: 'right', marginLeft: 10 }} disabled={btnEditLoading} disableElevation onClick={onEdit}>
                                    Save
                                </Button>

                                <Button variant='contained' size='large' style={{ float: 'right' }} disableElevation onClick={handleCloseModal}>
                                    Cancel
                            </Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
                // end region
            }
        </div>
    );
}

export default UserMaintenance;