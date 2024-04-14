const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://prilimarj:123@cluster0.vpyobnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexão com o MongoDB estabelecida'))
.catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/usuarios/cadastrar', async (req, res) => {
    try {
        console.log('Dados do formulário:', req.body);
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/cadastro');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/usuarios/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários: ' + error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).send('Usuário deletado com sucesso.');
        } else {
            res.status(404).send('Usuário não encontrado.');
        }
    } catch (error) {
        res.status(500).send('Erro ao deletar usuário: ' + error.message);
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`O servidor está funcionando na porta: ${PORT}`);
});