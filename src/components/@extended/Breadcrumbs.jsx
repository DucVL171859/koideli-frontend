import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { Grid, Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import MainCard from "../MainCard";

export default function Breadcrumbs({ navigation, title, ...others }) {
    const location = useLocation();
    const [main, setMain] = useState();
    const [item, setItem] = useState();

    const getCollapse = (menu) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === 'collapse') {
                    getCollapse(collapse);
                } else if (collapse.type && collapse.type === 'item') {
                    if (location.pathname === collapse.url) {
                        setMain(menu);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    useEffect(() => {
        navigation?.items?.map((menu) => {
            if (menu.type && menu.type === 'group') {
                getCollapse(menu);
            }
            return false;
        });
    });

    if (location.pathname === '/breadcrumbs') {
        location.pathname = '/dashboard/analytics';
    }

    let mainContent;
    let itemContent;
    let breadcrumbContent = <Typography />;
    let itemTitle = '';

    if (main && main.type === 'collapse') {
        mainContent = (
            <Typography component={Link} to={document.location.pathname} variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {main.title}
            </Typography>
        );
    }

    if (item && item.type === 'item') {
        itemTitle = item.title;
        itemContent = (
            <Typography variant="subtitle1" color="textPrimary">
                {itemTitle}
            </Typography>
        );

        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <MainCard border={false} sx={{ mb: 3, bgcolor: 'transparent' }} {...others} content={false}>
                    <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                        <Grid item>
                            <MuiBreadcrumbs aria-label="breadcrumb">
                                <Typography component={Link} to="/admin/dashboard" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                                    Admin
                                </Typography>
                                {mainContent}
                                {itemContent}
                            </MuiBreadcrumbs>
                        </Grid>
                        {title && (
                            <Grid item sx={{ mt: 2 }}>
                                <Typography variant="h5">{item.title}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </MainCard>
            );
        }
    }

    return breadcrumbContent;
}

Breadcrumbs.propTypes = {
    card: PropTypes.bool,
    custom: PropTypes.bool,
    divider: PropTypes.bool,
    heading: PropTypes.string,
    icon: PropTypes.bool,
    icons: PropTypes.bool,
    links: PropTypes.array,
    maxItems: PropTypes.number,
    rightAlign: PropTypes.bool,
    separator: PropTypes.any,
    title: PropTypes.bool,
    titleBottom: PropTypes.bool,
    sx: PropTypes.any,
    others: PropTypes.any
};