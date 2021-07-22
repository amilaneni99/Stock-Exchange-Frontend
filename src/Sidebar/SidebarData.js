import React from 'react';
import { Business, ShowChart, Backup, Compare, Dashboard } from '@material-ui/icons';

export const SidebarData = (admin) => {
    if(admin === true) {
        return [
            {
                title: "Dashboard",
                icon: <Dashboard />,
                link: "/home"
            },
            {
                title: "Stock Exchanges",
                icon: <ShowChart />,
                link: "/stockExchanges"
            },
            {
                title: "Companies",
                icon: <Business />,
                link: "/companies"
            },
            {
                title: "Import Data",
                icon: <Backup />,
                link: "/import"
            },
        ];
    } else {
        return [
            {
                title: "Dashboard",
                icon: <Dashboard />,
                link: "/dashboard"
            },
            {
                title: "Stock Exchanges",
                icon: <ShowChart />,
                link: "/stockExchanges"
            },
            {
                title: "Compare",
                icon: <Compare />,
                link: "/compare"
            },
            {
                title: "Companies",
                icon: <Business />,
                link: "/companies"
            },
        ];
    }
}
