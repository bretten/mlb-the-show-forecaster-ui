import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {CasesRounded, LoginRounded, TableRowsRounded} from "@mui/icons-material";
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from "../../../contexts/AuthContext.ts";

const unauthenticatedItems = [
    {text: 'Login', icon: <LoginRounded/>, path: "/login"},
];

const authenticatedItems = [
    {text: 'Jobs', icon: <CasesRounded/>, path: "/"},
    {text: 'Data', icon: <TableRowsRounded/>, path: "/data"}
];

export const MenuContent = () => {
    const auth = useAuth();
    const location = useLocation();
    const menuItems = auth.isAuthenticated ? authenticatedItems : unauthenticatedItems;

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}} component={Link} to={item.path}>
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
