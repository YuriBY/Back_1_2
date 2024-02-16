import { body } from "express-validator";
import { blogRepository } from "../repositories/blog-repository";
import { inputValidationMiddleware } from "../middleweares/input-validation/input-validation-middleware";


const titleValidator = body("title")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Incorrect title");

const shortDescriptionVAlidator = body("shortDescription")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Incorrect dscription");

const contentVAlidator = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Incorrect content");

const blogIdVAlidator = body("blogId")
  .custom((value) => {
    const blog = blogRepository.getById(value);

    if (!blog) {
      throw Error;
    }
    return true;
  })
  .withMessage("Incorrect blogId");

export const postValidation = () => [
  titleValidator,
  shortDescriptionVAlidator,
  contentVAlidator,
  blogIdVAlidator,
  inputValidationMiddleware,
];
