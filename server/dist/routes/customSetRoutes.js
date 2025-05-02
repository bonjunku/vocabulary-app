"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customSetController_1 = require("../controllers/customSetController");
const router = (0, express_1.Router)();
// Get all custom sets for a user
router.get('/:userId', customSetController_1.getCustomSets);
// Create a new custom set
router.post('/', customSetController_1.createCustomSet);
// Update a custom set
router.put('/:id', customSetController_1.updateCustomSet);
// Delete a custom set
router.delete('/:id', customSetController_1.deleteCustomSet);
exports.default = router;
