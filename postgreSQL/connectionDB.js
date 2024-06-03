const { Pool } = require("pg");

function connection() {
    const pool = new Pool({
      user: "spillo",
      host: "dpg-cpevoo63e1ms73ecvtng-a",
      database: "pizza_76wm_9gwo",
      password: "0paFkV7wE7LuGNLOlWqx0ODD1qZLyx2r",
      port: 5432,
    });
    return pool;
  }

module.exports = connection;
