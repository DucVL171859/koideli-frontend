import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Circle } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';

function createData(code, name, totalOrders, finishedOrders, unfinishedOrders, carbs, protein) {
    return { code, name, totalOrders, finishedOrders, unfinishedOrders, carbs, protein };
}

const rows = [
    createData(20240901, 'Camera Lens', 40, 35, 5, 2, 40570),
    createData(20240902, 'Laptop', 300, 299, 1, 0, 180139),
    createData(20240903, 'Mobile', 355, 350, 5, 1, 90989),
    createData(20240904, 'Handset', 50, 37, 13, 1, 10239),
    createData(20240905, 'Computer Accessories', 100, 100, 0, 1, 83348),
    createData(20240906, 'TV', 99, 99, 0, 0, 410780),
    createData(20240907, 'Keyboard', 125, 125, 0, 2, 70999),
    createData(20240908, 'Mouse', 89, 87, 2, 2, 10570),
    createData(20240909, 'Desktop', 185, 185, 0, 1, 98063),
    createData(20240910, 'Chair', 100, 100, 0, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function getColor(unfinishedOrders) {
    if (unfinishedOrders === 0) {
        return 'green';
    } else if (unfinishedOrders > 0 && unfinishedOrders < 10) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getStatusColorAndTitle(unfinishedOrders) {
    if (unfinishedOrders === 0) {
        return { color: 'success', title: 'Hot Selling' }; // Green for no unfinished orders
    } else if (unfinishedOrders > 0 && unfinishedOrders < 10) {
        return { color: 'warning', title: 'On Demand' }; // Yellow for few unfinished orders
    } else if (unfinishedOrders >= 10) {
        return { color: 'error', title: 'Out of Demand' }; // Red for many unfinished orders
    } else {
        return { color: 'none', title: '-' }
    };
}

function OrderStatus({ unfinishedOrders }) {
    const { color, title } = getStatusColorAndTitle(unfinishedOrders);

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Circle color={color} fontSize='small' />
            <Typography>{title}</Typography>
        </Stack>
    );
}

// ==============================|| ORDER TABLE - HEADER ||============================== //

const headCells = [
    {
        id: 'code',
        align: 'left',
        label: 'No.'
    },
    {
        id: 'name',
        align: 'left',
        label: 'Product Name'
    },
    {
        id: 'totalOrders',
        align: 'right',
        label: 'Total Orders'
    },
    {
        id: 'finishedOrders',
        align: 'right',
        label: 'Finished Orders'
    },
    {
        id: 'unfinishedOrders',
        align: 'right',
        label: 'Unfinished Orders'
    },
    {
        id: 'carbs',
        align: 'left',
        label: 'Status'
    },
    {
        id: 'protein',
        align: 'right',
        label: 'Total Amount'
    }
];

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding='normal'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
    const order = 'asc';
    const orderBy = 'tracking_no';

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table aria-labelledby="tableTitle">
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    tabIndex={-1}
                                    key={row.code}
                                >
                                    <TableCell component="th" id={labelId} scope="row">
                                        <Link color="secondary"> {row.code}</Link>
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="right">{row.totalOrders}</TableCell>
                                    <TableCell align="right">{row.finishedOrders}</TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: getColor(row.unfinishedOrders) }}
                                    >
                                        {row.unfinishedOrders}
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatus unfinishedOrders={row.unfinishedOrders} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <NumericFormat
                                            value={row.protein}
                                            displayType="text"
                                            thousandSeparator
                                            suffix='₫'
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
