import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../utils/permissionUtils';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'schoolName',
    headerName: 'School Name',
    width: 150,
    flex: 0.8
  },
  {
    field: 'className',
    headerName: 'Class Name',
    width: 120,
    flex: 0.6
  },
  {
    field: 'divisionName',
    headerName: 'Division Name',
    width: 120,
    flex: 0.6
  },
  // {
  //   field: 'createdDate',
  //   headerName: 'Created Date',
  //   width: 120,
  //   flex: 0.7,
  //   renderCell: (params) => {
  //     return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
  //   }
  // }
];

const Timetables = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user.user);
  const permissions = user?.role?.permissions;
  
  return (

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid 
             title="TIMETABLES"
            fetchUrl={`/api/timetable/getAllBy/${accountId}`}
            isPostRequest={true}
            columns={columns}
// viewScreenIs={true}
            addActionUrl="/masters/timetable/add" 
            editUrl="/masters/timetable/edit"
            deleteUrl="/api/timetable/delete"
            viewUrl="/masters/timetable/view"
            entityName="TIMETABLE"
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
          />
        </Grid>
      </Grid>
    // </MainCard>
  );
};

export default Timetables;