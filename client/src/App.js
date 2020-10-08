import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

//components
import Main from './components/main';
import Login from './components/login/login';
import UserContext from './components/context/userContext';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 100,
    color: '#fff',
    backgroundColor: '#272c33'
  },
}));

function App() {
  const classes = useStyles();
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoader(false), 2000)
  }, [loader, setLoader]);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) setUserData(JSON.parse(data));
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      let token = sessionStorage.getItem("auth-token");
      if (token === null) {
        sessionStorage.setItem("auth-token", "");
        token = "";
      }
      const response = await axios.post(window.apihost + "login/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (response.data) {
        console.log(response.data);
        const user = await axios.get(window.apihost + "login/tokenIsValid",
          {
            headers: { "x-auth-token": token },
          });
        setUserData({
          token,
          user: response.data,
        });
      }
    };

    checkLogin();
  }, []);
  return (
    <div className="App" style={{ height: '100%', width: '100%', }}>
      <Backdrop className={classes.backdrop} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <UserContext.Provider value={{ userData, setUserData }}>
        {loader === false && userData.user &&
          <Main />
        }

        {loader === false && !userData.user &&
          <Login />
        }
      </UserContext.Provider>
    </div>
  );
}

export default App;
