const Router = require("express-promise-router");
const db = require("../db");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

function toProduct(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    postedTime: row.created_at
  };
}

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT id, title, content, created_at FROM products");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(rows.map(toProduct));
});

router.get("/:id", async (req, res) => {
  const { rows } = await db.query("SELECT id, title, content, created_at FROM products WHERE id = $1", [req.params.id]);
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (0 === rows.length) {
    res.status(404).send(`Product "${req.params.id}" not found.`);
  }
  else {
    res.json(toProduct(rows[0]));
  }
});

router.post("/", async (req, res) => {
  const { rows } = await db.query(`
INSERT INTO products (title, content, created_at)
VALUES ($1, $2, $3)
RETURNING id`
  , [req.body.title, req.body.content, new Date()]);;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(rows[0].id);
});

module.exports = router;
