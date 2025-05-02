"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wordController_1 = require("../controllers/wordController");
const router = (0, express_1.Router)();
// Get a specific word
router.get('/:id', wordController_1.getWord);
// Get a random word
router.get('/random', wordController_1.getRandomWord);
// Create a new word
router.post('/', wordController_1.createWord);
// Update a word
router.put('/:id', wordController_1.updateWord);
// Delete a word
router.delete('/:id', wordController_1.deleteWord);
exports.default = router;
