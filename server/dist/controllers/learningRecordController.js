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
exports.getDueWords = exports.updateLearningRecord = exports.getLearningRecord = void 0;
const LearningRecord_1 = __importDefault(require("../models/LearningRecord"));
const dist_1 = require("../../../shared/dist");
const fsrs = new dist_1.FSRS(dist_1.DEFAULT_CONFIG);
const getLearningRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield LearningRecord_1.default.findOne({
            user: req.params.userId,
            word: req.params.wordId
        });
        if (!record) {
            return res.status(404).json({ message: 'Learning record not found' });
        }
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching learning record', error });
    }
});
exports.getLearningRecord = getLearningRecord;
const updateLearningRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating } = req.body;
        const reviewDate = new Date();
        // Get current learning record
        let record = yield LearningRecord_1.default.findOne({
            user: req.params.userId,
            word: req.params.wordId
        });
        // Convert to FSRS state if record exists
        const currentState = record ? {
            stability: record.ease,
            difficulty: 0, // Not stored in our model
            elapsedDays: Math.floor((reviewDate.getTime() - record.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)),
            scheduledDays: record.interval,
            reps: record.repetitions,
            lapses: 0, // Not stored in our model
            lastReview: record.lastReviewDate,
            nextReview: record.nextReviewDate
        } : null;
        // Update with FSRS
        const result = fsrs.review(currentState, rating, reviewDate);
        // Update or create learning record
        record = yield LearningRecord_1.default.findOneAndUpdate({
            user: req.params.userId,
            word: req.params.wordId
        }, {
            ease: result.state.stability,
            interval: result.state.scheduledDays,
            repetitions: result.state.reps,
            lastReviewDate: result.state.lastReview,
            nextReviewDate: result.state.nextReview
        }, { upsert: true, new: true });
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating learning record', error });
    }
});
exports.updateLearningRecord = updateLearningRecord;
const getDueWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield LearningRecord_1.default.find({
            user: req.params.userId,
            nextReviewDate: { $lte: new Date() }
        }).populate('word');
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching due words', error });
    }
});
exports.getDueWords = getDueWords;
