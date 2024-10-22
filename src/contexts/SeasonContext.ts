import React from "react";

/**
 * Defines the SeasonContextType
 */
export interface SeasonContextType {
    season: number;
    switchSeason: (season: number) => void;
    availableSeasons: number[];
}

/**
 * The season context
 */
export const SeasonContext = React.createContext<SeasonContextType>(null!);

export const useSeason = () => {
    return React.useContext(SeasonContext);
}