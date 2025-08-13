import React from 'react';

// project imports
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';

// Define the columns for the Roles data grid.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 200, flex: 1 }
];

const RolesList = () => {
    const accountId = userDetails.getAccountId();

    return (
        <ReusableDataGrid
            title="Manage Roles"
            fetchUrl={`/api/roles/getAll/${accountId}`}
            columns={columns}
            addActionUrl="/masters/role/add"
            editUrl="/masters/role/edit"
            deleteUrl="/api/roles/delete"
            entityName="ROLE"
        />
    );
};

export default RolesList;