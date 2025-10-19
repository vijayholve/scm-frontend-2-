import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
  { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 }
];

const Devision = () => {
  const accountId = userDetails.getAccountId();

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <ReusableDataGrid
          title="DIVISION"
          entityName="DIVISION"
          fetchUrl={`/api/divisions/getAll/${accountId}`}
          isPostRequest={true}
          columns={columns}
          editUrl="/masters/division/edit"
          addActionUrl="/masters/division/add"
          deleteUrl="/api/devisions/delete"
          enableFilters={true}
          showSchoolFilter={true}
          showClassFilter={true}
          showDivisionFilter={false}
          viewScreenIs={true}
        />
      </Grid>
    </Grid>
    // </MainCard>
  );
};

export default Devision;
