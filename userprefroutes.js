const express = require('express');
const mongoose = require('mongoose');
const UserPref = require('./schema'); 
const router = express.Router();

// Create a new user preference
router.post('/userPrefs/create', async (req, res) => {
    try {
        const userPref = new UserPref(req.body);
        await userPref.save();
        res.status(201).send(userPref);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all user preferences
router.get('/userPrefs/getAll', async (req, res) => {
    try {
        const userPrefs = await UserPref.find();
        res.status(200).send(userPrefs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a single user preference by ID
router.get('/userPrefs/get/:id', async (req, res) => {
    try {
        const userPref = await UserPref.findById(req.params.id);
        if (!userPref) {
            return res.status(404).send();
        }
        res.status(200).send(userPref);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update a specific key-value  preferences by user ID and key
router.patch('/userPrefs/update/:id/preferences', async (req, res) => {
    const updates = req.body.keyValues; // 

    if (!Array.isArray(updates)) {
        return res.status(400).send({ error: 'Invalid update parameters!' });
    }

    try {
        const userPref = await UserPref.findById(req.params.id);
        if (!userPref) {
            return res.status(404).send({ error: 'UserPref not found!' });
        }

        // for loop for updating each key
        for (let i = 0; i < updates.length; i++) {
            const { key, value, Type } = updates[i];

            const prefIndex = userPref.preferences.keyValues.findIndex(pref => pref.key === key);
            if (prefIndex !== -1) {
                // updating the key
                userPref.preferences.keyValues[prefIndex].value = value;
                userPref.preferences.keyValues[prefIndex].Type = Type;
            }
            else
            {
                userPref.preferences.keyValues.push({key,value})
            }
        }

        await userPref.save();
        res.status(200).send(userPref);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a  single preference of a UserPreference by ID
router.delete('/userPrefs/delete/:userId/preferences/:key', async (req, res) => {
    const { userId, key } = req.params;

    try {
        const userPref = await UserPref.findById(userId);
        if (!userPref) {
            return res.status(404).send({ error: 'UserPref not found!' });
        }

        const prefIndex = userPref.preferences.keyValues.findIndex(pref => pref.key === key);
        if (prefIndex === -1) {
            return res.status(404).send({ error: 'Preference key not found!' });
        }
        

        userPref.preferences.keyValues.splice(prefIndex, 1); // Remove the specific key-value pair

        await userPref.save();
        res.status(200).send(userPref);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;
