import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // It means that when you create a new Product document using this schema, you must specify a value for the category field, and
    // that value must be a valid ObjectId of a document in the Category collection.
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // data property is a Buffer object that contains the binary data of the photo. The Buffer is a built-in Node.js class that provides a way to
    // handle binary data.contentType property is a string that specifies the MIME type of the photo. For example, image/png, image/jpeg, image/gif,
    // etc.Together, these properties allow you to store the binary data of an image as a Buffer object, along with its content type. This is a
    // common pattern for storing images in a database as it allows you to easily retrieve and display the image later.
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
