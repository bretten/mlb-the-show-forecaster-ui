import React from "react";
import {LayoutContext} from "../contexts/LayoutContext.ts";

/**
 * Layout provider
 * @param children Any nested elements that need to reference the LayoutProvider
 * @constructor
 */
export const LayoutProvider = ({children}: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const value = {isLoading, setIsLoading};
    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}