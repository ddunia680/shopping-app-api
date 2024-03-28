"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png',
        file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Content-Type Authorization',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, multer_1.default)({ fileFilter: fileFilter }).array('photos', 12));
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
mongoose_1.default.connect(process.env.MONGO_DB_URI)
    .then(response => {
    const server = app.listen(port, () => {
        console.log(`now listening on port ${port}`);
    });
});
