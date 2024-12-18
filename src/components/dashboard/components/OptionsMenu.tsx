import * as React from 'react';
import {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {dividerClasses} from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import {paperClasses} from '@mui/material/Paper';
import {listClasses} from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, {listItemIconClasses} from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {MenuButton} from './MenuButton';
import {AuthContext} from "../../../contexts/AuthContext.ts";
import {useNavigate} from "react-router-dom";
import {useLayout} from "../../../contexts/LayoutContext.ts";

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});

export const OptionsMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const {setIsLoading} = useLayout();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setIsLoading(true);
        e.preventDefault();
        handleClose();
        logout(() => {
            setIsLoading(false);
            navigate("/");
        });
    }

    const text = {
        marginRight: "10px"
    };

    return (
        <React.Fragment>
            <MenuButton
                aria-label="Open menu"
                onClick={handleClick}
                sx={{borderColor: 'transparent'}}
            >
                <MoreVertRoundedIcon/>
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '10px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },
                }}
            >
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText primaryTypographyProps={{style: text}}>Logout</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
