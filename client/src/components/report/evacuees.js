import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, fade, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { Paper, Grid, Backdrop, Fade, Typography, Divider, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Button, ButtonGroup, Modal, List, ListItem, ListItemText, Tooltip, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, MenuItem, Slide, Snackbar, Avatar } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Add as AddIcon, FilterList as FilterListIcon, Edit, Delete, Close, Cancel, Save } from '@material-ui/icons';
import Select from 'react-select';
import Webcam from "react-webcam";
import 'font-awesome/css/font-awesome.min.css';

// Component
import EvacueesLoading from './evacueesLoading';
import { blueGrey } from '@material-ui/core/colors';

const moment = require('moment');
const axios = require('axios');

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const customSelectStyle = {
    control: base => ({
        ...base,
        height: 40,
        minHeight: 40,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        backgroundColor: '#272c33',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
    }),
    singleValue: base => ({
        ...base,
        color: "#fff",
    }),
    input: base => ({
        ...base,
        color: "#fff",
    }),
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        //   backgroundColor: theme.palette.common.black,
        backgroundColor: '#272c33',
        color: theme.palette.common.white,
        // minWidth: 180,
        '@media screen and (max-width: 768px)': {
            // minWidth: 90
        }
    },
    body: {
        // minWidth: 180, 
        '@media screen and (max-width: 768px)': {
            // minWidth: 90,
        }
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

const inputTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#2EFF22"
        },
        secondary: { main: "#22BF19" },
        grey: { main: "#22BF19" }
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                position: "relative",
                "& $notchedOutline": {
                    borderColor: "#67757c"
                },
                "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
                    borderColor: "#fff",
                    // Reset on touch devices, it doesn't add specificity
                    "@media (hover: none)": {
                        borderColor: "#fff"
                    }
                },
                "&$focused $notchedOutline": {
                    borderColor: "#fff",
                    borderWidth: 1
                }
            }
        },
        MuiFormLabel: {
            root: {
                // "&$focused": {
                color: "#2EFF22"
                // }
            }
        }
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

document.body.style = 'background: #383f48;'

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        width: '100%',
        padding: 15,
        maxHeight: '20vh',
        height: '20vh',
        '@media screen and (max-width: 768px)': {
            padding: 0,
        }
    },
    titleDiv: {
        color: '#1e88e5',
        marginBottom: '20px',
    },
    contentDiv: {
        height: '100%',
        maxHeight: '300vh',
        backgroundColor: '#272c33',
        padding: '15px',
        borderRadius: 5,
    },
    modalDiv: {
        width: '100%',
        height: '28vh',
        maxHeight: '28vh',
        backgroundColor: '#272c33',
        padding: '15px',
        borderRadius: 5,
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    root: {
        width: '100%',
        backgroundColor: '#272c33',
    },
    containerAddModal: {
        height: '25vh',
        maxHeight: '25vh',
        // maxWidth: '162vh',
        // width: '162vh'
    },
    container: {
        height: '54vh',
        maxHeight: '54vh',
        overflowX: 'auto',
        // maxWidth: '176vh',
        // width: '176vh',
        '@media screen and (max-width: 768px)': {
            height: '47vh',
            maxHeight: '47vh',
            overflowX: 'auto',
            // maxWidth: '50vh',
            // width: '50vh',
        }
    },
    table: {
        // minWidth: 650,
        tableLayout: 'fixed',
        overflowX: 'auto'
        // whiteSpace: 'noWrap'
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 0,
        // whiteSpace: 'nowrap',
        '@media screen and (max-width: 768px)': {
            fontSize: 11
        }
    },
    tableCell: {
        fontSize: 17,
        backgroundColor: '#fff',
        // whiteSpace: 'nowrap',
        flex: 1,
        '@media screen and (max-width: 768px)': {
            fontSize: 10
        }
    },
    selectDiv: {
        float: 'right',
        width: '400px',
        zIndex: 100,
        '@media screen and (max-width: 768px)': {
            float: 'right',
            width: '200px',
            zIndex: 100,
        }
    },
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '90%',
    },
    editModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editModalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10,
        width: '40%',
    },
    input: {
        color: '#67757c',
    },
    close: {
        padding: theme.spacing(0.5),
    },
    editAvatar: {
        width: theme.spacing(25),
        height: theme.spacing(25),
        backgroundColor: blueGrey[500]
    }
}));

function EvacueesOption(item) {
    var list = [];
    if (item !== undefined) {
        item.map(x => {
            var name = x.firstName + " " + x.lastName;

            return (
                list.push({
                    label: name,
                    value: x.id
                }))
        })
    }
    return list;
}

const GenderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }];

const MemberType = [
    { value: 'head', label: 'Head' },
    { value: 'member', label: 'Member' },
];

function Evacuees() {
    const classes = useStyles();
    const [selectedEvacuee, setSelectedEvacuee] = useState(null);
    const [evacueesData, setEvacueesData] = useState(null);
    const [addModal, setAddModal] = useState(false);
    const [id, setId] = useState(-1);
    const [familyNumber, setFamilyNumber] = useState(-1);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthday, setBirthday] = useState(moment().format('MM/DD/yyyy'));
    const [gender, setGender] = useState("");
    const [pregnant, setPregnant] = useState(false);
    const [age, setAge] = useState(null);
    const [address, setAddress] = useState("");
    const [barangay, setBarangay] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [pwd, setPwd] = useState(false);
    const [type, setType] = useState("");
    const [familyMember, setFamilyMember] = useState([]);
    const [memberFirstName, setMemberFirstName] = useState("");
    const [memberMiddleName, setMemberMiddleName] = useState("");
    const [memberLastName, setMemberLastName] = useState("");
    const [memberBirthday, setMemberBirthday] = useState(moment().format('MM/DD/yyyy'));
    const [memberGender, setMemberGender] = useState("");
    const [memberPregnant, setMemberPregnant] = useState(false);
    const [memberAge, setMemberAge] = useState(null);
    const [memberAddress, setMemberAddress] = useState("");
    const [memberBarangay, setMemberBarangay] = useState("");
    const [memberMunicipality, setMemberMunicipality] = useState("");
    const [memberContactNumber, setMemberContactNumber] = useState("");
    const [memberPwd, setMemberPwd] = useState(false);
    const [memberType, setMemberType] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [saveSnackbar, setSaveSnackbar] = useState(false);
    const [deleteSnackbar, setDeleteSnackbar] = useState(false);
    const [evacueesLoading, setEvacueesLoading] = useState(true);
    const [btnSaveLoading, setBtnSaveLoading] = useState(false);
    const [btnEditLoading, setBtnEditLoading] = useState(false);
    const [btnDelLoading, setBtnDelLoading] = useState(false);
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [addMember, setAddMember] = useState(false);
    const [errMsg, setErrMSg] = useState(false);
    const [err, setErr] = useState(null);
    const [img, setImg] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const capture = React.useCallback(() => {
        const imageCapture = webcamRef.current.getScreenshot();
        setImgSrc(imageCapture);
    }, [webcamRef, setImgSrc]);

    const handleOpenAddModal = () => {
        setAddModal(true);
        var url = window.apihost + 'evacuees/familyNumber';
        var token = sessionStorage.getItem("auth-token");
        axios.get(url, {
            headers: { "auth-token": token },
        })
            .then(function (response) {
                // handle success
                setFamilyNumber(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    const handleCloseAddModal = () => {
        setAddModal(false);
        setEditModal(false);

        setFamilyMember([]);

        setFamilyNumber(-1);

        setId(-1);
        setAddModal(false);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setBirthday(moment().format('MM/DD/yyyy'));
        setType("");
        setAge(null);
        setGender("");
        setPregnant(false);
        setAddress("");
        setBarangay("");
        setMunicipality("");
        setContactNumber("");
        setPwd(false);
        setImgSrc(null);
        setImg(null);

        setAddMember(false);
        setMemberFirstName("");
        setMemberMiddleName("");
        setMemberLastName("");
        setMemberBirthday("");
        setMemberType("");
        setMemberAge(null);
        setMemberGender("");
        setMemberPregnant(false);
        setMemberAddress("");
        setMemberBarangay("");
        setMemberMunicipality("");
        setMemberContactNumber("");
        setMemberPwd(false);
    }

    useEffect(() => {
        var route = 'evacuees';
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios.get(url, {
            headers: { "auth-token": token },
        })
            .then(function (response) {
                // handle success
                // console.log('Result:' + JSON.stringify(response.data));
                if (Array.isArray(response.data)) {
                    setEvacueesData(response.data);
                    setEvacueesLoading(false);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setEvacueesData(obj);
                    setEvacueesLoading(false);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setEvacueesLoading(false);
            })
            .finally(function () {
                // always executed
            });
    }, [evacueesData]);

    const handleAddMember = () => {
        const data = {
            'familyNumber': familyNumber,
            'memberType': memberType,
            'firstName': memberFirstName,
            'middleName': memberMiddleName,
            'lastName': memberLastName,
            'birthday': memberBirthday,
            'age': memberAge,
            'gender': memberGender,
            'pregnant': memberPregnant,
            'address': memberAddress,
            'baranggay': memberBarangay,
            'municipality': memberMunicipality,
            'contactNumber': memberContactNumber,
            'pwd': memberPwd
        }

        const errorValidation = [];
        if (memberFirstName === "") errorValidation.push({ "errorMsg": "Member First Name: Cannot be empty." });

        if (memberMiddleName === "") errorValidation.push({ "errorMsg": "Member Middle Name: Cannot be empty." });

        if (memberLastName === "") errorValidation.push({ "errorMsg": "Member Last Name: Cannot be empty." });

        if (memberBirthday === "" || memberBirthday === null) errorValidation.push({ "errorMsg": "Birthday: Cannot be empty." })

        if (memberType === "") errorValidation.push({ "errorMsg": "Member Type: Cannot be empty." });

        if (memberAge === "" || memberAge === null || memberAge === 0) errorValidation.push({ "errorMsg": "Member Age: Cannot be empty." });

        if (memberGender === "" || memberGender === null) errorValidation.push({ "errorMsg": "Member Gender: Cannot be empty." });

        if (memberPregnant === null) errorValidation.push({ "errorMsg": "Member Pregnant: Cannot be null  value." });

        if (memberAddress === "") errorValidation.push({ "errorMsg": "Member Address: Cannot be empty." });

        if (memberBarangay === "") errorValidation.push({ "errorMsg": "Member Barangay: Cannot be empty." });

        if (memberMunicipality === "") errorValidation.push({ "errorMsg": "Member Municipality: Cannot be empty." });

        if (memberContactNumber === "") errorValidation.push({ "errorMsg": "Member Contact No.: Cannot be empty." });

        if (memberPwd === null) errorValidation.push({ "errorMsg": "Member PWD: Cannot be null value." });

        if (errorValidation.length > 0) {
            const error = {
                "status": 400,
                "error": errorValidation
            }
            setErr(error);
            setErrMSg(true);
        } else {
            familyMember.push(data);
            // alert(JSON.stringify(familyMember))
            setErr(null);
            setAddMember(false);
            setMemberFirstName("");
            setMemberMiddleName("");
            setMemberLastName("");
            setMemberBirthday(moment().format('MM/DD/yyyy'));
            setMemberType("");
            setMemberAge("");
            setMemberGender("");
            setMemberPregnant(false);
            setMemberAddress("");
            setMemberBarangay("");
            setMemberMunicipality("");
            setMemberContactNumber("");
            setMemberPwd(false);
        }

    }

    const handleCloseAddMember = () => {
        setAddMember(false);
        setMemberFirstName("");
        setMemberMiddleName("");
        setMemberLastName("");
        setMemberBirthday("");
        setMemberType("");
        setMemberAge("");
        setMemberGender("");
        setMemberPregnant(false);
        setMemberAddress("");
        setMemberBarangay("");
        setMemberMunicipality("");
        setMemberContactNumber("");
        setMemberPwd(false);
    }

    const handleSave = () => {
        setBtnSaveLoading(true);
        var token = sessionStorage.getItem("auth-token");
        var userData = sessionStorage.getItem("userData");
        var userRole = userData.user;
        var url = window.apihost + "evacuees";
        if (gender === "Male") setPregnant(false);
        var data = {
            // 'id': id,
            'familyNumber': familyNumber,
            'memberType': type,
            'firstName': firstName,
            'middleName': middleName,
            'lastName': lastName,
            'birthday': birthday,
            'age': age,
            'gender': gender,
            'pregnant': pregnant,
            'address': address,
            'baranggay': barangay,
            'municipality': municipality,
            'contactNumber': contactNumber,
            'pwd': pwd,
            'familyMember': familyMember,
            'file': imgSrc
        };
        axios.post(url, data, {
            headers: { "auth-token": token, "role": "admin" },
        })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    setAddModal(false);

                    setFamilyMember([]);

                    setFamilyNumber(-1);

                    setId(-1);
                    setAddModal(false);
                    setFirstName("");
                    setMiddleName("");
                    setLastName("");
                    setBirthday(moment().format('MM/DD/yyyy'));
                    setType("");
                    setAge(null);
                    setGender("");
                    setPregnant(false);
                    setAddress("");
                    setBarangay("");
                    setMunicipality("");
                    setContactNumber("");
                    setPwd(false);
                    setImgSrc(null);

                    setAddMember(false);
                    setMemberFirstName("");
                    setMemberMiddleName("");
                    setMemberLastName("");
                    setMemberBirthday(moment().format('MM/DD/yyyy'));
                    setMemberType("");
                    setMemberAge(null);
                    setMemberGender("");
                    setMemberPregnant(false);
                    setMemberAddress("");
                    setMemberBarangay("");
                    setMemberMunicipality("");
                    setMemberContactNumber("");
                    setMemberPwd(false);
                    setBtnSaveLoading(false);
                }
            })
            .catch(err => {
                if (err.response.status === 400) {
                    const error = {
                        "status": err.response.status,
                        "error": err.response.data
                    };
                    setErr(error);
                    setErrMSg(true);
                    setBtnSaveLoading(false);
                } else {
                    // alert(err.response.status + JSON.stringify(err.response.data));
                    const error = {
                        "status": err.response.status,
                        "error": JSON.stringify(err.response.data)
                    };
                    setErr(error);
                    setErrMSg(true);
                    setBtnSaveLoading(false);
                }
            });
    }

    const handleEdit = (e) => {
        setEditModal(true);
        setFamilyNumber(e.familyNumber);
        setType(e.memberType);
        setId(e.id);
        setFirstName(e.firstName);
        setMiddleName(e.middleName);
        setLastName(e.lastName);
        setBirthday(moment(e.birthday).format('MM/DD/yyyy'));
        setAge(e.age);
        setGender(e.gender);
        setPregnant(e.pregnant);
        setAddress(e.address);
        setBarangay(e.barangay);
        setMunicipality(e.municipality);
        setContactNumber(e.contactNumber);
        setPwd(e.pwd);
        setImg(e.image);
    }

    const handleSaveEdit = () => {
        setBtnEditLoading(true);
        var token = sessionStorage.getItem("auth-token");
        var url = window.apihost + `evacuees/${id}/`;
        if (gender === "Male") {
            setPregnant(false);
        }
        var data = {
            // 'id': id,
            'familyNumber': familyNumber,
            'memberType': type,
            'firstName': firstName,
            'middleName': middleName,
            'lastName': lastName,
            'birthday': birthday,
            'age': age,
            'gender': gender,
            'pregnant': pregnant,
            'address': address,
            'baranggay': barangay,
            'municipality': municipality,
            'contactNumber': contactNumber,
            'pwd': pwd,
            'image': img
        };
        axios.patch(url, data, {
            headers: { "auth-token": token }
        })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    setEditModal(false);
                    setFamilyNumber(-1);

                    setId(-1);
                    setAddModal(false);
                    setFirstName("");
                    setMiddleName("");
                    setLastName("");
                    setBirthday(moment().format('MM/DD/yyyy'));
                    setType("");
                    setAge(null);
                    setGender("");
                    setPregnant(false);
                    setAddress("");
                    setBarangay("");
                    setMunicipality("");
                    setContactNumber("");
                    setPwd(false);
                    setImgSrc(null);
                    setImg(null);

                    setAddMember(false);
                    setMemberFirstName("");
                    setMemberMiddleName("");
                    setMemberLastName("");
                    setMemberBirthday("");
                    setMemberType("");
                    setMemberAge(null);
                    setMemberGender("");
                    setMemberPregnant(false);
                    setMemberAddress("");
                    setMemberBarangay("");
                    setMemberMunicipality("");
                    setMemberContactNumber("");
                    setMemberPwd(false);
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

    const handleGender = (e) => {
        setGender(e.target.value);
    }

    const evacueeList = evacueesData ? evacueesData.map(x => ({
        id: x._id,
        familyNumber: x.familyNumber,
        evacueeNumber: x.evacueeNumber,
        memberType: x.memberType,
        firstName: x.firstName,
        middleName: x.middleName,
        lastName: x.lastName,
        birthday: x.birthday,
        age: x.age,
        gender: x.gender,
        pregnant: x.pregnant,
        address: x.address,
        barangay: x.baranggay,
        municipality: x.municipality,
        pwd: x.pwd,
        contactNumber: x.contactNumber,
        image: x.image
    })) : [];

    const handleOpenDelModal = (e) => {
        setDeleteModal(true);
        setId(e);
    }

    const handleCloseDelModal = () => {
        setDeleteModal(false);
        setId(-1);
        setAddModal(false);
        setFirstName("");
        setLastName("");
        setAge(null);
        setGender("");
        setPregnant(false);
        setBarangay("");
    }

    const handleDelete = () => {
        setBtnDelLoading(true);
        const token = sessionStorage.getItem('auth-token');
        const url = window.apihost + `evacuees/${id}/`;
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
                    setFirstName("");
                    setLastName("");
                    setBirthday(moment().format('MM/DD/yyyy'));
                    setAge(null);
                    setGender("");
                    setPregnant(false);
                    setMunicipality("");
                    setBarangay("");
                    setContactNumber("");
                    setPwd(false);
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

    const handleBtnPregnant = () => {
        setPregnant(!pregnant);
    }

    const handleBtnMemberPregnant = () => {
        setMemberPregnant(!memberPregnant);
    }

    const handleBtnPwd = () => {
        setPwd(!pwd);
    }

    const handleBtnMemberPwd = () => {
        setMemberPwd(!memberPwd);
    }

    const handleCloseErrorMsg = () => {
        setErrMSg(false);
        setErr(null);
    }

    return (
        <div className={classes.mainDiv}>
            <div className={classes.titleDiv}>
                <Typography variant='h5'>Evacuees</Typography>
            </div>

            {addModal === false &&
                <div>
                    <div className={classes.contentDiv}>
                        <Typography variant='h6' style={{ color: '#fff' }}>All Evacuees Data</Typography>

                        <Divider /><br />

                        <Button onClick={handleOpenAddModal} variant="contained" variant="contained" style={{ backgroundColor: '#24d2b5', color: '#fff' }} disableElevation startIcon={<AddIcon />}>
                            Add Record
                        </Button>

                        <br /><br />
                        <Divider />
                        <br /><br />

                        <div style={{ zIndex: 100 }}>
                            <ButtonGroup
                                orientation="vertical"
                                aria-label="vertical contained primary button group"
                                variant="contained"
                                style={{ marginRight: '5px', }}
                            >
                                <Button disableElevation style={{ backgroundColor: '#20aee3', color: '#fff' }}>Export to Excel</Button>
                            </ButtonGroup>
                            <ButtonGroup
                                orientation="vertical"
                                aria-label="vertical contained primary button group"
                                variant="contained"
                                style={{ marginRight: '5px', }}
                            >
                                <Button disableElevation style={{ backgroundColor: '#20aee3', color: '#fff' }}>Export to PDF</Button>
                            </ButtonGroup>

                            <div className={classes.selectDiv}>
                                <Select
                                    defaultValue={selectedEvacuee}
                                    options={EvacueesOption(evacueeList)}
                                    onChange={e => setSelectedEvacuee(e)}
                                    placeholder='Search...'
                                    isClearable
                                    theme={(theme) => ({
                                        ...theme,
                                        // borderRadius: 0,
                                        colors: {
                                            ...theme.colors,
                                            // text: 'black',
                                            primary25: '#66c0f4',
                                            primary: '#B9B9B9',
                                        },
                                    })}
                                    styles={customSelectStyle}
                                />
                            </div>
                        </div>

                        <Paper className={classes.root}>
                            <TableContainer component={Paper} className={classes.container}>
                                <Table className={classes.table} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.tableHeader}>Family No.</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Evacuee No.</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Full Name</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Birth Date</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Member Type</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Age</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Gender</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Pregnant</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Address</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Barangay</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Municipality</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>PWD</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader}>Contact</StyledTableCell>
                                            <StyledTableCell className={classes.tableHeader} align='center' style={{ zIndex: 1 }}>Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{ overFlowY: 'auto' }}>
                                        {evacueesData !== null && evacueeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(x =>
                                            <StyledTableRow key={x.id}>
                                                <TableCell className={classes.tableCell}>
                                                    {x.familyNumber}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.evacueeNumber}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.firstName + " " + x.middleName + " " + x.lastName}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {moment(x.birthday).format('MMMM DD, YYYY')}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.memberType}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.age}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.gender}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.pregnant === false ? "No" : "Yes"}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.address}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.barangay}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.municipality}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.pwd === false ? "No" : "Yes"}
                                                </TableCell>

                                                <TableCell className={classes.tableCell}>
                                                    {x.contactNumber}
                                                </TableCell>

                                                <TableCell align='center' className={classes.tableCell}>
                                                    <Tooltip title='Edit'>
                                                        <IconButton aria-label="edit" onClick={() => handleEdit(x)}>
                                                            <Edit fontSize="medium" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title='Delete'>
                                                        <IconButton aria-label="delete" onClick={() => handleOpenDelModal(x.id)}>
                                                            <Delete fontSize="medium" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                    {evacueesLoading === true &&
                                        <EvacueesLoading />
                                    }
                                </Table>
                            </TableContainer>
                            <TablePagination
                                style={{ color: '#fff' }}
                                rowsPerPageOptions={rowsPerPage}
                                component="div"
                                count={evacueeList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                            // onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            }

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
                            Are you sure you want to delete this?
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
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.addModal}
                    open={addModal}
                    // onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={addModal}>
                        <div className={classes.addModalPaper}>
                            <Grid container spacing={3} style={{ width: '100%', }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant='h3'>{"Family No: "}{familyNumber !== -1 ? familyNumber : ""}</Typography>
                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <ThemeProvider>
                                            <div style={{ width: '100%', marginBottom: 10, marginRight: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>First Name *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="First Name" variant="outlined"
                                                    error={err !== null && firstName === "" ? true : false}
                                                    helperText={err !== null && firstName === "" ? "First name is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={firstName}
                                                    onChange={e => setFirstName(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%', marginBottom: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Middle Name *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Middle Name" variant="outlined"
                                                    error={err !== null && middleName === "" ? true : false}
                                                    helperText={err !== null && middleName === "" ? "Middle name is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={middleName}
                                                    onChange={e => setMiddleName(e.target.value)}
                                                />
                                            </div>
                                        </ThemeProvider>
                                    </div>

                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <ThemeProvider>
                                            <div style={{ width: '100%', marginBottom: 10, marginRight: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Last Name *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Last Name" variant="outlined"
                                                    error={err !== null && lastName === "" ? true : false}
                                                    helperText={err !== null && lastName === "" ? "Last name is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={lastName}
                                                    onChange={e => setLastName(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%', marginBottom: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Member Type *</label>
                                                <TextField id="outlined-basic" size='medium' select fullWidth placeholder="Member Type" variant="outlined"
                                                    error={err !== null && type === "" ? true : false}
                                                    helperText={err !== null && type === "" ? "Member type is missing" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={type}
                                                    onChange={e => setType(e.target.value)}
                                                >
                                                    {MemberType.map((x) => (
                                                        <MenuItem key={x.value} value={x.value}>
                                                            {x.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        </ThemeProvider>
                                    </div>

                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <ThemeProvider>
                                            <div style={{ width: '50%', marginRight: 10 }}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Birth Date *</label>
                                                    <KeyboardDatePicker
                                                        // margin="normal"
                                                        id="date-picker-dialog"
                                                        fullWidth
                                                        placeholder="MM/DD/YYYY"
                                                        format="MM/dd/yyyy"
                                                        value={birthday}
                                                        onChange={e => setBirthday(e)}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                        inputVariant='outlined'
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>

                                            {<div style={{ width: '50%', marginRight: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Age *</label>
                                                <TextField id="outlined-basic" type='number' size='medium' fullWidth placeholder="Age" variant="outlined"
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={age}
                                                    onChange={e => setAge(e.target.value)}
                                                />
                                            </div>}

                                            <div style={{ width: '50%' }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Gender *</label>
                                                <TextField id="outlined-basic" size='medium' select fullWidth placeholder="Gender" variant="outlined"
                                                    error={err !== null && gender === "" ? true : false}
                                                    helperText={err !== null && gender === "" ? "Gender is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={gender}
                                                    onChange={e => handleGender(e)}
                                                >
                                                    {GenderOptions.map((x) => (
                                                        <MenuItem key={x.value} value={x.value}>
                                                            {x.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        </ThemeProvider>
                                    </div>

                                    <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
                                        <ThemeProvider>
                                            <div style={{ width: '100%', marginRight: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Address *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Barangay" variant="outlined"
                                                    error={err !== null && address === "" ? true : false}
                                                    helperText={err !== null && address === "" ? "Address is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={address}
                                                    onChange={e => setAddress(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%' }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Barangay *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Barangay" variant="outlined"
                                                    error={err !== null && barangay === "" ? true : false}
                                                    helperText={err !== null && barangay === "" ? "Barangay is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={barangay}
                                                    onChange={e => setBarangay(e.target.value)}
                                                />
                                            </div>
                                        </ThemeProvider>
                                    </div>

                                    <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
                                        <ThemeProvider>
                                            <div style={{ width: '100%', marginRight: 10 }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Municipality *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Barangay" variant="outlined"
                                                    error={err !== null && municipality === "" ? true : false}
                                                    helperText={err !== null && municipality === "" ? "Municipality is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={municipality}
                                                    onChange={e => setMunicipality(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%' }}>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Contact No. *</label>
                                                <TextField id="outlined-basic" size='medium' fullWidth placeholder="Barangay" variant="outlined"
                                                    error={err !== null && contactNumber === "" ? true : false}
                                                    helperText={err !== null && contactNumber === "" ? "Contact No. is required" : ""}
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={contactNumber}
                                                    onChange={e => setContactNumber(e.target.value)}
                                                />
                                            </div>
                                        </ThemeProvider>
                                    </div>

                                    <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
                                        <ThemeProvider>
                                            <div>
                                                <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>PWD</label>
                                                <FormControlLabel
                                                    style={{ color: '#67757c', marginLeft: 10 }}
                                                    control={<IOSSwitch checked={pwd} onChange={handleBtnPwd} />}
                                                    label=""
                                                />
                                            </div>

                                            {gender === "Female" &&
                                                <div>
                                                    <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Pregnant</label>
                                                    <FormControlLabel
                                                        style={{ color: '#67757c', marginLeft: 10 }}
                                                        control={<IOSSwitch checked={pregnant} onChange={handleBtnPregnant} name="checkedB" />}
                                                        label=""
                                                    />
                                                </div>
                                            }
                                        </ThemeProvider>
                                    </div>

                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ width: '100%', display: 'flex' }}>
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                // minScreenshotHeight={100}
                                                // minScreenshotWidth={100}
                                                style={{ width: '400px' }}
                                            />

                                            {imgSrc && (
                                                <img
                                                    src={imgSrc}
                                                    style={{ width: '400px', marginLeft: 10, }}
                                                />
                                            )}
                                        </div>

                                        <Button
                                            variant='contained'
                                            size='large'
                                            onClick={capture}
                                            disableElevation
                                            style={{ position: 'relative', marginTop: 10, marginLeft: '100px' }}
                                        >
                                            Capture photo
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>

                            <div style={{ width: '100%', marginTop: 20, }}>
                                <Button variant='contained' size='large' disableElevation onClick={() => setAddMember(true)}>
                                    Add Family Member
                                </Button>

                                {addMember === false &&
                                    <Button variant='contained' size='large' style={{ float: 'right' }} disableElevation onClick={handleCloseAddModal}>Cancel</Button>
                                }
                                {addMember === false &&
                                    <Button variant='contained' size='large' style={{ float: 'right', marginRight: 10 }} disableElevation disabled={btnSaveLoading} onClick={handleSave}>{btnSaveLoading === true && <i class='fa fa-spinner fa-spin' />}Save</Button>
                                }

                                <Paper className={classes.root}>
                                    <TableContainer component={Paper} className={classes.containerAddModal} style={{ marginTop: 10 }}>
                                        <Table className={classes.table} stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell className={classes.tableHeader} align='center' style={{ position: 'sticky', left: 0, zIndex: 1 }}>Actions</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>First Name</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Middle Name</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Last Name</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Birth Date</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Member Type</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Age</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Gender</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Pregnant</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Address</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Barangay</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Municipality</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>PWD</StyledTableCell>
                                                    <StyledTableCell className={classes.tableHeader}>Contact</StyledTableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {addMember === true &&
                                                    <TableRow>
                                                        <StyledTableCell align='center' style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                                                            <Tooltip title='Save'>
                                                                <IconButton aria-label="save" onClick={handleAddMember}>
                                                                    <Save fontSize="medium" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title='Cancel'>
                                                                <IconButton aria-label="cancel" onClick={handleCloseAddMember}>
                                                                    <Cancel fontSize="medium" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </StyledTableCell>
                                                        <StyledTableCell><TextField value={memberFirstName} onChange={e => setMemberFirstName(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberMiddleName} onChange={e => setMemberMiddleName(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberLastName} onChange={e => setMemberLastName(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell>
                                                            {/* <TextField type='date' value={memberBirthday} onChange={e => setMemberBirthday(e.target.value)} style={{width: '80px'}} /> */}
                                                            {<MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <KeyboardDatePicker
                                                                    // margin="normal"
                                                                    id="date-picker-dialog"
                                                                    fullWidth
                                                                    placeholder="MM/DD/YYYY"
                                                                    format="MM/dd/yyyy"
                                                                    value={memberBirthday}
                                                                    onChange={e => setMemberBirthday(e)}
                                                                    KeyboardButtonProps={{
                                                                        'aria-label': 'change date',
                                                                    }}
                                                                    style={{width: '100px'}}
                                                                    // inputVariant='outlined'
                                                                />
                                                            </MuiPickersUtilsProvider>}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <TextField fullWidth value={memberType} select onChange={e => setMemberType(e.target.value)}>
                                                                {MemberType.map((x) => (
                                                                    <MenuItem key={x.value} value={x.value}>
                                                                        {x.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </StyledTableCell>
                                                        <StyledTableCell><TextField value={memberAge} onChange={e => setMemberAge(e.target.value)} type='number' /></StyledTableCell>
                                                        <StyledTableCell>
                                                            <TextField fullWidth value={memberGender} onChange={e => setMemberGender(e.target.value)} select>
                                                                {GenderOptions.map((x) => (
                                                                    <MenuItem key={x.value} value={x.value}>
                                                                        {x.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </StyledTableCell>
                                                        <StyledTableCell><IOSSwitch disabled={memberGender === "Male" ? true : false} checked={memberGender === "Male" ? false : memberPregnant} onChange={handleBtnMemberPregnant} name="checkedB" /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberAddress} onChange={e => setMemberAddress(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberBarangay} onChange={e => setMemberBarangay(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberMunicipality} onChange={e => setMemberMunicipality(e.target.value)} /></StyledTableCell>
                                                        <StyledTableCell><IOSSwitch checked={memberPwd} onChange={handleBtnMemberPwd} name="checkedB" /></StyledTableCell>
                                                        <StyledTableCell><TextField value={memberContactNumber} onChange={e => setMemberContactNumber(e.target.value)} /></StyledTableCell>
                                                    </TableRow>
                                                }

                                                {familyMember !== null && familyMember.map(x =>
                                                    <TableRow key={familyMember.length}>
                                                        <StyledTableCell align='center' style={{ position: 'sticky', left: 0 }}></StyledTableCell>
                                                        <StyledTableCell>{x.firstName}</StyledTableCell>
                                                        <StyledTableCell>{x.middleName}</StyledTableCell>
                                                        <StyledTableCell>{x.lastName}</StyledTableCell>
                                                        <StyledTableCell>{x.birthday}</StyledTableCell>
                                                        <StyledTableCell>{x.memberType}</StyledTableCell>
                                                        <StyledTableCell>{x.age}</StyledTableCell>
                                                        <StyledTableCell>{x.gender}</StyledTableCell>
                                                        <StyledTableCell>{x.pregnant === false ? "No" : "Yes"}</StyledTableCell>
                                                        <StyledTableCell>{x.address}</StyledTableCell>
                                                        <StyledTableCell>{x.baranggay}</StyledTableCell>
                                                        <StyledTableCell>{x.municipality}</StyledTableCell>
                                                        <StyledTableCell>{x.pwd === false ? "No" : "Yes"}</StyledTableCell>
                                                        <StyledTableCell>{x.contactNumber}</StyledTableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </div>

                            <div>

                            </div>
                        </div>
                    </Fade>
                </Modal>
                // end region
            }

            {
                // region edit modal
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.editModal}
                    open={editModal}
                    // onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={editModal}>
                        <div className={classes.editModalPaper}>
                            <Grid container spacing={0} style={{ width: '100%', }}>
                                <Grid item xs={12} sm={4}>
                                    <Avatar variant='square' src={window.apihost + "images/" + img} className={classes.editAvatar}>

                                    </Avatar>
                                </Grid>
                                <Grid item xs={12} sm={8} style={{ width: '100%' }}>
                                    <div style={{ width: '100%' }}>
                                        <ThemeProvider>
                                            <div style={{ width: '100%', marginTop: 10 }}>
                                                <TextField id="outlined-basic" size='medium' fullWidth label="First Name" variant="outlined"
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={firstName}
                                                    onChange={e => setFirstName(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%', marginTop: 10 }}>
                                                <TextField id="outlined-basic" size='medium' fullWidth label="Middle Name" variant="outlined"
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={middleName}
                                                    onChange={e => setMiddleName(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ width: '100%', marginTop: 10 }}>
                                                <TextField id="outlined-basic" size='medium' fullWidth label="Last Name" variant="outlined"
                                                    InputProps={{
                                                        className: classes.input
                                                    }}
                                                    value={lastName}
                                                    onChange={e => setLastName(e.target.value)}
                                                />
                                            </div>
                                        </ThemeProvider>
                                    </div>
                                </Grid>
                            </Grid>

                            <div style={{ width: '100%', marginTop: 15, display: 'flex' }}>
                                <ThemeProvider>
                                    <div style={{ width: '50%', marginRight: 10 }}>
                                        <TextField id="outlined-basic" size='medium' select fullWidth label="Member Type" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                        >
                                            {MemberType.map((x) => (
                                                <MenuItem key={x.value} value={x.value}>
                                                    {x.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    {/* <div style={{ width: '50%', marginRight: 10 }}>
                                        <TextField id="outlined-basic" type='number' size='medium' fullWidth label="Age" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={age}
                                            onChange={e => setAge(e.target.value)}
                                        />
                                    </div> */}

                                    <div style={{ width: '50%', marginRight: 10 }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Birth Date"
                                                format="MM/dd/yyyy"
                                                value={birthday}
                                                onChange={e => setBirthday(e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                inputVariant='outlined'
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>

                                    <div style={{ width: '50%' }}>
                                        <TextField id="outlined-basic" size='medium' select fullWidth label="Gender" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={gender}
                                            onChange={e => handleGender(e)}
                                        >
                                            {GenderOptions.map((x) => (
                                                <MenuItem key={x.value} value={x.value}>
                                                    {x.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </ThemeProvider>
                            </div>

                            <div style={{ width: '100%', marginTop: 15, display: 'flex' }}>
                                <ThemeProvider>
                                    <div style={{ width: '50%', marginRight: 10 }}>
                                        <TextField id="outlined-basic" size='medium' fullWidth label="Address" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ width: '50%', marginRight: 10 }}>
                                        <TextField id="outlined-basic" size='medium' fullWidth label="Barangay" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={barangay}
                                            onChange={e => setBarangay(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ width: '50%' }}>
                                        <TextField id="outlined-basic" size='medium' fullWidth label="Municipality" variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={municipality}
                                            onChange={e => setMunicipality(e.target.value)}
                                        />
                                    </div>
                                </ThemeProvider>
                            </div>

                            <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
                                <ThemeProvider>
                                    <div style={{ width: '50%' }}>
                                        <TextField id="outlined-basic" size='medium' fullWidth label="Contact No." variant="outlined"
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            value={contactNumber}
                                            onChange={e => setContactNumber(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ width: '50%', marginLeft: 10 }}>
                                        <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>PWD</label>
                                        <FormControlLabel
                                            style={{ color: '#67757c', marginLeft: 10 }}
                                            control={<IOSSwitch checked={pwd} onChange={handleBtnPwd} />}
                                            label=""
                                        />
                                    </div>

                                    {
                                        <div style={{ width: '50%', marginLeft: 10 }}>
                                            <label style={{ color: '#67757c', fontSize: '18px', fontWeight: 400 }}>Pregnant</label>
                                            <FormControlLabel
                                                style={{ color: '#67757c', marginLeft: 10 }}
                                                control={<IOSSwitch disabled={gender === "Male" ? true : false} checked={gender === "Male" ? false : pregnant} onChange={handleBtnPregnant} name="checkedB" />}
                                                label=""
                                            />
                                        </div>
                                    }
                                </ThemeProvider>
                            </div>

                            <div>
                                <Button variant='contained' size='large' style={{ float: 'right' }} disableElevation onClick={handleCloseAddModal}>Cancel</Button>

                                <Button variant='contained' size='large' style={{ float: 'right', marginRight: 10 }} disableElevation disabled={btnEditLoading} onClick={handleSaveEdit}>{btnEditLoading === true && <i class='fa fa-spinner fa-spin' />} Save</Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
                // end region
            }

            {
                //region error popup
                <Dialog
                    open={errMsg}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{err !== null ? "Status: " + err.status : ""}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ width: '50vh', maxWidth: '50vh' }}>
                            {err !== null && err.status === 400 && err.error.map(x =>
                                <ListItem id={x.index}>
                                    <ListItemText primary={x.errorMsg} style={{ color: 'red' }} />
                                </ListItem>
                            )}
                            {err !== null && err.status >= 500 &&
                                <ListItem>
                                    <ListItemText primary={err.error} style={{ color: 'red' }} />
                                </ListItem>
                            }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorMsg} autoFocus disableElevation>
                            Okay
                        </Button>
                    </DialogActions>
                </Dialog>
                //end region
            }
        </div>
    );
}

export default Evacuees;