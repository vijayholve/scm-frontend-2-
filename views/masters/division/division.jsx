import React from 'react';

// project imports
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx'; 
import { userDetails } from '../../../utils/apiService';

// Define the columns specifically for the Devision data grid.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
    { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 },
];

// ==============================|| SIMPLIFIED DEVISION LIST ||============================== //

const Devision = () => {
    const accountId = userDetails.getAccountId();

    return (
        <ReusableDataGrid
            title="Manage Devision"
            fetchUrl={`/api/divisions/getAll/${accountId}`}
            columns={columns}
            addActionUrl="/masters/division/add"
            editUrl="/masters/division/edit"
            deleteUrl="/api/devisions/delete"
        />
    );
};

export default Devision;