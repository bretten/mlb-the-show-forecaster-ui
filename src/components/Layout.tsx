import {Dashboard} from "./dashboard/Dashboard.tsx";
import {LoadingOverlay} from "./feedback/LoadingOverlay.tsx";
import {useLayout} from "../contexts/LayoutContext.ts";

/**
 * Represents the Layout of the application
 *
 * @constructor
 */
export const Layout = () => {
    const {isLoading} = useLayout();
    return (
        <>
            <div>
                <Dashboard/>
                <LoadingOverlay isLoading={isLoading}/>
            </div>
        </>
    );
}