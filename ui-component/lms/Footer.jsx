import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  School,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useLMSTheme } from '../../contexts/LMSThemeContext';

const Footer = () => {
  const theme = useTheme();
  const { isDarkMode } = useLMSTheme();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Courses', href: '/lms/courses' },
        { label: 'About Us', href: '/lms/about' },
        { label: 'Pricing', href: '/lms/pricing' },
        { label: 'Contact', href: '/lms/contact' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'System Status', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <LinkedIn />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram />, href: '#', label: 'Instagram' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 32 }} />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary
                  }}
                >
                  KoolERP
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6 
                }}
              >
                Empowering learners worldwide with cutting-edge education technology and expert-led courses.
              </Typography>
              
              {/* Contact Info */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    contact@koolerp.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
+91 91588 06129
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Pune, India
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Social Media */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    href={social.href}
                    size="small"
                    sx={{
                      color: theme.palette.text.secondary,
                      p: 0,
                      mr: 1,
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {social.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            © 2024 KoolERP. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Made with ❤️ for learners worldwide
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;