import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import api, { userDetails } from "../../../utils/apiService";
import BackButton from "layout/MainLayout/Button/BackButton";

const defaultActions = ["add", "edit", "view", "delete"];

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState({
    id: null,
    name: "",
    permissions: []
  });
  const [entities, setEntities] = useState([]);

  // Fetch entities and role data if editing
  useEffect(() => {
    // Fetch all entities (API should return all possible entities)
    api.get(`api/features/getAllByAccountId/${userDetails.getAccountId()}`).then((res) => {
      setEntities(res.data || []);
    });

    if (id) {
      api.get(`api/roles/getById?id=${id}`).then((res) => {
        setRole(res.data);
      });
    }
  }, [id]);

  // Handle role name change
  const handleNameChange = (e) => {
    setRole({ ...role, name: e.target.value });
  };

  // Handle permission change
  const handlePermissionChange = (name, action) => (e) => {
    setRole((prevRole) => {
      const permissions = [...prevRole.permissions];
      let permIdx = permissions.findIndex((p) => p.name === name);
      if (permIdx === -1) {
        // Add new permission for this entity
        permissions.push({
          id: null,
          name: entities.find((ent) => ent.name === name)?.name || "",
          entityName: entities.find((ent) => ent.name === name)?.name || "",
          actions: {
            id: null,
            add: false,
            edit: false,
            view: false,
            delete: false
          },
          accountId: null
        });
        permIdx = permissions.length - 1;
      }
      permissions[permIdx] = {
        ...permissions[permIdx],
        actions: {
          ...permissions[permIdx].actions,
          [action]: e.target.checked
        }
      };
      return { ...prevRole, permissions };
    });
  };

  // Get checked state for a permission
  const isChecked = (name, action) => {
    const perm = role.permissions.find((p) => p.name === name);
    return perm?.actions?.[action] || false;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    role.accountId = userDetails.getAccountId();
    if (role.id) {
      await api.post("api/roles/save", role);
    } else {
      await api.post("api/roles/save", role);
    }
    navigate("/masters/roles");
  };

  return (
    <MainCard title={role.id ? "Edit Role" : "Create Role"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role Name"
              value={role.name}
              onChange={handleNameChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Configure Permissions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entity</TableCell>
                  {defaultActions.map((action) => (
                    <TableCell key={action} align="center" sx={{ textTransform: "capitalize" }}>
                      {action}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>{entity.name}</TableCell>
                    {defaultActions.map((action) => (
                      <TableCell align="center" key={action}>
                        <Checkbox
                          checked={isChecked(entity.name, action)}
                          onChange={handlePermissionChange(entity.name, action)}
                          color="primary"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={3} display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary">
            {role.id ? "Update" : "Create"}
          </Button>
          <Grid container spacing={gridSpacing}>

          <BackButton BackUrl={"/masters/roles"}/> 
          </Grid>
        </Box>
      </form>
    </MainCard>
  );
};
export default RoleEdit;