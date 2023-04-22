import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import OrderModel from "../models/OrderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
dotenv.config();

//===================Payment-getway======================
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//===================create-product======================
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields; //Since request being is made from FormData()
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less than 1MB" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      // It reads the binary data of the photo file from the path specified in the "photo.path" The fs module is a built-in Node.js module that provides an API
      // for working with the file system. The readFileSync() method is a synchronous method that reads the entire contents of a file in a blocking way and returns
      //  it as a buffer. The method takes a file path as its first argument and returns the contents of the file as a buffer object.In programming, a buffer is a
      // temporary data storage area used to hold data while it is being transferred from one place to another. A buffer is typically a contiguous block of memory that
      // can be used to hold a sequence of bytes, such as the binary data of a file or a network packet. JavaScript, a buffer is an object that represents a fixed-length
      // sequence of bytes. It is used to work with binary data directly, without requiring conversions to and from string or numeric types. The buffer
      // object provides methods for creating, reading, and manipulating binary data in various formats, including integers, floating-point numbers, and strings.
      product.photo.data = fs.readFileSync(photo.path);
      // MIME stands for Multipurpose Internet Mail Extensions. It is a standard that extends the format of email messages to support text in character sets other than
      //  ASCII, as well as attachments of audio, video, images, and application programs.In web development, MIME is used to identify the type of data that is being
      // sent over HTTP. When a client requests a resource such as a web page or an image from a server, the server responds with a MIME type that indicates the format
      // of the data being sent. The client then uses this MIME type to determine how to process and display the data. MIME types are identified by a string that consists
      // of a type and a subtype, separated by a slash (/). For example, the MIME type for a JPEG image is "image/jpeg", while the MIME type for a plain text file is
      // "text/plain". MIME types are usually sent in the "Content-Type" header of an HTTP response. In the code snippet provided, the MIME type of the uploaded image
      //  file is assigned to the product.contentType property, which can be useful for identifying and displaying the image in the correct format in the user interface.

      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      sucess: true,
      messsage: "Product Created Successfully",
      product,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: false,
      messsage: "Error in creating product",
      error,
    });
  }
};

//===================get-All-Products======================

export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      sucess: true,
      messsage: " All products",
      Total_Products: products.length,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: true,
      messsage: "Error in getting products",
      error: error.messsage,
    });
  }
};

//===================get-Single-Products======================

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      sucess: true,
      messsage: "Product",
      product,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: true,
      messsage: "Error in getting product",
      error: error.messsage,
    });
  }
};

//===================get-Product-photo======================
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo && product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: false,
      messsage: "Error in getting product's photo",
      error: error.messsage,
    });
  }
};

//===================delete-Product======================
export const deleteProductPhotoController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      sucess: true,
      messsage: "Product Deleted sucessfully",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: true,
      messsage: "Error in deleting product",
      error,
    });
  }
};

//===================update-Product======================

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less than 1MB" });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      sucess: true,
      messsage: "Product updated Successfully",
      product,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      sucess: false,
      messsage: "Error in updating product",
      error,
    });
  }
};

//===================Filter-Product======================
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      sucess: true,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      sucess: false,
      messsage: "Error in filtering products",
      error,
    });
  }
};

//===Pagination===========//

//===================Product-count======================

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      sucess: true,
      total,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      sucess: false,
      messsage: "Error in counting the prodcuts",
      error,
    });
  }
};

//===================Product-per-Page======================
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//===================Search - Product======================
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        // The query uses the $or operator to specify multiple conditions to match against. The $or operator allows us to specify
        // multiple expressions, any of which can satisfy the query.In this case, the query is looking for documents where either the
        // name field or the description field matches a regular expression ($regex) containing the keyword value. The regular expression
        // uses the $options flag with the value "i" to perform a case-insensitive search.
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "error in search product api",
      error,
    });
  }
};

//===================Search - Product======================

export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }, //Don't select the product with with "_id" that is being passed in request
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    // In Mongoose, when we define a schema for a model, we can specify fields that reference other models using a special type called ObjectId. These
    // fields are called "references". In this code snippet, the category field in the productModel schema is a reference to the Category model. This means that the
    // category field contains the _id of a category document from the Category collection in the database.
    // When we use the populate method in a query, it tells Mongoose to replace the category field in the results with the full category document from the Category
    //  collection. So in this code snippet, the populate("category") method is telling Mongoose to replace the _id in the category field of each product with the full
    //   category object that it references. This allows us to access all of the fields of the category object in the query results, rather than just the _id.
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//===================gte-Product-category-wise======================

export const productCategoryController = async (req, res) => {
  try {
    //find the category and all the product who are under this category
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting product",
      error,
    });
  }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>===================Payment-routes======================

//===================BrainTree-token-api======================
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    // console.log(error);
  }
};

//===================BrainTree-payment-api======================
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    // console.log(error);
  }
};
