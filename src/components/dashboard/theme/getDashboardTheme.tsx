import {PaletteMode, ThemeOptions} from '@mui/material/styles';
import {getDesignTokens} from './themePrimitives';
import {
    dataDisplayCustomizations,
    inputsCustomizations,
    navigationCustomizations,
    surfacesCustomizations,
} from './customizations';

export default function getDashboardTheme(mode: PaletteMode): ThemeOptions {
    return {
        ...getDesignTokens(mode),
        components: {
            ...inputsCustomizations,
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
        },
    };
}
