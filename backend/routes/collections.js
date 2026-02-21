const express = require("express");
const router = express.Router();
const collectionsController = require("../controllers/collections");

router.get("/", collectionsController.getCollections);
router.get("/:id", collectionsController.getCollectionById);
router.post("/", collectionsController.createCollection);
router.put("/:id", collectionsController.updateCollection);
router.delete("/:id", collectionsController.deleteCollection);

module.exports = router;
