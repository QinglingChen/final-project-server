/*==================================================
/routes/students.js

It defines all the students-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');

/* GET ALL STUDENTS: async/await using "try-catch" */
// router.get('/', async (req, res, next) => {
//   try {
//     let students = await Student.findAll({include: [Campus]});
//     res.status(200).json(students);
//   } 
//   catch(err) {
//     next(err);
//   }
// });

/* GET ALL STUDENTS: async/await using express-async-handler (ash) */
// Automatically catches any error and sends to Routing Error-Handling Middleware (app.js)
// It is the same as using "try-catch" and calling next(error)
router.get('/', ash(async(req, res) => {
  let students = await Student.findAll({include: [Campus]});
  res.status(200).json(students);  // Status code 200 OK - request succeeded
}));

/* GET STUDENT BY ID */
router.get('/:id', ash(async(req, res) => {
  // Find student by Primary Key
  let student = await Student.findByPk(req.params.id, {include: [Campus]});  // Get the student and its associated campus
  //res.status(200).json(student);  // Status code 200 OK - request succeeded
  if (student) {
    res.status(200).json(student);  // Send the student as a JSON response
  } else {
    res.status(404).json({ error: "Student not found" });  // Return an error if student not found
  }
}));

/* ADD NEW STUDENT */
router.post('/', function(req, res, next) {
  Student.create(req.body)
    .then(createdStudent => res.status(200).json(createdStudent))
    .catch(err => next(err));
});

/* DELETE STUDENT */
router.delete('/:id', function(req, res, next) {
  Student.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.status(200).json("Deleted a student!"))
    .catch(err => next(err));
});

/* EDIT STUDENT */
router.put('/:id', ash(async (req, res) => {
  const { firstname, lastname, email, imageUrl, gpa, campusId } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !email) {
    return res.status(400).json({ error: "First name, last name, and email are required" });
  }

  try {
    // Find the student to update
    let student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the student with the provided data
    student.firstname = firstname || student.firstname;
    student.lastname = lastname || student.lastname;
    student.email = email || student.email;
    student.imageUrl = imageUrl || student.imageUrl;
    student.gpa = gpa || student.gpa;
    student.campusId = campusId || student.campusId;

    // Save the updated student
    await student.save();

    // Return the updated student
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });  // Handle errors
  }
}));

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;