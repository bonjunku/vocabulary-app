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
exports.deleteWord = exports.updateWord = exports.createWord = exports.getRandomWord = exports.getWord = void 0;
const Word_1 = __importDefault(require("../models/Word"));
const Example_1 = __importDefault(require("../models/Example"));
const Video_1 = __importDefault(require("../models/Video"));
const getWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = yield Word_1.default.findById(req.params.id)
            .populate('examples')
            .populate('videos');
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        res.json(word);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching word', error });
    }
});
exports.getWord = getWord;
const getRandomWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Word_1.default.countDocuments();
        const random = Math.floor(Math.random() * count);
        const word = yield Word_1.default.findOne().skip(random)
            .populate('examples')
            .populate('videos');
        res.json(word);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching random word', error });
    }
});
exports.getRandomWord = getRandomWord;
const createWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { word, meaning, pronunciation, partOfSpeech, level, examples, videos } = req.body;
        // Create examples
        const exampleDocs = yield Example_1.default.create(examples);
        const exampleIds = Array.isArray(exampleDocs)
            ? exampleDocs.map(doc => doc._id)
            : [exampleDocs._id];
        // Create videos
        const videoDocs = yield Video_1.default.create(videos);
        const videoIds = Array.isArray(videoDocs)
            ? videoDocs.map(doc => doc._id)
            : [videoDocs._id];
        // Create word
        const newWord = yield Word_1.default.create({
            word,
            meaning,
            pronunciation,
            partOfSpeech,
            level,
            examples: exampleIds,
            videos: videoIds
        });
        res.status(201).json(newWord);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating word', error });
    }
});
exports.createWord = createWord;
const updateWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = yield Word_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('examples').populate('videos');
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        res.json(word);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating word', error });
    }
});
exports.updateWord = updateWord;
const deleteWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = yield Word_1.default.findById(req.params.id);
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        // Delete associated examples and videos
        yield Example_1.default.deleteMany({ _id: { $in: word.examples } });
        yield Video_1.default.deleteMany({ _id: { $in: word.videos } });
        yield word.deleteOne();
        res.json({ message: 'Word deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting word', error });
    }
});
exports.deleteWord = deleteWord;
