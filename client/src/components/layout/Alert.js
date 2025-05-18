import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';

const Alert = ({ alerts }) => {
  if (alerts !== null && alerts.length > 0) {
    return alerts.map(alert => (
      <Snackbar 
        key={alert.id} 
        open={true} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          severity={alert.alertType} 
          sx={{ width: '100%' }}
        >
          {alert.msg}
        </MuiAlert>
      </Snackbar>
    ));
  }

  return null;
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert); 