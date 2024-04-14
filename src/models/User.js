const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    senha: String,
});

module.exports = mongoose.model("User", userSchema);