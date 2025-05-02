"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learningRecordController_1 = require("../controllers/learningRecordController");
const router = (0, express_1.Router)();
// Get learning record for a specific word and user
router.get('/:userId/:wordId', learningRecordController_1.getLearningRecord);
// Update learning record
router.post('/:userId/:wordId', learningRecordController_1.updateLearningRecord);
// Get due words for a user
router.get('/:userId/due', learningRecordController_1.getDueWords);
exports.default = router;
