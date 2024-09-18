import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {CasesRounded, TableRowsRounded} from "@mui/icons-material";
import {Link, useLocation} from 'react-router-dom';

const mainListItems = [
    {text: 'Jobs', icon: <CasesRounded/>, path: "/"},
    {text: 'Data', icon: <TableRowsRounded/>, path: "/data"}
];

export const MenuContent = () => {
    const location = useLocation();
    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {mainListItems.map((item, index) => (
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
