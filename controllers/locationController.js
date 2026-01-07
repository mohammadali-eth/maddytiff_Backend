const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a location
// @route   POST /api/locations
// @access  Private
const addLocation = async (req, res) => {
    try {
        const { name, logoName } = req.body;

        const location = new Location({
            name,
            logoName
        });

        const createdLocation = await location.save();
        res.status(201).json(createdLocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLocations, addLocation };
