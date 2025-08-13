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
import { DataGrid, GridVisibilityOffIcon } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';


import { useEffect, useState } from "react";
import api from "../../../../utils/apiService";
import { useSelector } from "react-redux";

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    editable: true,
  },
  {
    field: 'title', // e.g., 'Midterm', 'Final', 'Quiz 1'
    headerName: 'Title',
    width: 150,
    editable: true,
  },
  {
    field: 'schoolName', // The score obtained by the student
    headerName: 'School Name',
    width: 100,
    type: 'number', // Helps with sorting and filtering numerical data
    editable: true,
  },
  {
    field: 'className', // The maximum possible score for the exam
    headerName: 'Class Name',
    width: 100,
    type: 'number',
    editable: true,
  },
  {
    field: 'divisionName', // The maximum possible score for the exam
    headerName: 'Division Name',
    width: 100,
    type: 'number',
    editable: true,
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

const Exams = () =>  {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);
  const user = useSelector(state => state.user);

  const handleOnClickDelete = (data) => {
    if (data.rollno) {
      api.delete(`api/lms/course/delete?id=${data?.id}`).then(response => {
        const filterCourses = courses.filter(course => course.id !== data.id);
        setCourses([...filterCourses]);
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
            onClick={(e) => navigate(`/masters/lms/course/edit/${params.row.id}`)}
            disabled={false}
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            id="reject_user"
            priority="primary"
            onClick={() => handleOnClickDelete(params.row)}
            disabled={false}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            id="view_course"
            priority="primary"
            onClick={() => navigate(`/masters/lms/course/view/${params.row.id}`)}
            disabled={false}
            startIcon={<GridVisibilityOffIcon />}
          >
            View
          </Button>
        </ActionWrapper>
      );
    }
  };
  const fetchExams = (page, pageSize) => {
      api.post(`api/lms/course/getAll/${user?.user?.accountId}?type=EXAM`, {
       page: page,
       size: pageSize,
       sortBy: "id",
       sortDir: "asc",
       search: ""
     }).then(response => {
       setCourses(response.data.content || []);
       setRowCount(response.data.totalElements || 0);
     }).catch(err => console.error(err));
   };
 
   useEffect(() => {
     fetchExams(page, pageSize);
   }, [page, pageSize]);

  return (
    <MainCard title="Courses" secondary={<SecondaryAction icon ={<AddIcon onClick={(e) => navigate(`/masters/lms/course/add`)} />}  />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          {/* <SubCard title="Teachers"> */}
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={courses}
                    getRowId={(row) => row?.id}
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

export default Exams;
