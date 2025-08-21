import React from 'react';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'user', headerName: 'User', width: 150 },
  { field: 'entityType', headerName: 'Entity Type', width: 150 },
  { field: 'entityId', headerName: 'Entity ID', width: 120 },
  { field: 'action', headerName: 'Action', width: 150 },
  { field: 'timestamp', headerName: 'Timestamp', flex: 1, valueFormatter: (params) => params?.value ? new Date(params.value).toLocaleString() : 'N/A' },
];

const AuditLogList = () => {
  const accountId = userDetails.getAccountId();
  return (
    <MainCard title="Audit Log">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ReusableDataGrid
            fetchUrl={`/api/auditlogs/getAll/${accountId}`}
            columns={columns}
            entityName="AUDIT_LOG"
            isPostRequest={true}
            searchPlaceholder="Search audit logs..."
            showSearch={true}
            showRefresh={true}
            showFilters={true}
            pageSizeOptions={[10, 25, 50]}
            defaultPageSize={10}
            height={600}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AuditLogList;