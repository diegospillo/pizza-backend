const connection = require("../connectionDB");

function Create(req, res){
  const pool = connection();

  pool.query("CREATE TABLE Pool (id VARCHAR(100) PRIMARY KEY, nome VARCHAR(20) NOT NULL, cognome VARCHAR(20) NOT NULL, email VARCHAR(50) NOT NULL)", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Tabella creata con successo!");
      res.send("Tabella creata con successo!");
      pool.end();
    }
  });
}


function Get(req, res) {
  const pool = connection();
  pool.query("SELECT * FROM Pool;", (err, result) => {
    if (err) {
      console.error(err);
      res.send([]);
    } else {
      console.log("Dati letti con successo!");
      res.send(result.rows);
    }
    pool.end();
  });
}

async function Insert(req, res) {
  const pool = connection();
  const client = {
    id: req.query.id,
    nome: req.query.nome,
    cognome: req.query.cognome,
    email: req.query.email
}

const nome_client = client.nome.replace(/'/g, "''");
const cognome_client = client.cognome.replace(/'/g, "''");
const email_client = client.email.replace(/'/g, "''");

const query = "INSERT INTO Pool (id, Nome, Cognome, Email) VALUES ($1::text, $2::text, $3::text, $4::text);";

pool.query(query, [client.id, nome_client, cognome_client, email_client], (err, result) => {
      if (err) {
        console.error(err);
        res.json({ stato: false })
        pool.end();
      } else {
        console.log("Dati inseriti con successo!");
        res.json({ stato: true });
        pool.end();
      }
    }
  );
}

function Drop(req, res) {
  const pool = connection();
  const id = req.query.id;
  pool.query("DELETE FROM Pool WHERE id = $1::text;", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.json({ stato: false })
    } else {
      res.send("Utente eliminato con successo!");
      pool.end();
    }
  });
}

function Alter(req, res){
  const pool = connection();

pool.query(
  "ALTER TABLE Pool ALTER COLUMN id TYPE varchar(50);",
  (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send("Dati cambiati con successo!");
      pool.end();
    }
  }
);
}

function Truncate(req, res) {
  const pool = connection();

  pool.query("TRUNCATE Pool", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send("Dati tabella eliminata con successo!");
      pool.end();
    }
  });
}

function Check_id(req, res){
  const pool = connection();
  const id = req.query.id;
  pool.query("SELECT * FROM Pool WHERE id = $1::text;", [id], (err, result) => {
    if (err) {
      console.error(err);
    } else {
      if(result.rows.length>0){
        console.log("ID registrato");
        res.json({ stato: true });
      }
      else{
        console.log("ID non registrato");
        res.json({ stato: false })
      }
      pool.end();
      }
  });
}


module.exports = {
  create: Create,
  get: Get,
  alter: Alter,
  insert: Insert,
  drop: Drop,
  truncate: Truncate,
  check_id: Check_id
};
