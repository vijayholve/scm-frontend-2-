import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import { useTranslation } from 'react-i18next'; 

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'subjectCode', headerName: 'Subject Code', width: 150, flex: 1 }
];

const Subjects = () => {
    const accountId = userDetails.getAccountId();
    const { t } = useTranslation("title");
    
    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Subjects Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all subjects, with filtering capabilities.
        </Typography>
      </Box>
    );

    return (
        // <MainCard
        //     title="Manage Subjects"
        //     secondary={<SecondaryAction icon={<AddIcon />} link="/masters/subject/add" />}
        // >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                     title={t('subjects')}
                     viewScreenIs={true}
                        fetchUrl={`/api/subjects/getAll/${accountId}`}
                        isPostRequest={true}
                        columns={columns}
                        editUrl="/masters/subject/edit"
                        addActionUrl="/masters/subject/add"
                        deleteUrl="/api/subjects/delete"
                        entityName="SUBJECT"
                        enableFilters={true}
                        showSchoolFilter={true}
                        // showClassFilter={true}
                        showDivisionFilter={false}
                    />
                </Grid>
            </Grid>
        // </MainCard>
    );
};

export default Subjects;