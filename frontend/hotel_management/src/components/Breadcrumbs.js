import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const currentPath = '/' + pathnames.join('/');
    if (currentPath === '/' || currentPath === '/home') return null;

    return (
        <Breadcrumb className='my-4 rounded-1 px-1'>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                Home
            </Breadcrumb.Item>
            {pathnames.map((name, index) => {
                const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Breadcrumb.Item active key={name}>
                        {capitalize(name)}
                    </Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeTo }} key={name}>
                        {capitalize(name)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default Breadcrumbs;
