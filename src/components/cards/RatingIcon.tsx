import Diamond from '../../assets/shield-diamond.webp';
import Gold from '../../assets/shield-gold.webp';
import Silver from '../../assets/shield-silver.webp';
import Bronze from '../../assets/shield-bronze.webp';
import Common from '../../assets/shield-common.webp';
import {Box} from "@mui/material";
import {OverallRating} from "./overallRating.ts";
import {Rarity} from "./rarity.ts";

/**
 * An icon representing a card's rating
 *
 * @param rating The rating
 * @param size The icon size
 * @constructor
 */
export const RatingIcon = ({rating, size}: { rating: OverallRating, size: number }) => {
    let icon;
    if (rating.rarity == Rarity.Diamond) {
        icon = Diamond;
    } else if (rating.rarity == Rarity.Gold) {
        icon = Gold;
    } else if (rating.rarity == Rarity.Silver) {
        icon = Silver;
    } else if (rating.rarity == Rarity.Bronze) {
        icon = Bronze;
    } else {
        icon = Common;
    }

    return (
        <Box component="img" src={icon} alt="Diamond" sx={{height: size, width: size}}/>
    );
}
