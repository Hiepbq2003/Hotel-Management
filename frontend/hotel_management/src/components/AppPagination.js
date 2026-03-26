import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

/**
 * Reusable client-side pagination component.
 * Props:
 *  - totalItems: total number of items
 *  - itemsPerPage: items per page (default 10)
 *  - currentPage: current page (1-indexed)
 *  - onPageChange: callback(page)
 */
const AppPagination = ({ totalItems, itemsPerPage = 10, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) pages.push(i);

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </small>
            <BSPagination className="mb-0">
                <BSPagination.First disabled={currentPage === 1} onClick={() => onPageChange(1)} />
                <BSPagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />

                {left > 1 && <BSPagination.Ellipsis disabled />}
                {pages.map(p => (
                    <BSPagination.Item key={p} active={p === currentPage} onClick={() => onPageChange(p)}>
                        {p}
                    </BSPagination.Item>
                ))}
                {right < totalPages && <BSPagination.Ellipsis disabled />}

                <BSPagination.Next disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />
                <BSPagination.Last disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} />
            </BSPagination>
        </div>
    );
};

export default AppPagination;
