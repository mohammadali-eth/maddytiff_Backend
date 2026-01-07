const TiffinRecord = require('../models/TiffinRecord');

// @desc    Add a tiffin record
// @route   POST /api/tiffins
// @access  Private
const addTiffin = async (req, res) => {
    try {
        const {
            customerName,
            tiffinType,
            numberOfTiffins,
            pricePerTiffin,
            date,
            notes
        } = req.body;

        const totalAmount = numberOfTiffins * pricePerTiffin;

        const record = new TiffinRecord({
            customerName,
            tiffinType,
            numberOfTiffins,
            pricePerTiffin,
            totalAmount,
            date,
            notes
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get tiffin records (Today, Date, or Range)
// @route   GET /api/tiffins
// @access  Private
const getTiffins = async (req, res) => {
    try {
        const { date, startDate, endDate } = req.query;
        let query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.date = { $gte: startOfDay, $lte: endOfDay };
        } else if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            query.date = { $gte: start, $lte: end };
        } else {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const records = await TiffinRecord.find(query).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/tiffins/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        // Today Stats
        const todayRecords = await TiffinRecord.find({
            date: { $gte: startOfToday, $lte: endOfToday }
        });

        const todayTiffins = todayRecords.reduce((acc, curr) => acc + curr.numberOfTiffins, 0);
        const todayAmount = todayRecords.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Month Stats
        const monthRecords = await TiffinRecord.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const monthTiffins = monthRecords.reduce((acc, curr) => acc + curr.numberOfTiffins, 0);
        const monthAmount = monthRecords.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Recent Activity (Last 5)
        const recentRecords = await TiffinRecord.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            today: {
                tiffins: todayTiffins,
                amount: todayAmount
            },
            month: {
                tiffins: monthTiffins,
                amount: monthAmount
            },
            recent: recentRecords
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a tiffin record
// @route   PUT /api/tiffins/:id
// @access  Private
const updateTiffin = async (req, res) => {
    try {
        const {
            customerName,
            tiffinType,
            numberOfTiffins,
            pricePerTiffin,
            date,
            notes
        } = req.body;

        const record = await TiffinRecord.findById(req.params.id);

        if (record) {
            record.customerName = customerName || record.customerName;
            record.tiffinType = tiffinType || record.tiffinType;
            record.numberOfTiffins = numberOfTiffins || record.numberOfTiffins;
            record.pricePerTiffin = pricePerTiffin || record.pricePerTiffin;
            record.date = date || record.date;
            record.notes = notes || record.notes;

            // Recalculate total if key fields changed
            record.totalAmount = record.numberOfTiffins * record.pricePerTiffin;

            const updatedRecord = await record.save();
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a tiffin record
// @route   DELETE /api/tiffins/:id
// @access  Private
const deleteTiffin = async (req, res) => {
    try {
        const record = await TiffinRecord.findById(req.params.id);

        if (record) {
            await record.deleteOne();
            res.json({ message: 'Record removed' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTiffin, getTiffins, getDashboardStats, updateTiffin, deleteTiffin };
