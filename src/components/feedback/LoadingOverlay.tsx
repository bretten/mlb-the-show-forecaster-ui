import {Backdrop, CircularProgress} from "@mui/material";

interface LoadingOverlayProps {
    isLoading: boolean;
}

/**
 * Renders an overlay to indicate that something is loading
 * @param isLoading True to show the overlay
 * @constructor
 */
export const LoadingOverlay = ({isLoading}: LoadingOverlayProps) => {
    return (
        <Backdrop open={isLoading}
                  sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}>
            <CircularProgress/>
        </Backdrop>
    )
}