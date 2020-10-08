import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Card } from '@material-ui/core';
import Select from 'react-select';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        width: '100%',
        padding: 15
    },
    titleDiv: {
        color: '#1e88e5',
        marginBottom: '20px',
    },
}));

function BarangayList() {
    const classes = useStyles();
    return (
        <div className={classes.mainDiv}>
            <div className={classes.titleDiv}>
                <Typography variant='h5'>List of Barangay</Typography>
            </div>
        </div>
    );
}

export default BarangayList;