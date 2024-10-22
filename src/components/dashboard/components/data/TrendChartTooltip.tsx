import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme} from "@mui/material";
import {ChartsItemContentProps} from "@mui/x-charts";
import React from "react";

/**
 * Custom tooltip for TrendChart
 * @param itemData Data for the point on the chart
 * @param series Data for the series containing the data point
 * @constructor
 */
export const TrendChartTooltip: React.ElementType<ChartsItemContentProps<any>> = ({itemData, series}) => {
    const graphType = itemData.type;
    const index = itemData.dataIndex;
    const dataValue = series.data[index];
    const label = series.label;
    const color = series.color;
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1]
        }}>
            <Table aria-label="Trend Chart">
                <TableBody>
                    <TableRow
                        key={index}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="td" scope="row">
                            <Box
                                sx={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    boxShadow: theme.shadows[1],
                                    backgroundColor: color,
                                    borderColor: theme.palette.background.paper,
                                    border: 'solid hsl(220, 30%, 7%) 2px',
                                    boxSizing: 'content-box',
                                }}
                            />
                        </TableCell>
                        {graphType != 'scatter' ? (
                            <>
                                <TableCell component="td" scope="row">
                                    {label}
                                </TableCell>
                                <TableCell align="left">{dataValue}</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell align="left">{dataValue.desc}</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};