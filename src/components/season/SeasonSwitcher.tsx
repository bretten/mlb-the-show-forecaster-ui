import {Box, FormControl, MenuItem, Select} from "@mui/material"
import {useSeason} from "../../contexts/SeasonContext.ts";

/**
 * Switchers the current season
 * @constructor
 */
export const SeasonSwitcher = () => {
    const season = useSeason();

    return (
        <Box sx={{
            p: 2,
            gap: 1,
            alignItems: 'center'
        }}>
            <FormControl fullWidth>
                <Select
                    labelId="season-switcher-label"
                    id="season-switcher"
                    value={season.season}
                    label="Season"
                    onChange={(event) => {
                        season.switchSeason(event.target.value as number)
                    }}
                    variant={"standard"}
                    inputProps={{sx: {padding: 1}}}
                >
                    ({season.availableSeasons.map((s: number) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </Box>
    );
}