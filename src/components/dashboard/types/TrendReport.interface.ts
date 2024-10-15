/**
 * Defines a Trend Report
 */
export interface TrendReportInterface {
    Year: number;
    CardExternalId: string;
    MlbId: number;
    CardName: string;
    PrimaryPosition: string;
    OverallRating: number;
    MetricsByDate: TrendReportMetricsByDate[];
    Impacts: TrendReportImpact[];
}

/**
 * Implementation of TrendReportInterface
 */
export class TrendReport implements TrendReportInterface {
    private readonly _Year: number;
    private readonly _CardExternalId: string;
    private readonly _MlbId: number;
    private readonly _CardName: string;
    private readonly _PrimaryPosition: string;
    private readonly _OverallRating: number;
    private readonly _MetricsByDate: TrendReportMetricsByDate[];
    private readonly _Impacts: TrendReportImpact[];

    constructor(Year: number, CardExternalId: string, MlbId: number, CardName: string, PrimaryPosition: string, OverallRating: number, MetricsByDate: TrendReportMetricsByDate[], Impacts: TrendReportImpact[]) {
        this._Year = Year;
        this._CardExternalId = CardExternalId;
        this._MlbId = MlbId;
        this._CardName = CardName;
        this._PrimaryPosition = PrimaryPosition;
        this._OverallRating = OverallRating;
        this._MetricsByDate = MetricsByDate;
        this._Impacts = Impacts;
    }

    get Impacts(): TrendReportImpact[] {
        return this._Impacts;
    }

    get MetricsByDate(): TrendReportMetricsByDate[] {
        return this._MetricsByDate;
    }

    get OverallRating(): number {
        return this._OverallRating;
    }

    get PrimaryPosition(): string {
        return this._PrimaryPosition;
    }

    get CardName(): string {
        return this._CardName;
    }

    get MlbId(): number {
        return this._MlbId;
    }

    get CardExternalId(): string {
        return this._CardExternalId;
    }

    get Year(): number {
        return this._Year;
    }

    public IsPitcher(): boolean {
        return this._PrimaryPosition === "SP"
            || this._PrimaryPosition === "RP"
            || this._PrimaryPosition === "CP"
            || this._PrimaryPosition === "P";
    }

    public IsPositionPlayer(): boolean {
        return this._PrimaryPosition === "C"
            || this._PrimaryPosition === "1B"
            || this._PrimaryPosition === "2B"
            || this._PrimaryPosition === "3B"
            || this._PrimaryPosition === "SS"
            || this._PrimaryPosition === "RF"
            || this._PrimaryPosition === "CF"
            || this._PrimaryPosition === "LF";
    }

    public IsTwoWayPlayer(): boolean {
        return this._PrimaryPosition === "TWP";
    }
}

/**
 * Defines daily metrics for a trend report
 */
export interface TrendReportMetricsByDate {
    Date: string;
    BuyPrice: number;
    SellPrice: number;
    BattingScore: number;
    SignificantBattingParticipation: boolean;
    PitchingScore: number;
    SignificantPitchingParticipation: boolean;
    FieldingScore: number;
    SignificantFieldingParticipation: boolean;
    BattingAverage: number;
    OnBasePercentage: number;
    Slugging: number;
    EarnedRunAverage: number;
    OpponentsBattingAverage: number;
    StrikeoutsPer9: number;
    BaseOnBallsPer9: number;
    HomeRunsPer9: number;
    FieldingPercentage: number;
}

/**
 * Defines a trend report impact
 */
export interface TrendReportImpact {
    Start: string;
    End: string;
    Description: string;
}