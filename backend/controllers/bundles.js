const { connectDB } = require("../core/db");

exports.getBundles = async (req, res) => {
  try {
    const db = await connectDB();
    const bundles = await db.collection("bundles").find({}).toArray();
    const bundlesWithOriginal = await Promise.all(
      bundles.map(async (bundle) => {
        const productIds = Array.isArray(bundle.productIds)
          ? bundle.productIds
          : [];
        let originalPrice = 0;
        if (productIds.length > 0) {
          const products = await db
            .collection("products")
            .find({ _id: { $in: productIds } })
            .project({ basePrice: 1 })
            .toArray();
          originalPrice = products.reduce(
            (sum, p) => sum + (p.basePrice || 0),
            0,
          );
        }
        return {
          ...bundle,
          originalPrice,
          expire: bundle.expire || undefined,
        };
      }),
    );
    res.json(bundlesWithOriginal);
  } catch (err) {
    console.error("getBundles error:", err);
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
};

exports.getBundleById = async (req, res) => {
  try {
    const db = await connectDB();
    const id = Number(req.params.id) || req.params.id;
    const bundle = await db.collection("bundles").findOne({ _id: id });
    if (!bundle) return res.status(404).json({ error: "Bundle not found" });
    const productIds = Array.isArray(bundle.productIds)
      ? bundle.productIds
      : [];
    let originalPrice = 0;
    if (productIds.length > 0) {
      const products = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .project({ basePrice: 1 })
        .toArray();
      originalPrice = products.reduce((sum, p) => sum + (p.basePrice || 0), 0);
    }
    res.json({ ...bundle, originalPrice, expire: bundle.expire || undefined });
  } catch (err) {
    console.error("getBundleById error:", err);
    res.status(500).json({ error: "Failed to fetch bundle" });
  }
};

exports.createBundle = async (req, res) => {
  try {
    const db = await connectDB();
    const { _id, name, slug, description, productIds, price, image, expire } =
      req.body;
    const doc = {
      _id: _id || Date.now(),
      name,
      slug,
      description,
      productIds: Array.isArray(productIds) ? productIds : [],
      price: price != null ? price : null,
      image: image || null,
      expire: expire || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("bundles").insertOne(doc);
    res.status(201).json({ id: doc._id });
  } catch (err) {
    console.error("createBundle error:", err);
    res.status(500).json({ error: "Failed to create bundle" });
  }
};

exports.updateBundle = async (req, res) => {
  try {
    const db = await connectDB();
    const id = Number(req.params.id) || req.params.id;
    const { name, slug, description, productIds, price, image, expire } =
      req.body;
    const set = {
      name,
      slug,
      description,
      productIds: Array.isArray(productIds) ? productIds : [],
      price: price != null ? price : null,
      image: image || null,
      expire: expire || null,
      updatedAt: new Date(),
    };
    await db.collection("bundles").updateOne({ _id: id }, { $set: set });
    res.json({ success: true });
  } catch (err) {
    console.error("updateBundle error:", err);
    res.status(500).json({ error: "Failed to update bundle" });
  }
};

exports.deleteBundle = async (req, res) => {
  try {
    const db = await connectDB();
    const id = Number(req.params.id) || req.params.id;
    await db.collection("bundles").deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteBundle error:", err);
    res.status(500).json({ error: "Failed to delete bundle" });
  }
};
