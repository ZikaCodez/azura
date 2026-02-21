const db = require("../core/db");

exports.getBundles = async (req, res) => {
  try {
    const bundles = await db("bundles").select("*");
    // For each bundle, fetch products and calculate originalPrice
    const bundlesWithOriginal = await Promise.all(
      bundles.map(async (bundle) => {
        const productIds = JSON.parse(bundle.productIds);
        const products = await db("products")
          .whereIn("id", productIds)
          .select("basePrice");
        const originalPrice = products.reduce(
          (sum, p) => sum + (p.basePrice || 0),
          0,
        );
        // Attach expire if present
        return { ...bundle, originalPrice, expire: bundle.expire || undefined };
      }),
    );
    res.json(bundlesWithOriginal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
};

exports.getBundleById = async (req, res) => {
  try {
    const bundle = await db("bundles").where({ id: req.params.id }).first();
    if (!bundle) return res.status(404).json({ error: "Bundle not found" });
    const productIds = JSON.parse(bundle.productIds);
    const products = await db("products")
      .whereIn("id", productIds)
      .select("basePrice");
    const originalPrice = products.reduce(
      (sum, p) => sum + (p.basePrice || 0),
      0,
    );
    res.json({ ...bundle, originalPrice, expire: bundle.expire || undefined });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bundle" });
  }
};

exports.createBundle = async (req, res) => {
  try {
    const { name, slug, description, productIds, price, image, expire } =
      req.body;
    const [id] = await db("bundles")
      .insert({
        name,
        slug,
        description,
        productIds: JSON.stringify(productIds),
        price,
        image,
        expire: expire || null,
      })
      .returning("id");
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create bundle" });
  }
};

exports.updateBundle = async (req, res) => {
  try {
    const { name, slug, description, productIds, price, image, expire } =
      req.body;
    await db("bundles")
      .where({ id: req.params.id })
      .update({
        name,
        slug,
        description,
        productIds: JSON.stringify(productIds),
        price,
        image,
        expire: expire || null,
      });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update bundle" });
  }
};

exports.deleteBundle = async (req, res) => {
  try {
    await db("bundles").where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bundle" });
  }
};
