import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Card } from '@material-ui/core';
import { NavigateNext as NavigateNextIcon, Person, HomeWork, Map, SentimentDissatisfied } from '@material-ui/icons';
import Select from 'react-select';
import ReactMapGL, { Marker } from 'react-map-gl';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserInjured, faMapMarkedAlt, faSchool, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';

// Chart Component
import zingchart from 'zingchart/es6';
import ZingChart from 'zingchart-react';

const axios = require('axios');

const customSelectStyle = {
    control: base => ({
        ...base,
        height: 35,
        minHeight: 35,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        backgroundColor: '#383f48',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
    }),
    singleValue: base => ({
        ...base,
        color: "#fff"
    }),
    input: base => ({
        ...base,
        color: "#fff"
    })
};

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        width: '100%',
        padding: 15,
        '@media screen and (max-width: 768px)': {
            width: '100%',
            padding: 5,
        }
    },
    titleDiv: {
        color: '#1e88e5',
        marginBottom: '20px',
    },
    cards: {
        backgroundColor: '#272c33',
        height: '100%',
    },
    totalGrid: {
        height: '20vh',
        maxHeight: '20vh',
        '@media screen and (max-width: 768px)': {
            height: '20vh',
            maxHeight: '20vh',
        }
    },
    breakdownGrid: {
        height: '50vh',
        maxHeight: '50vh',
    },
    mapCard: {
        backgroundColor: '#272c33',
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
        position: 'relative',
        '@media screen and (max-width: 768px)': {
            marginTop: 100
        }
    },
    breakdownRightContentCard: {
        backgroundColor: '#272c33',
        height: '100%',
        maxHeight: '21vh',
        padding: '20px',
        '@media screen and (max-width: 768px)': {
            marginTop: 40,
            maxHeight: '24vh'
        }
    },
    selectDiv: {
        float: 'right',
        width: '75%',
        zIndex: 100,
        '@media screen and (max-width: 768px)': {
            float: 'right',
            width: '50%',
            zIndex: 100,
        }
    },
    title: {
        color: '#fff',
        fontFamily: `"Montserrat", sans-serif`,
        alpha: 1,
    },
    numbersOfPregnantTxt: {
        fontFamily: `"Montserrat", sans-serif`,
        fontWeight: 400
    },
}));

const chartConfig = {
    type: 'bar',
    backgroundColor: '#272c33',
    title: {
        text: 'Breakdown Per Page',
        // margin: '15px auto',
        align: 'left',
        alpha: 1,
        backgroundColor: 'none',
        fontColor: '#fff',
        fontSize: '22px',
        'font-family': `"Montserrat", sans-serif`,
    },
    legend: {
        color: '#fff',
        // margin: '65px auto auto 500px',  
        alpha: 0.05,
        borderWidth: '0px',
        backgroundColor: 'transparent',
        align: 'right',
        layout: 'x2',
        item: {
            fontColor: '#fff'
        },
        marker: {
            type: 'circle',
            borderColor: 'none',
            size: '10px'
        },
        title: {
            color: '#fff'
        },
        maxItems: 2,
        pageStatus: {
            color: '#fff'
        },
        shadow: false,
        toggleAction: 'remove',
        marginBottom: 0
    },
    plot: {
        animation: {
            effect: 'ANIMATION_SLIDE_BOTTOM'
        }
    },
    plotarea: {
        margin: '80 40 20 40',
        y: '60px'
    },
    scaleX: {
        guide: {
            visible: false
        },
        item: {
            fontColor: '#7e7e7e'
        },
        labels: ['0', '1', '2', '3', '4', '5', '6'],
        lineColor: '#7E7E7E'
    },
    scaleY: {
        values: '0:100:10',
        guide: {
            visible: true
        },
        item: {
            fontColor: '#7e7e7e'
        },
    },
    series: [
        {
            text: 'Growth',
            color: '#fff',
            values: [28.09, 60.59, 44.74, 33.34],
            borderRadiusTopLeft: '7px',
            alpha: 0.95,
            backgroundColor: '#80b1d3'
        },
        {
            text: 'Net',
            color: '#fff',
            values: [17.09, 80.59, 59.74, 19.34],
            borderRadiusTopLeft: '7px',
            alpha: 0.95,
            backgroundColor: '#b3de69'
        },
    ],
    height: '90%',
    width: "100%"
};

function DisasterEventOption(item) {
    var list = [
        { label: 'Mayon Volcano Eruption', value: '1' },
        { label: 'COVID 19', value: '2' },
        { label: 'Fire in Legazpi City', value: '3' },
    ];
    // if (item !== undefined) {
    //     item.map(x => {
    //         var name = x.firstName + " " + x.lastName;

    //         return (
    //             list.push({
    //                 label: name,
    //                 value: x.id
    //             }))
    //     })
    // }
    return list;
}

function Dashboard() {
    const classes = useStyles();
    const [selectedDisasterEvent, setSelectedDisasterEvent] = useState(null);
    const [data, setData] = useState(null);
    const [totalEvacuees, setTotalEvacuees] = useState(0);
    const [totalBarangaysAffected, setTotalBarangaysAffected] = useState(0);
    const [totalSchoolAffected, setTotalSchoolAffected] = useState(0);
    const [totalCasualties, setTotalCasualties] = useState(0);
    const [totalMale, setTotalMale] = useState(0);
    const [totalFemale, setTotalFemale] = useState(0);
    const [totalPregnant, setTotalPregnant] = useState(0);
    const [totalPwd, setTotalPwd] = useState(0);
    const [viewPorts, setViewPorts] = useState({
        latitude: 13.148115,
        longitude: 123.738941,
        zoom: 12.5,
        width: '100%',
        height: '50vh'
    });

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
                    setData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setData(obj);
                }
                setTotalEvacuees(data.length);
                setTotalMale(data.filter(x => x.gender === "male" || x.gender === "Male").length);
                setTotalFemale(data.filter(x => x.gender === "female" || x.gender === "Female").length);
                setTotalPregnant(data.filter(x => x.pregnant === true).length);
                setTotalPwd(data.filter(x => x.pwd === true).length);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [data]);

    const breakdownChartConfig = {
        type: 'ring',
        backgroundColor: '#272c33',
        globals: {
            fontFamily: `"Montserrat", sans-serif`,
            fontWeight: '100'
        },
        title: {
            text: 'Breakdown Per Gender',
            fontColor: 'white',
            align: 'left',
            'font-family': `"Montserrat", sans-serif`,
            offsetX: '10px',
        },
        legend: {
            align: 'left',
            backgroundColor: 'none',
            borderWidth: '0px',
            item: {
                cursor: 'pointer',
                fontColor: '#fff',
                fontSize: '15px',
                offsetX: '-6px'
            },
            marker: {
                type: 'circle',
                borderWidth: '0px',
                cursor: 'pointer',
                size: 9
            },
            mediaRules: [
                {
                    maxWidth: '200px',
                    visible: false,
                }
            ],
            toggleAction: 'remove',
            marginTop: '40px',
            verticalAlign: 'top'
        },
        animation: {
            delay: 0,
            effect: 'ANIMATION_EXPAND_VERTICAL',
            method: 'ANIMATION_LINEAR',
            sequence: 'ANIMATION_BY_PLOT',
            speed: '600'
        },
        detach: false,
        hoverState: {
            visible: false
        },
        refAngle: 270,
        slice: 175,
        "scale": {
            "size-factor": 0.7,
        },
        "plot": {
            "value-box": {
                "placement": "out",
                "font-size": 15,
                "font-weight": "normal"
            }
        },
        "plotarea": {
            "margin-left": "55%",
            "margin-right": "0%",
            "margin-top": "0%",
            "margin-bottom": "15%"
        },
        tooltip: {
            visible: true
        },
        series: [
            {
                text: 'Male',
                values: [totalMale],
                backgroundColor: '#80b1d3',
                lineColor: '#80b1d3',
                borderColor: '#282E3D',
                lineWidth: '1px',
                marker: {
                    backgroundColor: '#80b1d3'
                }
            },
            {
                text: 'Female',
                values: [totalFemale],
                backgroundColor: '#b3de69',
                lineColor: '#b3de69',
                borderColor: '#282E3D',
                lineWidth: '1px',
                marker: {
                    backgroundColor: '#b3de69'
                }
            },
        ]
    };

    let highRiskEvacueesChartConfig = {
        type: 'ring',
        backgroundColor: '#272c33',
        globals: {
            fontFamily: `"Montserrat", sans-serif`,
            fontWeight: '100'
        },
        title: {
            text: 'High Risk Evacuees',
            fontColor: 'white',
            align: 'left',
            'font-family': `"Montserrat", sans-serif`,
            offsetX: '10px',
        },
        legend: {
            align: 'left',
            backgroundColor: 'none',
            borderWidth: '0px',
            item: {
                cursor: 'pointer',
                fontColor: '#fff',
                fontSize: '15px',
                offsetX: '-6px'
            },
            marker: {
                type: 'circle',
                borderWidth: '0px',
                cursor: 'pointer',
                size: 9
            },
            mediaRules: [
                {
                    maxWidth: '200px',
                    visible: false,
                }
            ],
            toggleAction: 'remove',
            marginTop: '40px',
            verticalAlign: 'top'
        },
        animation: {
            delay: 0,
            effect: 'ANIMATION_EXPAND_VERTICAL',
            method: 'ANIMATION_LINEAR',
            sequence: 'ANIMATION_BY_PLOT',
            speed: '600'
        },
        detach: false,
        hoverState: {
            visible: false
        },
        refAngle: 270,
        slice: 175,
        "scale": {
            "size-factor": 0.7,
        },
        "plot": {
            "value-box": {
                "placement": "out",
                "font-size": 15,
                "font-weight": "normal"
            }
        },
        "plotarea": {
            "margin-left": "55%",
            "margin-right": "0%",
            "margin-top": "0%",
            "margin-bottom": "15%"
        },
        tooltip: {
            visible: true
        },
        series: [
            {
                text: 'Elderly Pregnant',
                values: [totalPregnant],
                backgroundColor: '#80b1d3',
                lineColor: '#80b1d3',
                borderColor: '#282E3D',
                lineWidth: '1px',
                marker: {
                    backgroundColor: '#80b1d3'
                }
            },
            {
                text: 'PWD',
                values: [totalPwd],
                backgroundColor: '#b3de69',
                lineColor: '#b3de69',
                borderColor: '#282E3D',
                lineWidth: '1px',
                marker: {
                    backgroundColor: '#b3de69'
                }
            },
        ]
    };

    return (
        <div className={classes.mainDiv}>
            <div className={classes.titleDiv}>
                <Typography variant='h5'>Dashboard</Typography>
            </div>

            <div>
                <div style={{ float: 'left' }}>
                    <Typography style={{ color: '#677574', marginTop: '5px' }}>Select Disaster Event</Typography>
                </div>

                <div className={classes.selectDiv}>
                    <Select
                        defaultValue={selectedDisasterEvent}
                        options={DisasterEventOption()}
                        onChange={e => setSelectedDisasterEvent(e)}
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

            <Grid container spacing={window.innerWidth <= 558 ? 2 : 5} style={{ marginBottom: '20px' }}>
                {
                    //region total evacuees
                    <Grid item xs={3} className={classes.totalGrid}>
                        <Card className={classes.cards} style={{ display: 'flex' }}>
                            <div style={{ margin: '0 auto', alignSelf: 'center' }}>
                                {window.innerWidth <= 558 ?
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <FontAwesomeIcon icon={faUserInjured} style={{ color: '#ff9041', width: 50, height: 50, }} />
                                    </div>
                                    :
                                    <div style={{ float: 'left', marginRight: '10px' }}>
                                        <FontAwesomeIcon icon={faUserInjured} style={{ color: '#ff9041', width: 70, height: 70, }} />
                                    </div>
                                }
                                {window.innerWidth <= 558 ?
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography component="h6" variant="h6" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalEvacuees}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff', fontSize: 11 }}>
                                            Total Evacuees
                                        </Typography>
                                    </div>
                                    :
                                    <div style={{ float: 'left' }}>
                                        <Typography component="h4" variant="h4" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalEvacuees}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff' }}>
                                            Total Evacuees
                                        </Typography>
                                    </div>
                                }
                            </div>
                        </Card>
                    </Grid>
                    //end region
                }

                {
                    // region barangays affected
                    <Grid item xs={3} className={classes.totalGrid}>
                        <Card className={classes.cards} style={{ display: 'flex' }}>
                            <div style={{ margin: '0 auto', alignSelf: 'center' }}>
                                {window.innerWidth <= 558 ?
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <FontAwesomeIcon icon={faMapMarkedAlt} style={{ color: '#6772e5', width: 50, height: 50, }} />
                                    </div>
                                    :
                                    <div style={{ float: 'left', marginRight: '10px' }}>
                                        <FontAwesomeIcon icon={faMapMarkedAlt} style={{ color: '#6772e5', width: 70, height: 70, }} />
                                    </div>
                                }
                                {window.innerWidth <= 558 ?
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography component="h6" variant="h6" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalBarangaysAffected}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff', fontSize: 11 }}>
                                            Barangays Affected
                                        </Typography>
                                    </div>
                                    :
                                    <div style={{ float: 'left' }}>
                                        <Typography component="h4" variant="h4" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalBarangaysAffected}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff' }}>
                                            Barangays Affected
                                        </Typography>
                                    </div>
                                }
                            </div>
                        </Card>
                    </Grid>
                    //end region
                }

                {
                    //region school affected
                    <Grid item xs={3} className={classes.totalGrid}>
                        <Card className={classes.cards} style={{ display: 'flex' }}>
                            <div style={{ margin: '0 auto', alignSelf: 'center' }}>
                                {window.innerWidth <= 558 ?
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <FontAwesomeIcon icon={faSchool} style={{ color: '#24d2b5', width: 50, height: 50, }} />
                                    </div>
                                    :
                                    <div style={{ float: 'left', marginRight: '10px' }}>
                                        <FontAwesomeIcon icon={faSchool} style={{ color: '#24d2b5', width: 70, height: 70, }} />
                                    </div>
                                }
                                {window.innerWidth <= 558 ?
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography component="h6" variant="h6" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalSchoolAffected}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff', fontSize: 11 }}>
                                            School Affected
                                        </Typography>
                                    </div>
                                    :
                                    <div style={{ float: 'left' }}>
                                        <Typography component="h4" variant="h4" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalSchoolAffected}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff' }}>
                                            School Affected
                                        </Typography>
                                    </div>
                                }
                            </div>
                        </Card>
                    </Grid>
                    //end region
                }

                {
                    //region total casualties
                    <Grid item xs={3} className={classes.totalGrid}>
                        <Card className={classes.cards} style={{ display: 'flex' }}>
                            <div style={{ margin: '0 auto', alignSelf: 'center' }}>
                                {window.innerWidth <= 558 ?
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <FontAwesomeIcon icon={faSkullCrossbones} style={{ color: '#ff5c6c', width: 50, height: 50, }} />
                                    </div>
                                    :
                                    <div style={{ float: 'left', marginRight: '10px' }}>
                                        <FontAwesomeIcon icon={faSkullCrossbones} style={{ color: '#ff5c6c', width: 70, height: 70, }} />
                                    </div>
                                }
                                {window.innerWidth <= 558 ?
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography component="h6" variant="h6" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalCasualties}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff', fontSize: 11 }}>
                                            Total Casualties
                                        </Typography>
                                    </div>
                                    :
                                    <div style={{ float: 'left' }}>
                                        <Typography component="h4" variant="h4" style={{ color: '#fff', fontFamily: `"Montserrat", sans-serif`, fontWeight: 400 }}>
                                            {totalCasualties}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" style={{ color: '#fff' }}>
                                            Total Casualties
                                        </Typography>
                                    </div>
                                }
                            </div>
                        </Card>
                    </Grid>
                    //end region
                }
            </Grid>

            <Grid container spacing={window.innerWidth <= 558 ? 0 : 5} style={{ marginBottom: '20px' }}>
                <Grid item xs={window.innerWidth <= 558 ? 12 : 8} className={classes.breakdownGrid}>
                    <Card className={classes.cards} style={{ padding: '20px' }}>
                        <ZingChart data={chartConfig} />
                    </Card>
                </Grid>
                <Grid item xs={window.innerWidth <= 558 ? 12 : 4} className={classes.breakdownGrid}>
                    <Card className={classes.breakdownRightContentCard} style={{ marginBottom: '40px', }}>
                        {/* <Typography variant='h6' style={{ color: '#fff' }}>Breakdown Per Gender</Typography> */}
                        <ZingChart data={breakdownChartConfig} height='217px' width='100%' />
                    </Card>

                    <Card className={classes.breakdownRightContentCard}>
                        {/* <Typography variant='h6' className={classes.title}><b>Numbers of Pregnant Women</b></Typography> */}
                        <div>
                            {/* <div style={{ float: 'left', marginLeft: '50px' }}>
                                <Typography variant='h1' className={classes.numbersOfPregnantTxt} style={{ color: '#fff', }}>300</Typography>
                            </div> */}
                            <ZingChart data={highRiskEvacueesChartConfig} height='214px' width='100%' />
                        </div>
                    </Card>
                </Grid>
            </Grid>

            {
                <div className={classes.mapCard}>
                    <Typography variant='h5' className={classes.title} style={{ position: 'absolute', zIndex: 100, marginLeft: '20px', marginTop: '20px' }}><b>Map of Affected Areas</b></Typography>

                    <ReactMapGL
                        {...viewPorts}
                        mapboxApiAccessToken={window.mapBoxAccessToken}
                        mapStyle="mapbox://styles/roden/ckdrkfxx902cn19s1glxvmgw7"
                        onViewportChange={viewport => {
                            setViewPorts(viewport);
                        }}
                    >
                        Markers
                    </ReactMapGL>
                </div>
            }
        </div >
    );
}

export default Dashboard;
