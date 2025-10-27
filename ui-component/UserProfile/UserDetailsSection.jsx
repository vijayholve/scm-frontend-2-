// vijayholve/scm-frontend-2-/scm-frontend-2--99de9307ae1a364fb21e20fbb2fb04cd318f2064/ui-component/UserProfile/UserDetailsSection.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast'; // <-- ADDED missing toast import

import { Grid, Stack, Typography, Button, Box, IconButton, TextField } from '@mui/material'; // <-- ADDED TextField for the modal
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

// material-ui Dialog components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// assets
import {
 IconMail,
 IconId,
 IconPhone,
 IconMapPin,
 IconUserCircle,
 IconGift, // <-- Used
 IconEdit, // <-- Used
 // Removed unused IconFile and unnecessary react import alias
} from '@tabler/icons-react';
import {useTranslation} from "react-i18next";
/**
 * Helper to format DOB to YYYY-MM-DD for TextField type="date"
 */
const getFormattedDob = (dob) => (dob ? new Date(dob).toISOString().substring(0, 10) : '');

/**
* UserDetailsSection Component
* Now internally handles the Birthday edit modal.
* @param {object} props.user - The user object containing profile details.
 * @param {function} props.onUserUpdate - Function to call on successful data save to update parent state.
*/
// Replaced onEditBirthday with onUserUpdate
const UserDetailsSection = ({ user, onUserUpdate }) => { 
 const theme = useTheme();
 const { t } = useTranslation(
  'profile'
 );

 // NEW: State for Birthday Modal and Input (MOVED IN)
 const [openBirthdayModal, setOpenBirthdayModal] = useState(false);
 // Initialize input state using a function to ensure it uses the current user prop
 const [birthdayInput, setBirthdayInput] = useState(getFormattedDob(user.dob)); 
 
 // Determine DOB display
 const userDob = user?.dob;
 
  const handleOpenBirthdayModal = () => {
   // Always reset input field from current user data before opening
   setBirthdayInput(getFormattedDob(user.dob)); 
   setOpenBirthdayModal(true);
 };
 
 const handleSaveBirthday = () => {
   if (!birthdayInput) {
     toast.error('Please enter a date.');
     return;
   }
   
   // TODO: Integrate actual API call here (e.g., PUT /api/users/update) to save the birthday.
   
   // Call the parent's update function to propagate the change
   onUserUpdate({ dob: birthdayInput }); 

   toast.success('Birthday saved successfully!');
   setOpenBirthdayModal(false);
 };
 
 // Format the date for display.
 const formattedDob = userDob ? new Date(userDob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null;

 return (
  <>
      <MainCard title={t('sectionUserTitle')} sx={{ mb: 4 }}>
   <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
     {/* ... (Existing stack of user details: Username, Email, Mobile, Address) ... */}
     <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
       <IconUserCircle stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
       <Typography variant="body2" color="text.secondary">
       {t('labelUsername')}: <Typography component="span" variant="subtitle2" color="text.primary">{user?.userName || 'N/A'}</Typography>
       </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
       <IconMail stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
       <Typography variant="body2" color="text.secondary">
        {t('labelEmail')}: <Typography component="span" variant="subtitle2" color="text.primary">{user?.email || 'N/A'}</Typography>
       </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
       <IconPhone stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
       <Typography variant="body2" color="text.secondary">
        {t('labelMobile')}: <Typography component="span" variant="subtitle2" color="text.primary">{user?.mobile || 'N/A'}</Typography>
       </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
       <IconMapPin stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
       <Typography variant="body2" color="text.secondary">
        {t('labelAddress')}: <Typography component="span" variant="subtitle2" color="text.primary">{user?.address || 'N/A'}</Typography>
       </Typography>
      </Stack>
     </Stack>
    </Grid>
    <Grid item xs={12} sm={6}>
     <Stack spacing={1}>
      {/* Birthday / Add Birthday Option (Calls internal handler) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
       <Stack direction="row" alignItems="center" spacing={1}>
        <IconGift stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
        <Typography variant="body2" color="text.secondary">
         {t('labelBirthday')}: 
        </Typography>
        {formattedDob ? (
         <Typography component="span" variant="subtitle2" color="text.primary" sx={{ ml: 1 }}>{formattedDob}</Typography>
        ) : (
         // Show "Add Birthday" button if not added
         <Button size="small" variant="outlined" startIcon={<IconEdit size="1rem" />} onClick={handleOpenBirthdayModal} sx={{ ml: 1 }}>
          {t('buttonAddBirthday')}
         </Button>
        )}
       </Stack>
       {/* Show edit icon next to the date if it's already set */}
       {formattedDob && (
        <IconButton size="small" onClick={handleOpenBirthdayModal} title={t('buttonEditBirthday')}>
         <IconEdit stroke={1.5} size="1.1rem" color={theme.palette.primary.main} />
        </IconButton>
       )}
      </Box>
      
      {/* Student-specific data (kept for context) */}
      {user.type === 'STUDENT' && (
       <Stack direction="row" alignItems="center" spacing={1}>
        <IconId stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
        <Typography variant="body2" color="text.secondary">
         {t('labelStudentId')}: <Typography component="span" variant="subtitle2" color="text.primary">{user?.rollNo || 'N/A'}</Typography>
        </Typography>
       </Stack>
      )}
     </Stack>
    </Grid>
   </Grid>
    {/* Birthday Edit Modal (MOVED IN) */}
      <Dialog open={openBirthdayModal} onClose={() => setOpenBirthdayModal(false)} maxWidth="xs" fullWidth>
       <DialogTitle>
        <Typography variant="h4">{user.dob ? t('buttonEditBirthday') : t('buttonAddBirthday')}</Typography>
       </DialogTitle>
       <DialogContent dividers>
        <TextField
         fullWidth
         label={t('labelBirthday')}
         type="date"
         // Value uses internal state
         value={birthdayInput} 
         onChange={(e) => setBirthdayInput(e.target.value)}
         InputLabelProps={{ shrink: true }}
         sx={{ mt: 1 }}
        />
       </DialogContent>
       <DialogActions>
        <Button onClick={() => setOpenBirthdayModal(false)}>{t('buttonCancel')}</Button>
        <Button onClick={handleSaveBirthday} variant="contained" color="primary">
         {user.dob ? t('buttonUpdateBirthday') : t('buttonAddBirthday')}
        </Button>
       </DialogActions>
      </Dialog>
      
    
  </MainCard>
    </>
 );
};

UserDetailsSection.propTypes = {
 user: PropTypes.object.isRequired,
 // The prop is removed since the logic is now internal
 // onEditBirthday: PropTypes.func.isRequired,
  onUserUpdate: PropTypes.func.isRequired, // New prop to handle state updates in the parent
};

export default UserDetailsSection;