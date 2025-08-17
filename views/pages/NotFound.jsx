import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Paper, SvgIcon, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// New, stylized 404 SVG component using Material-UI theme colors
const StylizedNotFoundIllustration = (props) => {
    const theme = useTheme();
    return (
        <SvgIcon viewBox="0 0 400 150" {...props}>
            <defs>
                <linearGradient id="cool-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: theme.palette.primary.main, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: theme.palette.primary.dark, stopOpacity: 1 }} />
                </linearGradient>
                <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                </filter>
            </defs>

            {/* Using a modern, clean font style for the numbers */}
            <text 
                x="50%" 
                y="50%" 
                dy=".35em" 
                textAnchor="middle" 
                fontFamily="'Roboto', sans-serif" 
                fontSize="120" 
                fontWeight="900" 
                fill="url(#cool-blue-gradient)"
                style={{ filter: 'url(#drop-shadow)' }}
            >
                404
            </text>
        </SvgIcon>
    );
};


const NotFound = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // If the countdown is over, navigate back to the previous page.
        if (countdown <= 0) {
            navigate(-1); // This navigates to the previous page in history
            return;
        }

        // Set up a timer to decrement the countdown every second.
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Clean up the timer when the component unmounts or countdown changes.
        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 88px)',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light} 100%)`,
                p: 3
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        textAlign: 'center',
                        borderRadius: '20px',
                        maxWidth: '600px',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                    >
                       <StylizedNotFoundIllustration sx={{ width: '100%', height: 'auto', maxWidth: 400, mb: 3 }} />
                    </motion.div>

                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.dark' }}>
                        Page Not Found
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Sorry, we couldn't find the page you're looking for. Let's get you back to safety.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(-1)}
                        sx={{
                            borderRadius: '50px',
                            py: 1.5,
                            px: 5,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}55`
                        }}
                    >
                        Go Back
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                        Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default NotFound;