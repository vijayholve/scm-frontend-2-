import PropTypes from 'prop-types';
import { useState, forwardRef, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

// Structured dummy data for global search
const dummyData = [
  {
    entityName: 'Masters',
    path: '/masters',
    items: [
      { id: 'master-student', name: 'Student Master', subPath: '/student' },
      { id: 'master-teacher', name: 'Teacher Master', subPath: '/teacher' },
      { id: 'master-class', name: 'Class Master', subPath: '/class' },
      { id: 'master-subject', name: 'Subject Master', subPath: '/subject' },
      { id: 'master-timetable', name: 'Timetable Master', subPath: '/timetable' },
      { id: 'master-exam', name: 'Exam Master', subPath: '/exam' },
      { id: 'master-fee', name: 'Fee Master', subPath: '/fee' },
      { id: 'master-assignment', name: 'Assignment Master', subPath: '/assignment' },
      { id: 'master-attendance', name: 'Attendance Master', subPath: '/attendance' }
    ]
  },
  {
    entityName: 'People',
    path: '/people',
    items: [
      { id: 101, name: 'John Doe', type: 'student', subPath: '/students/view/' },
      { id: 102, name: 'Jane Smith', type: 'student', subPath: '/students/view/' },
      { id: 103, name: 'Mark Johnson', type: 'teacher', subPath: '/teachers/view/' },
      { id: 104, name: 'Emily White', type: 'teacher', subPath: '/teachers/view/' },
      { id: 105, name: 'Michael Brown', type: 'student', subPath: '/students/view/' },
      { id: 106, name: 'Jessica Davis', type: 'teacher', subPath: '/teachers/view/' },
      { id: 107, name: 'David Wilson', type: 'student', subPath: '/students/view/' },
      { id: 108, name: 'Sarah Miller', type: 'teacher', subPath: '/teachers/view/' }
    ]
  },
  {
    entityName: 'Courses & LMS',
    path: '/lms',
    items: [
      { id: 'lms-algebra1', name: 'Algebra I Course', subPath: '/courses/algebra1' },
      { id: 'lms-history2', name: 'World History II Course', subPath: '/courses/history2' },
      { id: 'lms-lesson1', name: 'Lesson: Introduction to Equations', type: 'lesson', subPath: '/courses/algebra1/lesson1' }
    ]
  }
];

const HeaderAvatar = forwardRef(({ children, ...others }, ref) => {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        bgcolor: 'secondary.light',
        color: 'secondary.dark',
        '&:hover': {
          bgcolor: 'secondary.dark',
          color: 'secondary.light'
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
});

HeaderAvatar.propTypes = {
  children: PropTypes.node
};

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState, filteredResults, showAll, setShowAll }) => {
  const theme = useTheme();

  const handleItemClick = (entityName, itemName, path, itemId) => {
    const finalPath = `${path}${itemId || ''}`;
    console.log(`Navigating to tab: ${entityName} -> ${itemName} (Path: ${finalPath})`);
    popupState.close();
    setValue(''); // Clear the search bar after navigation
    setShowAll(false); // Reset "Show more" state
  };

  const resultsToShow = showAll ? filteredResults : filteredResults.slice(0, 5);

  return (
    <Box sx={{ position: 'relative' }}>
      <OutlinedInput
        id="input-search-header"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowAll(false); // Reset "Show more" when typing
        }}
        placeholder="Search anything..."
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="16px" />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <HeaderAvatar>
              <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
            </HeaderAvatar>
            <Box sx={{ ml: 2 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'orange.light',
                  color: 'orange.dark',
                  '&:hover': {
                    bgcolor: 'orange.dark',
                    color: 'orange.light'
                  }
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="20px" />
              </Avatar>
            </Box>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
        sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
      />
      {value && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1,
            mt: 1,
            boxShadow: theme.shadows[4],
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              filteredResults.length > 0 ? (
                <ListSubheader component="div" id="nested-list-subheader">
                  Search Results
                </ListSubheader>
              ) : null
            }
          >
            {resultsToShow.length > 0 ? (
              resultsToShow.map((entity) => (
                <Box key={entity.entityName}>
                  <ListSubheader>{entity.entityName}</ListSubheader>
                  {entity.items.map((item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => handleItemClick(entity.entityName, item.name, entity.path, item.id)}
                    >
                      <ListItemText primary={item.name} secondary={item.type ? `Type: ${item.type}` : ''} />
                    </ListItemButton>
                  ))}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography>No results found.</Typography>
              </Box>
            )}
            {filteredResults.length > 5 && !showAll && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <Button onClick={() => setShowAll(true)}>Show more ({filteredResults.length - 5})</Button>
              </Box>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PopupState,
  filteredResults: PropTypes.array,
  showAll: PropTypes.bool,
  setShowAll: PropTypes.func
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const anchorRef = useRef(null);

  const filteredResults = dummyData.map(entity => {
    const matchedItems = entity.items.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(value.toLowerCase()))
    );
    return {
      ...entity,
      items: matchedItems
    };
  }).filter(entity => entity.items.length > 0);

  const handleItemClick = (entityName, itemName, path, itemId) => {
    const finalPath = `${path}${itemId || ''}`;
    console.log(`Navigating to tab: ${entityName} -> ${itemName} (Path: ${finalPath})`);
    setValue(''); // Clear the search bar after navigation
    setShowAllResults(false); // Reset "Show more" state
  };

  const resultsToShow = showAllResults ? filteredResults : filteredResults.slice(0, 5);

  return (
    <>
      {/* Mobile Search */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="19.2px" />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
              >
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                      <Box sx={{ p: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs>
                            <MobileSearch
                              value={value}
                              setValue={setValue}
                              popupState={popupState}
                              filteredResults={filteredResults}
                              showAll={showAllResults}
                              setShowAll={setShowAllResults}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>

      {/* Desktop Search */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ position: 'relative' }}>
          <OutlinedInput
            id="input-search-header"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowAllResults(false);
            }}
            placeholder="Search anything..."
            startAdornment={
              <InputAdornment position="start">
                <IconSearch stroke={1.5} size="16px" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <HeaderAvatar>
                  <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
                </HeaderAvatar>
              </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
            sx={{ width: { md: 250, lg: 434 }, ml: 2, px: 2 }}
            ref={anchorRef}
          />
          <Popper
            open={Boolean(value)}
            anchorEl={anchorRef.current}
            transition
            disablePortal
            placement="bottom-start"
            sx={{ zIndex: 1100, mt: 1, width: { md: 250, lg: 434 } }}
          >
            {({ TransitionProps }) => (
              <Transitions type="grow" {...TransitionProps}>
                <Paper
                  sx={{
                    boxShadow: theme.shadows[4],
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      filteredResults.length > 0 ? (
                        <ListSubheader component="div" id="nested-list-subheader">
                          Search Results
                        </ListSubheader>
                      ) : null
                    }
                  >
                    {resultsToShow.length > 0 ? (
                      resultsToShow.map((entity) => (
                        <Box key={entity.entityName}>
                          <ListSubheader>{entity.entityName}</ListSubheader>
                          {entity.items.map((item) => (
                            <ListItemButton
                              key={item.id}
                              onClick={() => handleItemClick(entity.entityName, item.name, entity.path, item.id)}
                            >
                              <ListItemText primary={item.name} secondary={item.type ? `Type: ${item.type}` : ''} />
                            </ListItemButton>
                          ))}
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ p: 2 }}>
                        <Typography>No results found.</Typography>
                      </Box>
                    )}
                    {filteredResults.length > 5 && !showAllResults && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                        <Button onClick={() => setShowAllResults(true)}>Show more ({filteredResults.length - 5})</Button>
                      </Box>
                    )}
                  </List>
                </Paper>
              </Transitions>
            )}
          </Popper>
        </Box>
      </Box>
    </>
  );
};

export default SearchSection;