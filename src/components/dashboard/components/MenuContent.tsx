import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {CasesRounded, TrendingUpRounded} from "@mui/icons-material";
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from "../../../contexts/AuthContext.ts";

const unauthenticatedItems = [
    {text: 'Player Trends', icon: <TrendingUpRounded/>, path: "/"},
];

const authenticatedItems = [
    {text: 'Player Trends', icon: <TrendingUpRounded/>, path: "/"},
    {text: 'Jobs', icon: <CasesRounded/>, path: "/jobs"}
];

interface MenuContentProps {
    onClick?: () => void;
}

export const MenuContent = ({onClick}: MenuContentProps) => {
    const auth = useAuth();
    const location = useLocation();
    const menuItems = auth.isAuthenticated ? authenticatedItems : unauthenticatedItems;

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}} component={Link} to={item.path}
                              onClick={onClick}>
                        <ListItemButton selected={location.pathname.endsWith(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
