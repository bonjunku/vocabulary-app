"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomSet = exports.updateCustomSet = exports.createCustomSet = exports.getCustomSets = void 0;
const CustomSet_1 = __importDefault(require("../models/CustomSet"));
const getCustomSets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customSets = yield CustomSet_1.default.find({ user: req.params.userId });
        res.json(customSets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching custom sets', error });
    }
});
exports.getCustomSets = getCustomSets;
const createCustomSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, words, user } = req.body;
        const customSet = yield CustomSet_1.default.create({
            name,
            description,
            words,
            user
        });
        res.status(201).json(customSet);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating custom set', error });
    }
});
exports.createCustomSet = createCustomSet;
const updateCustomSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customSet = yield CustomSet_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customSet) {
            return res.status(404).json({ message: 'Custom set not found' });
        }
        res.json(customSet);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating custom set', error });
    }
});
exports.updateCustomSet = updateCustomSet;
const deleteCustomSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customSet = yield CustomSet_1.default.findById(req.params.id);
        if (!customSet) {
            return res.status(404).json({ message: 'Custom set not found' });
        }
        yield customSet.deleteOne();
        res.json({ message: 'Custom set deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting custom set', error });
    }
});
exports.deleteCustomSet = deleteCustomSet;
