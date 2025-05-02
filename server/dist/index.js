"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
(0, database_1.default)();
// Routes
const wordRoutes_1 = __importDefault(require("./routes/wordRoutes"));
const learningRecordRoutes_1 = __importDefault(require("./routes/learningRecordRoutes"));
const customSetRoutes_1 = __importDefault(require("./routes/customSetRoutes"));
app.use('/api/words', wordRoutes_1.default);
app.use('/api/learning-records', learningRecordRoutes_1.default);
app.use('/api/custom-sets', customSetRoutes_1.default);
// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Vocabulary App API' });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
