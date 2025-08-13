import { useState } from 'react';

/**
 * A custom hook to manage the pagination state for a Material-UI DataGrid.
 * @param {object} [initialState] - The initial state for pagination.
 * @param {number} [initialState.page=0] - The initial page number.
 * @param {number} [initialState.pageSize=10] - The initial page size.
 * @returns {{paginationModel: object, setPaginationModel: function}} - The pagination state and its setter function.
 */
const usePagination = (initialState = { page: 0, pageSize: 10 }) => {
    const [paginationModel, setPaginationModel] = useState(initialState);

    return {
        paginationModel,
        setPaginationModel,
    };
};

export default usePagination;
