import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import 'font-awesome/css/font-awesome.min.css';
import { makeStyles, fade, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useMediaQuery, CircularProgress, TextField, Button, OutlinedInput, InputLabel, FormControl, IconButton, InputAdornment } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import UserContext from '../context/userContext';
import { green } from '@material-ui/core/colors';
const axios = require('axios');

const inputTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#1e88e5"
    },
    secondary: { main: "#1e88e5" },
    grey: { main: "#1e88e5" }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: "relative",
        "& $notchedOutline": {
          borderColor: "#000"
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "#1e88e5",
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            borderColor: "#1e88e5"
          }
        },
        "&$focused $notchedOutline": {
          borderColor: "#1e88e5",
          borderWidth: 2
        }
      }
    },
    MuiFormLabel: {
      root: {
        // "&$focused": {
        color: "#000"
        // }
      }
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: `'Montserrat', sans-serif`,
    background: '#383f48',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '100vh',
    // margin: '-20px 0 50px',
  },
  container: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 30,
    '@media screen and (max-width: 768px)': {
      width: '60%',
      backgroundColor: 'white',
      borderRadius: 30,
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    // top: '50%',
    // left: '50%',
    marginTop: 10,
    // marginLeft: -12,
  },
}));

const Login = (props) => {
  const mobileView = useMediaQuery("(max-width: 558px)")
  const classes = useStyles();
  const { setUserData } = useContext(UserContext);
  const [name, setName] = useState("");
  const [resgisterUserName, setRegisterUserName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [errSignInMsg, setErrSignInMsg] = useState("");
  const [errRegisterMsg, setErrRegisterMsg] = useState("");
  const [signInLoader, setSignInLoader] = useState(false);
  const [registerLoader, setRegisterLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    setSignInLoader(true);
    const url = window.apihost + "login";
    const loginUser = {
      "userName": userName,
      "password": password
    }
    await axios.post(url, loginUser)
      .then(function (response) {
        // handle success
        sessionStorage.setItem("auth-token", response.data.token);
        sessionStorage.setItem("userData", JSON.stringify(response.data));
        setUserData(response.data);
        setSignInLoader(false);
      })
      .catch(err => {
        const errors = {
          msg: err.response.data.message,
          status: err.response.status
        }
        setErrSignInMsg(err.response.data.message);
        setSignInLoader(false);
      });
  }

  const handleSignInUserName = (e) => {
    setUserName(e.target.value);
    setErrSignInMsg("");
  }

  const handleSignInPassword = (e) => {
    setPassword(e.target.value);
    setErrSignInMsg("");
  }

  const onRegister = () => {
    setRegisterLoader(true);
    const url = window.apihost + "registration";
    const newUser = {
      "name": name,
      "userName": resgisterUserName,
      "password": registerPassword,
      // "passwordCheck": passwordCheck
    };
    axios.post(url, newUser)
      .then(function (response) {
        // handle success
        alert("Successfully Registered " + response.data);
        setRegisterLoader(false);
      })
      .catch(err => {
        const errors = {
          msg: err.response.data,
          status: err.response.status
        }
        setErrRegisterMsg(err.response.data);
        setRegisterLoader(false);
      });
  }

  const handleName = (e) => {
    setName(e.target.value);
    setErrRegisterMsg("");
  }

  const handleRegisterUserName = (e) => {
    setRegisterUserName(e.target.value);
    setErrRegisterMsg("");
  }

  const handleRegisterPassword = (e) => {
    setRegisterPassword(e.target.value);
    setErrRegisterMsg("");
  }

  const handlePasswordChecker = (e) => {
    setPasswordCheck(e.target.value);
    setErrRegisterMsg("");
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1 style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>Logo</h1>
        <h6 style={{ textAlign: 'center', marginTop: 10, marginBottom: 5, color: 'red' }}>{errSignInMsg}</h6>
        <div style={{ paddingLeft: 30, paddingRight: 30, }}>
          <form>
            <div>
              <ThemeProvider theme={inputTheme}>
                <div style={{ width: '100%', marginBottom: 20 }}>
                  <TextField id="outlined-basic" size='large' fullWidth label="Username" variant="outlined"
                    InputProps={{
                      // className: classes.input
                    }}
                    value={userName}
                    onChange={e => handleSignInUserName(e)}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput id="outlined-basic" size='medium' fullWidth label="Password" variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        className: classes.input
                      }}
                      value={password}
                      onChange={e => handleSignInPassword(e)}
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
                    />
                  </FormControl>
                </div>
              </ThemeProvider>

              <div style={{ margin: '0 auto', marginTop: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Button
                  size='large'
                  variant='contained'
                  style={{ backgroundColor: '#1e88e5', color: '#fff', borderRadius: 20, width: '130px', height: '50px' }}
                  disabled={signInLoader}
                  onClick={onLogin}
                  type='submit'
                >
                  {signInLoader === false ? "Sign In" : ""}
                </Button>
                {signInLoader === true && <CircularProgress size={30} className={classes.buttonProgress} />}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                <a href='#'><b>Forgot Password?</b></a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
}

export default Login;
