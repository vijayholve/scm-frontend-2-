import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Select, MenuItem, FormControl, InputLabel, IconButton, useMediaQuery } from '@mui/material'; // <-- Added useMediaQuery, IconButton
import { useState } from 'react';
// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
// assets
import { IconMenu2, IconLanguage } from '@tabler/icons-react'; // <-- Added IconLanguage
// NEW: Import i18n instance from the root configuration
import i18n from '../../../i18n'; 

// ==============================|| LANGUAGE SELECTOR COMPONENT (Inlined) ||============================== //
const LanguageSelector = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // Initialize with current i18n language, defaulting to 'en'
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en'); 
    
    const languageOptions = [
        { code: 'en', label: 'English' },
        { code: 'mr', label: 'मराठी' },
        { code: 'hi', label: 'हिन्दी ' },
        { code: 'sp', label: 'Español' },
        { code: 'fr', label: 'Français' }
    ];

    // Handler for language change
    const handleLanguageChange = (eventOrCode) => {
        const newLang = typeof eventOrCode === 'string' ? eventOrCode : eventOrCode.target.value;
        i18n.changeLanguage(newLang); 
        setCurrentLanguage(newLang);
    };

    // Handler for mobile tap (cycles through languages: en -> mr -> hi -> en)
    const handleMobileToggle = () => {
        const currentIndex = languageOptions.findIndex(opt => opt.code === currentLanguage);
        const nextIndex = (currentIndex + 1) % languageOptions.length;
        handleLanguageChange(languageOptions[nextIndex].code);
    };

    return (
        // Desktop View: Dropdown Selector
        <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center', 
            mr: 2 
        }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="header-language-select-label">Lang</InputLabel>
                <Select
                    labelId="header-language-select-label"
                    id="header-language-select"
                    value={currentLanguage}
                    label="Lang"
                    onChange={handleLanguageChange}
                >
                    {languageOptions.map(option => (
                         <MenuItem key={option.code} value={option.code}>{option.label}</MenuItem>
                    ))}
                    
                </Select>
            </FormControl>
        </Box>
        
        // Mobile View: Icon Button - this will be placed where the component is rendered
        // Since we cannot return two elements, we rely on the caller to manage the display property,
        // but for now, we'll embed the mobile button inside a wrapper that is also hidden on desktop.
        // The most common pattern is placing this right before NotificationSection.
    );
};
// ==============================|| MOBILE LANGUAGE ICON BUTTON ||============================== //
const MobileLanguageButton = () => {
    const theme = useTheme();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en'); 
    
    const languageOptions = [
        { code: 'en', label: 'EN' },
        { code: 'mr', label: 'MR' },
        { code: 'hi', label: 'HI' },    
    ];
    
    const handleMobileToggle = () => {
        const currentIndex = languageOptions.findIndex(opt => opt.code === currentLanguage);
        const nextIndex = (currentIndex + 1) % languageOptions.length;
        const newLangCode = languageOptions[nextIndex].code;
        
        i18n.changeLanguage(newLangCode);
        setCurrentLanguage(newLangCode);
    };

    return (
        <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, // Show only on mobile
            alignItems: 'center', 
            mr: 1 // Margin right to separate from the notification icon
        }}>
             <ButtonBase sx={{ borderRadius: '12px' }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.secondary.dark,
                            color: theme.palette.secondary.light
                        }
                    }}
                    onClick={handleMobileToggle}
                    color="inherit"
                >
                    {currentLanguage.toUpperCase()}
                </Avatar>
            </ButtonBase>
        </Box>
    )
}

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />
            {/* The gap spacer before notification section */}
            <Box sx={{ flexGrow: 1 }} /> 
            
            {/* Desktop Language Selector */}
            <LanguageSelector /> 

            {/* Mobile Language Button */}
            <MobileLanguageButton />

            {/* notification & profile */}
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;