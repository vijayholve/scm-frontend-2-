import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import api, { userDetails } from "../../../utils/apiService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const columns = [
  { field: 'className', headerName: 'Class', width: 150 },
  { field: 'divisionName', headerName: 'Division', width: 150 },
  { field: 'subjectName', headerName: 'Subject', width: 150 },
  {
    field: 'attendanceDate',
    headerName: 'Attendance Date',
    width: 160,
    valueFormatter: (params) => params ? dayjs(params).format('YYYY-MM-DD') : ''
  }
];

const ActionWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 6px'
});

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const handleOnClickDelete = (data) => {
    if (data.id) {
      api.delete(`api/attendance/delete?id=${data?.id}`).then(response => {
        const filtered = attendance.filter(item => item.id !== data.id);
        setAttendance([...filtered]);
      }).catch(err => console.error(err));
    }
  };

 

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 190,
    minWidth: 190,
    hideable: false,
    renderCell: (params) => (
      <ActionWrapper>
        <Button
          variant="outlined"
          id="edit_attendance"
          priority="primary"
          onClick={(e) => navigate(`/masters/attendance/edit/${params.row.id}`)}
          disabled={false}
          startIcon={<EditOutlinedIcon />}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          id="delete_attendance"
          priority="primary"
          onClick={() => handleOnClickDelete(params.row)}
          disabled={false}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </ActionWrapper>
    )
  };

  const fetchAttendance = (page, pageSize) => {
    const pagination = {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    };
    api.post(`api/attendance/getAll/${userDetails.getAccountId()}`, pagination)
      .then(response => {
        setAttendance(response.data.content || []);
        setRowCount(response.data.totalElements || 0);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAttendance(page, pageSize);
    // eslint-disable-next-line
  }, [page, pageSize]);

  return (
    <MainCard title="Attendance List" secondary={
      <SecondaryAction icon={<AddIcon onClick={() => navigate(`/masters/attendance/add`)} />} />
    }>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={attendance}
                  columns={[...columns, actionColumn]}
                  pagination
                  paginationMode="server"
                  rowCount={rowCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  pageSizeOptions={[5, 10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  getRowId={(row) => row.id}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AttendanceList;