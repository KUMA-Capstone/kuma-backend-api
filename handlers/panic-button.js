const sql = require('../config/database');
const { exec } = require('child_process');

const panicAlert = (req, res) => {
    const query = `SELECT emergency_contact_number FROM emergency_contact WHERE id = 1`

    sql.query(query, (error, results) => {
        if (error) {
          console.error('Error retrieving emergency contact number:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            const emergencyContactNumber = results[0].emergency_contact_number;
    
            // To initiate the emergency call
            const command = `tel:${emergencyContactNumber}`;
    
            // Execute to initiate the emergency call
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error('Error initiating emergency call:', error);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log('Emergency call initiated');
                res.json({ message: 'Emergency call initiated' });
              }
            });
          } else {
            console.error('Emergency contact number not found');
            res.status(404).json({ error: 'Emergency contact number not found' });
          }
        }
      });
    };
    
module.exports = panicAlert;

