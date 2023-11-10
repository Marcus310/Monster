// Importando as bibliotecas necessárias
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Criando uma instância do Express
const app = express();

// Definindo a porta em que o servidor será executado
const port = 3001;

// Habilitando o CORS para permitir solicitações de qualquer origem
app.use(cors({
  origin: "*"
}));

// Configurando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'donodamonster',
  password: 'senhadamonster',
  database: 'dbbmonster'
});

// Estabelecendo a conexão com o banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.message);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados');
  }
});

// Configurando o uso do bodyParser para analisar dados JSON nas solicitações
app.use(bodyParser.json());

// Definindo uma rota para o endpoint de login
app.post('/login', (req, res) => {
  // Obtendo as informações de usuário e senha do corpo da solicitação
  const { username, password } = req.body;

  // Consulta SQL para verificar as credenciais do usuário no banco de dados
  const query = 'SELECT * FROM usuarios WHERE username = ? AND senha = ?';
  
  // Executando a consulta no banco de dados
  db.query(query, [username, password], (err, results) => {
    if (err) {
      // Em caso de erro, registrando no console e retornando um status 500 (Erro interno do servidor)
      console.error(err);
      res.status(500).send('Erro interno do servidor');
    } else if (results.length === 1) {
      // Se a consulta retornar um resultado, significa que o login é bem-sucedido
      res.status(200).send('Login bem-sucedido!');
    } else {
      // Se não houver resultados, as credenciais são incorretas
      res.status(401).send('Nome de usuário ou senha incorretos');
    }
  });
});

// Iniciando o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
