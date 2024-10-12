import Stack from "@mui/material/Stack";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";
import {
    BarPlot,
    BarSeriesType,
    ChartsGrid,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LinePlot,
    LineSeriesType,
    MarkPlot,
    ResponsiveChartContainer,
    ScatterPlot,
    ScatterSeriesType
} from "@mui/x-charts";
import {DatasetElementType} from "@mui/x-charts/internals";
import {TrendReport} from "../../types/TrendReport.interface.ts";
import {ChangeEvent, useState} from "react";

export interface TrendChartProps {
    trendReport: TrendReport;
}

// Converts the x-axis index value to the corresponding date
const dateFormatter = (xAxisDates: string[], index: number) => {
    return xAxisDates[index];
};

// Custom tooltip content
const toolTipContent = props => {
    const {itemData, series} = props;
    const graphType = itemData.type;
    const index = itemData.dataIndex;
    const dataValue = series.data[index];
    const label = series.label;
    const color = series.color;

    return (
        <TableContainer component={Paper} sx={{
            backgroundColor: color,
            boxShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
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
                                    boxShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
                                    backgroundColor: color,
                                    borderColor: 'hsl(220, 30%, 7%)',
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
                                <TableCell align="right">{dataValue}</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell align="right">{dataValue.desc}</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// The buy and sell price series
const baseSeries: (LineSeriesType | BarSeriesType | ScatterSeriesType)[] = [
    {type: 'bar', dataKey: "BuyPrice", label: "Buy Price", yAxisId: 'rightAxis'},
    {type: 'bar', dataKey: "SellPrice", label: "Sell Price", yAxisId: 'rightAxis'}
];
// The forecast impact series
const impactSeries: ScatterSeriesType = {
    type: 'scatter',
    data: [],
    markerSize: 5,
    color: '#fe5f55',
    yAxisId: 'rightAxis'
};
// All available and selectable series to view along with the buy, sell, and impact series
const allSeries: Readonly<Record<string, (LineSeriesType | BarSeriesType | ScatterSeriesType)>> = {
    "BattingAverage": {type: 'line', dataKey: "BattingAverage", label: "AVG", yAxisId: 'leftAxis'},
    "OnBasePercentage": {type: 'line', dataKey: "OnBasePercentage", label: "OBP", yAxisId: 'leftAxis'},
    "Slugging": {type: 'line', dataKey: "Slugging", label: "SLG", yAxisId: 'leftAxis'},
    "BattingScore": {type: 'line', dataKey: "BattingScore", label: "Score", yAxisId: 'leftAxis'},
    "EarnedRunAverage": {type: 'line', dataKey: "EarnedRunAverage", label: "ERA", yAxisId: 'leftAxis'},
    "OpponentsBattingAverage": {
        type: 'line',
        dataKey: "OpponentsBattingAverage",
        label: "OBA",
        yAxisId: 'leftAxis'
    },
    "StrikeoutsPer9": {type: 'line', dataKey: "StrikeoutsPer9", label: "K/9", yAxisId: 'leftAxis'},
    "BaseOnBallsPer9": {type: 'line', dataKey: "BaseOnBallsPer9", label: "BB/9", yAxisId: 'leftAxis'},
    "HomeRunsPer9": {type: 'line', dataKey: "HomeRunsPer9", label: "HR/9", yAxisId: 'leftAxis'},
    "PitchingScore": {type: 'line', dataKey: "PitchingScore", label: "Score", yAxisId: 'leftAxis'},
};


export const TrendChart = ({trendReport}: TrendChartProps) => {
    // x-axis values will be the indexes of the dates array and will pull the corresponding date when labeling
    const xAxisDates: string[] = trendReport.MetricsByDate.map((_) => _.Date);
    const xAxisIndexes = xAxisDates.map((_, index) => index);

    /**
     * Gets the concatenated series that will be viewable
     * @param key
     * @param trendReport
     */
    const getSeries = (key: string, trendReport: TrendReport) => {
        const scatterSeries = impactSeries;
        scatterSeries.data = trendReport.Impacts.map((impact, index) => {
            return {
                x: xAxisDates.indexOf(impact.Start),
                y: 0,
                id: index,
                desc: `${impact.Start}: ${impact.Description}`,
            } as never;
        });

        return [...baseSeries, allSeries[key], scatterSeries];
    }

    const initialSeries = trendReport.IsPitcher() ? "EarnedRunAverage" : "BattingAverage";
    const [visibleSeries, setVisibleSeries] = useState<(LineSeriesType | BarSeriesType | ScatterSeriesType)[]>(getSeries(initialSeries, trendReport));
    const [focusedSeries, setFocusedSeries] = useState<(LineSeriesType | BarSeriesType | ScatterSeriesType)>(allSeries[initialSeries]);

    const handleStatChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFocusedSeries(allSeries[(event.target as HTMLInputElement).value]);
        setVisibleSeries(getSeries((event.target as HTMLInputElement).value, trendReport));
    };

    return (
        <Stack sx={{width: '100%'}}>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{width: '100%'}}>
                    <ResponsiveChartContainer
                        series={visibleSeries}
                        dataset={(trendReport.MetricsByDate as unknown as DatasetElementType<never>[])}
                        xAxis={[
                            {
                                scaleType: 'band',
                                label: 'Date',
                                data: xAxisIndexes,
                                valueFormatter: (v) => {
                                    return dateFormatter(xAxisDates, v)
                                }
                            },
                        ]}
                        yAxis={[
                            {id: 'leftAxis', scaleType: 'linear'},
                            {id: 'rightAxis', scaleType: 'linear'}
                        ]}
                        height={400}
                        margin={{top: 50, right: 80, bottom: 50, left: 80}}
                    >
                        <ChartsGrid horizontal/>

                        <BarPlot/>
                        <LinePlot/>
                        <MarkPlot/>
                        <ScatterPlot/>

                        <ChartsXAxis/>
                        <ChartsYAxis
                            axisId="leftAxis"
                            label={focusedSeries.label?.toString() ?? "Stat"}
                            labelStyle={{transform: 'translateX(-30px) translateY(-175px)'}}
                        />
                        <ChartsYAxis
                            axisId="rightAxis"
                            position="right"
                            label="Price"
                            labelStyle={{transform: 'translateX(30px) translateY(-175px)'}}
                        />
                        <ChartsTooltip
                            trigger="item"
                            slots={{
                                itemContent: toolTipContent
                            }}
                        />
                    </ResponsiveChartContainer>
                </Box>
            </Box>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <FormControl>
                    <FormLabel id="stat-toggle-label">Stat</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="stat-toggle-label"
                        name="stat-radio-buttons-group"
                        onChange={handleStatChange}
                        defaultValue={trendReport.IsPitcher() ? "EarnedRunAverage" : "BattingAverage"}
                    >
                        {(trendReport.IsPositionPlayer() || trendReport.IsTwoWayPlayer()) &&
                            (
                                <>
                                    <FormControlLabel value="BattingAverage" control={<Radio/>} label="AVG"/>
                                    <FormControlLabel value="OnBasePercentage" control={<Radio/>} label="OBP"/>
                                    <FormControlLabel value="Slugging" control={<Radio/>} label="SLG"/>
                                    <FormControlLabel value="BattingScore" control={<Radio/>} label="Batting Score"/>
                                </>
                            )}
                        {(trendReport.IsPitcher() || trendReport.IsTwoWayPlayer()) &&
                            (
                                <>
                                    <FormControlLabel value="EarnedRunAverage" control={<Radio/>} label="ERA"/>
                                    <FormControlLabel value="OpponentsBattingAverage" control={<Radio/>} label="OBA"/>
                                    <FormControlLabel value="StrikeoutsPer9" control={<Radio/>} label="K/9"/>
                                    <FormControlLabel value="BaseOnBallsPer9" control={<Radio/>} label="BB/9"/>
                                    <FormControlLabel value="HomeRunsPer9" control={<Radio/>} label="HR/9"/>
                                    <FormControlLabel value="PitchingScore" control={<Radio/>} label="Pitching Score"/>
                                </>
                            )}

                    </RadioGroup>
                </FormControl>
            </Box>
        </Stack>
    );
}