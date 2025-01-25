import {Rarity} from "./rarity.ts";

/**
 * Represents a card's overall rating
 */
export class OverallRating {
    readonly DiamondUpperEndpoint: number = 99;
    readonly DiamondLowerEndpoint: number = 85;
    readonly GoldUpperEndpoint: number = 84;
    readonly GoldLowerEndpoint: number = 80;
    readonly SilverUpperEndpoint: number = 79;
    readonly SilverLowerEndpoint: number = 75;
    readonly BronzeUpperEndpoint: number = 74;
    readonly BronzeLowerEndpoint: number = 65;
    readonly CommonUpperEndpoint: number = 64;
    readonly CommonLowerEndpoint: number = 40;
    /**
     * The rating
     * @private
     */
    private readonly _rating: number;

    constructor(rating: number) {
        this._rating = rating;
    }

    get rating(): number {
        return this._rating;
    }

    get rarity(): Rarity {
        if (this.isDiamond) {
            return Rarity.Diamond;
        } else if (this.isGold) {
            return Rarity.Gold;
        } else if (this.isSilver) {
            return Rarity.Silver;
        } else if (this.isBronze) {
            return Rarity.Bronze;
        } else {
            return Rarity.Common;
        }
    }

    get isDiamond(): boolean {
        return this._rating >= this.DiamondLowerEndpoint;
    }

    get isGold(): boolean {
        return this._rating >= this.GoldLowerEndpoint && this._rating <= this.GoldUpperEndpoint;
    }

    get isSilver(): boolean {
        return this._rating >= this.SilverLowerEndpoint && this._rating <= this.SilverUpperEndpoint;
    }

    get isBronze(): boolean {
        return this._rating >= this.BronzeLowerEndpoint && this._rating <= this.BronzeUpperEndpoint;
    }

    get isCommon(): boolean {
        return this._rating <= this.CommonUpperEndpoint;
    }
}