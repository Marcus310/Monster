// Importando as bibliotecas necessárias
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

// Criando uma instância do Express
const app = express();
const port = 3003;
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
app.use(bodyParser.urlencoded({ extended: true }));

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

// Rota para adicionar um produto
app.post('/adicionarProduto', upload.single('imagem'), (req, res) => {
  try {
      const { categoria, nome, armazenamento, cor, preco } = req.body;
      const imagemPath = req.file ? req.file.path : null;

      if (!categoria || !nome || !armazenamento || !cor || !preco) {
          throw new Error('Todos os campos são obrigatórios.');
      }

      const query = 'INSERT INTO produtos (categoria, nome, armazenamento, cor, imagem, preco) VALUES (?, ?, ?, ?, ?, ?)';

      db.query(query, [categoria, nome, armazenamento, cor, imagemPath, preco], (err, results) => {
          if (err) {
              console.error('Erro ao adicionar produto:', err);
              res.status(500).send('Erro interno do servidor');
          } else {
              console.log('Produto adicionado ao banco de dados');
              res.status(200).json({ message: 'Produto Adicionado com sucesso!' });
          }
      });
  } catch (error) {
      console.error('Erro no servidor:', error.message);
      res.status(500).send('Erro interno do servidor');
  }
});

// Rota para obter todos os produtos
app.get('/obterProdutos', (req, res) => {
  // Consulta SQL para obter todos os produtos do banco de dados
  const query = 'SELECT * FROM produtos';

  // Executando a consulta no banco de dados
  db.query(query, (err, results) => {
    if (err) {
      // Em caso de erro, registrando no console e retornando um status 500 (Erro interno do servidor)
      console.error(err);
      res.status(500).send('Erro interno do servidor');
    } else {
      // Se a consulta for bem-sucedida, retornar os resultados em formato JSON
      res.json(results);
    }
  });
});

// Rota para excluir um produto
app.delete('/excluirProduto/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM produtos WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log('Produto excluído do banco de dados');
      res.status(200).json({ message: 'Produto excluído com sucesso!' });
    }
  });
});

// Iniciando o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
