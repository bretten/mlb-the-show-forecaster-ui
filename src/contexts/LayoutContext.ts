import React from "react";

/**
 * Defines the LayoutContextType
 */
export interface LayoutContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

/**
 * The layout context that provides state about the layout
 */
export const LayoutContext = React.createContext<LayoutContextType>(null!);

export const useLayout = () => {
    return React.useContext(LayoutContext);
}