import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, Typography, Table, TableBody } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const StyledTableCell = withStyles((theme) => ({
    head: {
        //   backgroundColor: theme.palette.common.black,
        backgroundColor: '#272c33',
        color: theme.palette.common.white,
        minWidth: 180
    },
    body: {
        // minWidth: 340
        minWidth: 180
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

const tableCell = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function UsersLoading() {
    return (
        <TableBody>
            {tableCell.map(x =>
                <StyledTableRow>
                    <StyledTableCell>
                        <Typography variant="h4">
                            <Skeleton />
                        </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                        <Typography variant="h4">
                            <Skeleton />
                        </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                        <Typography variant="h4">
                            <Skeleton />
                        </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                        <Typography variant="h4">
                            <Skeleton />
                        </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                        <Typography variant="h4">
                            <Skeleton />
                        </Typography>
                    </StyledTableCell>
                </StyledTableRow>
            )}
        </TableBody>
    );
}

export default UsersLoading;