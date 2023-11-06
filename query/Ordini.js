const connection = require("../connectionDB");

function Create(req, res) {
    const pool = connection();
  
    pool.query("CREATE TABLE Ordini (id SERIAL PRIMARY KEY, id_Studente VARCHAR(100) NOT NULL, id_Pizza INTEGER NOT NULL, data TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.send("Tabella creata con successo!");
        }
      });
  }

function Get_All(req, res) {
  const pool = connection();
  
  pool.query("SELECT * FROM Ordini;", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Dati letti con successo!");
      //console.log(result.rows);
      res.send(result.rows);
    }
  });
}

function Get_ordini_studente(req, res) {
  const pool = connection();
  const id = req.query.id;
  pool.query(`SELECT * FROM Ordini WHERE id_studente = '${id}';`, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Dati letti con successo!");
      const ordini = result.rows;
      const id_pizze = ordini.map(ordine => ordine.id_pizza);
      pool.query(`SELECT * FROM Pizze WHERE id IN (${id_pizze});`, (err, result1) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Dati letti con successo!");
          const orders = result1.rows
          const newOrders = orders.map((order, index) => {
            return {
              id: id_pizze[index],
              ...order,
            };
          });
          res.send(newOrders);
        }
      });
    }
  });
}

function Get_ordini_classe(req, res) {
  const pool = connection();
  const id = req.query.id;
  pool.query(`SELECT * FROM Studenti WHERE id = '${id}';`, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Dati letti con successo!");
      const studente = result.rows;
      pool.query(`SELECT * FROM Studenti WHERE id_classe=${studente[0].id_classe};`, (err, result1) => {
        if (err) {
          console.error(err);
        } else {//
          const studenti_classe = result1.rows;
          const id_studenti_classe = studenti_classe.map(studente => {
            return ("'"+studente.id+"'");
          });
          const strg_stud = String(id_studenti_classe);
          console.log(strg_stud);
          console.log("Dati letti con successo!");//VEDERE ORDINI CLASSE!!!!!!!!!!!
          pool.query(`SELECT * FROM Ordini WHERE id_studente IN (${strg_stud})`, (err, result2) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Dati letti con successo!");
              const ordini_classe = result2.rows;
              const id_pizze = ordini_classe.map(ordine => ordine.id_pizza);
              pool.query(`SELECT * FROM Pizze WHERE id IN (${id_pizze});`, (err, result3) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log("Dati letti con successo!");
                  const orders = result3.rows;
                  const newOrders = orders.map((order, index) => {
                    return {
                      id: id_pizze[index],
                      nome: ordini_classe[index].id_studente,
                      pizza: order.nome,
                      prezzo: order.prezzo
                    };
                  });
                  res.send(newOrders);
                }
              });
            }
          });
        }
      });
    }
  });
}

function Insert(req, res) {
  const pool = connection();
  const id_studente = req.query.id_studente;
  const id_pizza = req.query.id_pizza;
  pool.query(
    `INSERT INTO Ordini (id_Studente, id_Pizza) VALUES ('${id_studente}', ${id_pizza});`,
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.send("Dati inseriti con successo!");
      }
    }
  );
}

function Alter(req, res){
    const pool = connection();

  pool.query(
    "ALTER TABLE Pizze ALTER COLUMN prezzo TYPE numeric;",
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.end("Dati cambiati con successo!");
      }
    }
  );
}

function Drop(req, res) {
  const pool = connection();

  pool.query("DELETE FROM Studenti WHERE id > 18;", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send("Righe eliminate con successo!");
    }
  });
}

module.exports = {
  create: Create,
  alter: Alter,
  get_all: Get_All,
  get_ordini_studente: Get_ordini_studente,
  get_ordini_classe: Get_ordini_classe,
  insert: Insert,
  drop: Drop
};
