const express = require("express");
const router = express.Router();
const bundlesController = require("../controllers/bundles");

router.get("/", bundlesController.getBundles);
router.get("/:id", bundlesController.getBundleById);
router.post("/", bundlesController.createBundle);
router.put("/:id", bundlesController.updateBundle);
router.delete("/:id", bundlesController.deleteBundle);

module.exports = router;
