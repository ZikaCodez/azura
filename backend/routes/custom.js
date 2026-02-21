const express = require("express");
const router = express.Router();
const customAccessoriesController = require("../controllers/customAccessories");

router.get("/", customAccessoriesController.getCustomAccessories);
router.get("/:id", customAccessoriesController.getCustomAccessoryById);
router.post("/", customAccessoriesController.createCustomAccessory);
router.put("/:id", customAccessoriesController.updateCustomAccessory);
router.delete("/:id", customAccessoriesController.deleteCustomAccessory);

module.exports = router;
