//DESAFIO 01 - Conceitos do NodeJS
//yarn add express
//yarn add nodemon -D
//yarn dev
const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Osvaldo", "email": "mvidoy@hotmail.com" }

// CRUD - Create, Read, Update, Delete

const projects = [
  {
    id: "0",
    title: "Novo projeto1",
    tasks: ["projeto1 - Nova tarefa1", "projeto1 - Nova tarefa2"]
  },
  {
    id: "1",
    title: "Novo projeto2",
    tasks: ["projeto2 - Nova tarefa1", "projeto2 - Nova tarefa2"]
  }
];
let numberOfRequests = 0;

//Middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  req.id = id;
  const project = projects.find(projeto => projeto.id === id);
  if (!project) {
    return res.status(404).json({ message: "Projeto não foi encontrado" });
  }
  next();
}

//Middleware global chamado em todas requisições que imprime (console.log) uma contagem de quantas requisições foram feitas na aplicação até então;
function printNumberOfRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Quantidade de requisições: ${numberOfRequests}`);
  next();
}

server.use(printNumberOfRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects/", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { task } = req.body;
  const project = {
    id: id,
    title: title,
    task: task
  };

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id] = { ...projects[id], title };

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req;
  const index = projects.findIndex(projeto => projeto.id === id);
  projects.splice(index, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req;
  const index = projects.findIndex(projeto => projeto.id === id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
});

server.listen("3000");
