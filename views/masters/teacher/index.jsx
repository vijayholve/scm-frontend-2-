import { useNavigate } from "react-router-dom";
// material-ui
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
//import Link from '@mui/material/Link';
//import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';

import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'userName',
    headerName: 'User Name',
    width: 150,
    editable: true
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 110,
    editable: true
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    width: 110,
    editable: true
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 110,
    editable: true
  }
];


const ActionWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 6px'
});
// ==============================|| USERS ||============================== //

const Users = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  console.log('User:', user);

  const handleOnClickDelete = (data) => {
    if (data.id) {
      api.delete(`api/users/delete?id=${data?.id}`).then(response => {
        const filterTeachers = teachers.filter(teacher => teacher.id !== data.id);
        setTeachers([...filterTeachers]);
      }).catch(err => console.error(err));
    }
  }

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 190,
    minWidth: 190,
    hideable: false,
    renderCell: (params) => {
      return (
        <ActionWrapper>
          <Button
            variant="outlined"
            id="approve_user"
            priority="primary"
            onClick={(e) => navigate(`/masters/teacher/edit/${params.row.id}`)}
            disabled={false}
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            id="reject_user"
            priority="primary"
            onClick={(e) => handleOnClickDelete(params.row)}
            disabled={false}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </ActionWrapper>
      );
    }
  };
  const fetchTeachers = (page, pageSize) => {
    api.post(`api/users/getAll/${userDetails.getAccountId()}?type=TEACHER`, {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    }).then(response => {
      setTeachers(response.data.content || []);
      setRowCount(response.data.totalElements || 0);
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTeachers(page, pageSize);
  }, [page, pageSize]);

  return (
    <MainCard title="Teachers" secondary={<SecondaryAction icon={<AddIcon onClick={(e) => navigate(`/masters/teacher/add`)} />} />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          {/* <SubCard title="Teachers"> */}
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={teachers}
                  columns={[...columns, actionColumn]}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5
                      }
                    }
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Grid>
          </Grid>
          {/* </SubCard> */}
        </Grid>
      </Grid>
    </MainCard>
  )
};

export default Users;
