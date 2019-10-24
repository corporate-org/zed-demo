const db = require("../db");

console.log("[init_db.js] Initializing database");
console.log(`[init_db.js] DATABASE_USER="${process.env.DATABASE_USER}"`);
console.log(`[init_db.js] DATABASE_HOST="${process.env.DATABASE_HOST}"`);
console.log(`[init_db.js] DATABASE_NAME="${process.env.DATABASE_NAME}"`);
console.log(`[init_db.js] DATABASE_PORT="${process.env.DATABASE_PORT}"`);

async function createDb  () {
  await db.query("SET timezone = 'utc'");
  await db.query(`CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT NULL,
    created_at  TIMESTAMP)`);
}

function delay(timeout) {
   return new Promise((resolve) => {
       setTimeout(resolve, timeout);
   });
}

function dbBackoff() {

  function handleError(error, i) {
    if (error.errno === "ECONNREFUSED" && i < 6) {
      i++;
      console.error(`Cannot connect to DB, backing off and trying again in ${2**i} seconds`);
      return delay((2**i)*1000).then(() => {
        return createDb().catch((err) => {handleError(err, i)});
      });
    }
    else {
      console.error(error);
      throw error;
    }
  }

  return createDb().catch((err) => {handleError(err, 0)});
}

dbBackoff()
  .then(() => console.log("[init_db.js] Initializing complete."))
  .catch(() => console.log("[init_db.js] Initializing unsuccessfull."));
