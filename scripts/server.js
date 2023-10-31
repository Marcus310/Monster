const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3003;
app.use(cors({
  origin: "*"
}))

const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'donodamonster',
  password: 'senhadamonster',
  database: 'dbbmonster'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.message);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados');
  }
});

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE username = ? AND senha = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
    } else if (results.length === 1) {
      res.status(200).send('Login bem-sucedido!');
    } else {
      res.status(401).send('Nome de usuário ou senha incorretos');
    }
  })
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
