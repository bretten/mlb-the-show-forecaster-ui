/**
 * Defines a Trend Report
 */
export interface TrendReportInterface {
    year: number;
    cardExternalId: string;
    mlbId: number;
    cardName: string;
    primaryPosition: string;
    overallRating: number;
    metricsByDate: TrendReportMetricsByDate[];
    impacts: TrendReportImpact[];
}

/**
 * Implementation of TrendReportInterface
 */
export class TrendReport implements TrendReportInterface {
    private readonly _year: number;
    private readonly _cardExternalId: string;
    private readonly _mlbId: number;
    private readonly _cardName: string;
    private readonly _primaryPosition: string;
    private readonly _overallRating: number;
    private readonly _metricsByDate: TrendReportMetricsByDate[];
    private readonly _impacts: TrendReportImpact[];

    constructor(Year: number, CardExternalId: string, MlbId: number, CardName: string, PrimaryPosition: string, OverallRating: number, MetricsByDate: TrendReportMetricsByDate[], Impacts: TrendReportImpact[]) {
        this._year = Year;
        this._cardExternalId = CardExternalId;
        this._mlbId = MlbId;
        this._cardName = CardName;
        this._primaryPosition = PrimaryPosition;
        this._overallRating = OverallRating;
        this._metricsByDate = MetricsByDate;
        this._impacts = Impacts;
    }

    get impacts(): TrendReportImpact[] {
        return this._impacts;
    }

    get metricsByDate(): TrendReportMetricsByDate[] {
        return this._metricsByDate;
    }

    get overallRating(): number {
        return this._overallRating;
    }

    get primaryPosition(): string {
        return this._primaryPosition;
    }

    get cardName(): string {
        return this._cardName;
    }

    get mlbId(): number {
        return this._mlbId;
    }

    get cardExternalId(): string {
        return this._cardExternalId;
    }

    get year(): number {
        return this._year;
    }

    public isPitcher(): boolean {
        return this._primaryPosition === "SP"
            || this._primaryPosition === "RP"
            || this._primaryPosition === "CP"
            || this._primaryPosition === "P";
    }

    public isPositionPlayer(): boolean {
        return this._primaryPosition === "C"
            || this._primaryPosition === "1B"
            || this._primaryPosition === "2B"
            || this._primaryPosition === "3B"
            || this._primaryPosition === "SS"
            || this._primaryPosition === "RF"
            || this._primaryPosition === "CF"
            || this._primaryPosition === "LF"
            || this._primaryPosition === "OF"
            || this._primaryPosition === "DH";
    }

    public isTwoWayPlayer(): boolean {
        return this._primaryPosition === "TWP";
    }
}

/**
 * Defines daily metrics for a trend report
 */
export interface TrendReportMetricsByDate {
    date: string;
    buyPrice: number;
    sellPrice: number;
    battingScore: number;
    significantBattingParticipation: boolean;
    pitchingScore: number;
    significantPitchingParticipation: boolean;
    fieldingScore: number;
    significantFieldingParticipation: boolean;
    battingAverage: number;
    onBasePercentage: number;
    slugging: number;
    earnedRunAverage: number;
    opponentsBattingAverage: number;
    strikeoutsPer9: number;
    baseOnBallsPer9: number;
    homeRunsPer9: number;
    fieldingPercentage: number;
}

/**
 * Defines a trend report impact
 */
export interface TrendReportImpact {
    start: string;
    end: string;
    description: string;
}