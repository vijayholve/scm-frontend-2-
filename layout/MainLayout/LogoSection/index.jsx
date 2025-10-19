/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import config from 'config';
//import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //
import { useTranslation } from 'react-i18next'; // <-- add

const LogoSection = () => {
  const { t } = useTranslation('mainlayout'); // <-- add
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
    >
      {/* <Logo /> // TODO: will place our logo here */}
      <div style={{ marginLeft: '60px' }}><h2>{t('title')}</h2></div>
    </ButtonBase>
  );
};

export default LogoSection;
