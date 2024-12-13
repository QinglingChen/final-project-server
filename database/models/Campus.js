/*==================================================
/database/models/Campus.js

It defines the campus model for the database.
==================================================*/
const Sequelize = require('sequelize');  // Import Sequelize
const db = require('../db');  // Import Sequelize database instance called "db"

// Define the campus model
const Campus = db.define("campus", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  address: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.STRING,
  },

  //**imageUrl - with a default value, allow null/empty
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,  // Image URL can be null
    defaultValue: 'default-image.jpg'  // Set a default image URL
  }

});

// Define the association: A campus has many students
Campus.hasMany(Student, {
  foreignKey: 'campusId'  // Foreign key to link students to campuses
});

// Export the campus model
module.exports = Campus;