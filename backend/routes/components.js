const express = require("express");
const router = express.Router();
const componentsController = require("../controllers/components");

router.get("/", componentsController.getComponents);
router.get("/:id", componentsController.getComponentById);
router.post("/", componentsController.createComponent);
router.put("/:id", componentsController.updateComponent);
router.delete("/:id", componentsController.deleteComponent);

module.exports = router;
