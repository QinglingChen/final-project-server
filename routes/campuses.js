// /*==================================================
// /routes/campuses.js

// It defines all the campuses-related routes.
// ==================================================*/

// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Campus, Student } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for concise coding (fewer lines of code)
const ash = require('express-async-handler');

/* GET ALL CAMPUSES */
router.get('/', ash(async (req, res) => {
  let campuses = await Campus.findAll({ include: [Student] });  // Get all campuses and their associated students
  res.status(200).json(campuses);  // Status code 200 OK - request succeeded
}));

/* GET CAMPUS BY ID */
router.get('/:id', ash(async (req, res) => {
  let campus = await Campus.findByPk(req.params.id, { include: [Student] });  // Get the campus and its associated students
  if (campus) {
    res.status(200).json(campus);  // Status code 200 OK - request succeeded
  } else {
    res.status(404).json({ error: "Campus not found" });  // If campus not found, return error
  }
}));

/* DELETE CAMPUS */
router.delete('/:id', ash(async (req, res) => {
  // Find the campus to delete
  let campus = await Campus.findByPk(req.params.id);

  if (!campus) {
    return res.status(404).json({ error: "Campus not found" });  // If the campus is not found, return an error
  }

  try {
    // Delete the campus from the database
    await Campus.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ message: "Campus deleted successfully!" });  // Return a success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete campus" });  // Return error message in case of failure
  }
}));

/* ADD NEW CAMPUS */
router.post('/', ash(async (req, res) => {
  const { name, address, description, imageUrl } = req.body;  // Extract the campus data from the request body

  // Basic validation for required fields
  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required" });  // Return error if required fields are missing
  }

  try {
    // Create a new campus using the provided data
    const newCampus = await Campus.create({
      name,
      address,
      description: description || null,  // Use null if description is not provided
      imageUrl: imageUrl || 'default-image.jpg',  // Default image if no image URL is provided
    });

    // Return the newly created campus with status code 201 Created
    res.status(201).json(newCampus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create campus' });  // Handle errors
  }
}));

/* EDIT CAMPUS */
router.put('/:id', ash(async (req, res) => {
  const { name, address, description, imageUrl } = req.body;

  // Validate the incoming data
  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required" });
  }

  try {
    // Find the campus to update
    let campus = await Campus.findByPk(req.params.id);
    if (!campus) {
      return res.status(404).json({ error: "Campus not found" });
    }

    // Update the campus with new data
    campus.name = name || campus.name;
    campus.address = address || campus.address;
    campus.description = description || campus.description;
    campus.imageUrl = imageUrl || campus.imageUrl;

    // Save the updated campus
    await campus.save();

    console.log("Updated campus:", campus);  // Log updated campus

    // Return the updated campus
    res.status(200).json(campus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update campus' });  // Handle errors
  }
}));


// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;
