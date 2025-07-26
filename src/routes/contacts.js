const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const isValidId = require("../../middlewares/isValidId");
const { contactAddSchema, contactUpdateSchema } = require("../../schemas/contactSchemas");

router.post("/", validateBody(contactAddSchema), ctrl.addContact);
router.patch("/:contactId", isValidId, validateBody(contactUpdateSchema), ctrl.updateContact);
router.get("/:contactId", isValidId, ctrl.getById);
router.delete("/:contactId", isValidId, ctrl.deleteContact);
