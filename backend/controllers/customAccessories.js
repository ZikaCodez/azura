const db = require("../core/db");

exports.getCustomAccessories = async (req, res) => {
  try {
    const customs = await db("customAccessories").select("*");
    res.json(customs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch custom accessories" });
  }
};

exports.getCustomAccessoryById = async (req, res) => {
  try {
    const custom = await db("customAccessories")
      .where({ id: req.params.id })
      .first();
    if (!custom)
      return res.status(404).json({ error: "Custom accessory not found" });
    res.json(custom);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch custom accessory" });
  }
};

exports.createCustomAccessory = async (req, res) => {
  try {
    const { userId, name, type, structure, status, image } = req.body;
    const [id] = await db("customAccessories")
      .insert({
        userId,
        name,
        type,
        structure: JSON.stringify(structure),
        status,
        image,
        createdAt: new Date(),
      })
      .returning("id");
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create custom accessory" });
  }
};

exports.updateCustomAccessory = async (req, res) => {
  try {
    const { name, type, structure, status, image } = req.body;
    await db("customAccessories")
      .where({ id: req.params.id })
      .update({
        name,
        type,
        structure: JSON.stringify(structure),
        status,
        image,
        updatedAt: new Date(),
      });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update custom accessory" });
  }
};

exports.deleteCustomAccessory = async (req, res) => {
  try {
    await db("customAccessories").where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete custom accessory" });
  }
};
