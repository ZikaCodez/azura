const db = require("../core/db");

// Collection Controller
exports.getCollections = async (req, res) => {
  try {
    const collections = await db("collections").select("*");
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = await db("collections")
      .where({ id: req.params.id })
      .first();
    if (!collection)
      return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collection" });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { name, slug, description, productIds } = req.body;
    const [id] = await db("collections")
      .insert({
        name,
        slug,
        description,
        productIds: JSON.stringify(productIds),
      })
      .returning("id");
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create collection" });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { name, slug, description, productIds } = req.body;
    await db("collections")
      .where({ id: req.params.id })
      .update({
        name,
        slug,
        description,
        productIds: JSON.stringify(productIds),
      });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update collection" });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    await db("collections").where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete collection" });
  }
};
