const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts.controller");
const validateBody = require("../../middlewares/validateBody");
const { addContactSchema, updateContactSchema } = require("../../schemas/contactSchemas");
const isValidId = require("../../middlewares/isValidId");

router.get("/", ctrl.getAllContacts);
router.get("/:contactId", isValidId, ctrl.getContactById);
router.post("/", validateBody(addContactSchema), ctrl.addContact);
router.delete("/:contactId", isValidId, ctrl.deleteContact);
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrl.updateContact);

module.exports = router;