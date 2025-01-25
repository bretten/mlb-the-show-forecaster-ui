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
    private readonly _isBoosted: boolean;
    private readonly _orders1H: number;
    private readonly _orders24H: number;
    private readonly _buyPrice: number;
    private readonly _buyPriceChange24H: number;
    private readonly _sellPrice: number;
    private readonly _sellPriceChange24H: number;
    private readonly _score: number;
    private readonly _scoreChange2W: number;
    private readonly _demand: number;

    constructor(Year: number, CardExternalId: string, MlbId: number, CardName: string, PrimaryPosition: string, OverallRating: number, MetricsByDate: TrendReportMetricsByDate[], Impacts: TrendReportImpact[],
                isBoosted: boolean, orders1H: number, orders24H: number, buyPrice: number, buyPriceChange24H: number, sellPrice: number, sellPriceChange24H: number, score: number, scoreChange2W: number, demand: number) {
        this._year = Year;
        this._cardExternalId = CardExternalId;
        this._mlbId = MlbId;
        this._cardName = CardName;
        this._primaryPosition = PrimaryPosition;
        this._overallRating = OverallRating;
        this._metricsByDate = MetricsByDate;
        this._impacts = Impacts;
        this._isBoosted = isBoosted;
        this._orders1H = orders1H;
        this._orders24H = orders24H;
        this._buyPrice = buyPrice;
        this._buyPriceChange24H = buyPriceChange24H;
        this._sellPrice = sellPrice;
        this._sellPriceChange24H = sellPriceChange24H;
        this._score = score;
        this._scoreChange2W = scoreChange2W;
        this._demand = demand;
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

    get isBoosted(): boolean {
        return this._isBoosted;
    }

    get orders1H(): number {
        return this._orders1H;
    }

    get orders24H(): number {
        return this._orders24H;
    }

    get buyPrice(): number {
        return this._buyPrice;
    }

    get buyPriceChange24H(): number {
        return this._buyPriceChange24H;
    }

    get sellPrice(): number {
        return this._sellPrice;
    }

    get sellPriceChange24H(): number {
        return this._sellPriceChange24H;
    }

    get score(): number {
        return this._score;
    }

    get scoreChange2W(): number {
        return this._scoreChange2W;
    }

    get demand(): number {
        return this._demand;
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
    demand: number;
    orderCount: number;
}

/**
 * Defines a trend report impact
 */
export interface TrendReportImpact {
    start: string;
    end: string;
    description: string;
    demand: number;
}