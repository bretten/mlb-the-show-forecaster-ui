import Stack from "@mui/material/Stack";
import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
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
import {TrendChartTooltip} from "./TrendChartTooltip.tsx";

export interface TrendChartProps {
    trendReport: TrendReport;
}

// Converts the x-axis index value to the corresponding date
const dateFormatter = (xAxisDates: string[], index: number) => {
    return xAxisDates[index];
};

// The buy and sell price series
const baseSeries: (LineSeriesType | BarSeriesType | ScatterSeriesType)[] = [
    {type: 'bar', dataKey: "buyPrice", label: "Buy Price", yAxisId: 'rightAxis'},
    {type: 'bar', dataKey: "sellPrice", label: "Sell Price", yAxisId: 'rightAxis'}
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
    "BattingAverage": {type: 'line', dataKey: "battingAverage", label: "AVG", yAxisId: 'leftAxis'},
    "OnBasePercentage": {type: 'line', dataKey: "onBasePercentage", label: "OBP", yAxisId: 'leftAxis'},
    "Slugging": {type: 'line', dataKey: "slugging", label: "SLG", yAxisId: 'leftAxis'},
    "BattingScore": {type: 'line', dataKey: "battingScore", label: "Score", yAxisId: 'leftAxis'},
    "EarnedRunAverage": {type: 'line', dataKey: "earnedRunAverage", label: "ERA", yAxisId: 'leftAxis'},
    "OpponentsBattingAverage": {
        type: 'line',
        dataKey: "opponentsBattingAverage",
        label: "OBA",
        yAxisId: 'leftAxis'
    },
    "StrikeoutsPer9": {type: 'line', dataKey: "strikeoutsPer9", label: "K/9", yAxisId: 'leftAxis'},
    "BaseOnBallsPer9": {type: 'line', dataKey: "baseOnBallsPer9", label: "BB/9", yAxisId: 'leftAxis'},
    "HomeRunsPer9": {type: 'line', dataKey: "homeRunsPer9", label: "HR/9", yAxisId: 'leftAxis'},
    "PitchingScore": {type: 'line', dataKey: "pitchingScore", label: "Score", yAxisId: 'leftAxis'},
};


export const TrendChart = ({trendReport}: TrendChartProps) => {
    // x-axis values will be the indexes of the dates array and will pull the corresponding date when labeling
    const xAxisDates: string[] = trendReport.metricsByDate.map((_) => _.date);
    const xAxisIndexes = xAxisDates.map((_, index) => index);

    /**
     * Gets the concatenated series that will be viewable
     * @param key
     * @param trendReport
     */
    const getSeries = (key: string, trendReport: TrendReport) => {
        const allPrices = trendReport.metricsByDate.map((m) => m.sellPrice).concat(trendReport.metricsByDate.map((m) => m.buyPrice));
        const maxPrice = Math.max(...allPrices);
        const maxPriceLabel = Math.ceil(maxPrice * 1.10);

        const scatterSeries = impactSeries;
        scatterSeries.data = trendReport.impacts.map((impact, index) => {
            return {
                x: xAxisDates.indexOf(impact.start),
                y: maxPriceLabel,
                id: index,
                desc: `${impact.start}: ${impact.description}`,
            } as never;
        });

        return [...baseSeries, allSeries[key], scatterSeries];
    }

    const initialSeries = trendReport.isPitcher() ? "EarnedRunAverage" : "BattingAverage";
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
                        dataset={(trendReport.metricsByDate as unknown as DatasetElementType<never>[])}
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
                                itemContent: TrendChartTooltip
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
                        defaultValue={trendReport.isPitcher() ? "EarnedRunAverage" : "BattingAverage"}
                    >
                        {(trendReport.isPositionPlayer() || trendReport.isTwoWayPlayer()) &&
                            (
                                <>
                                    <FormControlLabel value="BattingAverage" control={<Radio/>} label="AVG"/>
                                    <FormControlLabel value="OnBasePercentage" control={<Radio/>} label="OBP"/>
                                    <FormControlLabel value="Slugging" control={<Radio/>} label="SLG"/>
                                    <FormControlLabel value="BattingScore" control={<Radio/>} label="Batting Score"/>
                                </>
                            )}
                        {(trendReport.isPitcher() || trendReport.isTwoWayPlayer()) &&
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