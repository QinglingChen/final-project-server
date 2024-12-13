/*==================================================
/database/models/Student.js

It defines the student model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const db = require('../db');  // Import Sequelize database instance called "db"

const Student = db.define("student", {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },

  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },

  //new*3
  email: {
    type: Sequelize.STRING,
    allowNull: false,  // Email cannot be null
    validate: {
      notEmpty: true,  // Email cannot be empty
      isEmail: true    // Ensure the email is valid
    }
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,  // Image URL can be null
    defaultValue: 'default-image.jpg'  // Default image if no image URL is provided
  },

  gpa: {
    type: Sequelize.DECIMAL(3, 2),  // Decimal with 3 digits, 2 of which are after the decimal point
    allowNull: true,  // GPA can be null
    validate: {
      min: 0.0,  // Minimum GPA of 0.0
      max: 4.0   // Maximum GPA of 4.0
    }
  }

});

// Define the association: A student belongs to one campus
Student.belongsTo(Campus, {
  foreignKey: 'campusId'  // Foreign key to associate students with campuses
});

// Export the student model
module.exports = Student;