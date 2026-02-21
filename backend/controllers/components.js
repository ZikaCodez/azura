const db = require("../core/db");

exports.getComponents = async (req, res) => {
  try {
    const components = await db("components").select("*");
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch components" });
  }
};

exports.getComponentById = async (req, res) => {
  try {
    const component = await db("components")
      .where({ id: req.params.id })
      .first();
    if (!component)
      return res.status(404).json({ error: "Component not found" });
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch component" });
  }
};

exports.createComponent = async (req, res) => {
  try {
    const { name, type, price, image } = req.body;
    const [id] = await db("components")
      .insert({ name, type, price, image })
      .returning("id");
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create component" });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const { name, type, price, image } = req.body;
    await db("components")
      .where({ id: req.params.id })
      .update({ name, type, price, image });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update component" });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    await db("components").where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete component" });
  }
};
