const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();
  res.render("bookinstance_list", {
    title: "Book instances",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findOne({ _id: req.params.id })
    .populate("book")
    .exec();
  if (bookInstance === null) {
    const err = new Error("BookInstance not found!");
    res.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Book Instance",
    bookinstance: bookInstance,
  });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  res.render("bookinstance_form", {
    title: "Bookinstance Form",
    book_list: allBooks,
  });
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("bookinstance_form", {
        title: "Bookintance Form",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        bookinstance: bookInstance,
        errors: errors.array(),
      });
      return;
    } else {
      await bookInstance.save();

      res.redirect(bookInstance.url);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookinstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookinstance === null) res.redirect("/catalog/bookinstances");

  res.render("bookinstance_delete", {
    title: "Delete Bookinstance",
    bookinstance: bookinstance,
  });
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  const bookinstance = await BookInstance.findById(req.params.id);

  if (bookinstance === null) res.redirect("/catalog/bookinstances");
  else {
    await BookInstance.findByIdAndDelete(req.params.id);
    res.redirect("/catalog/bookinstances");
  }
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const [bookinstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).exec(),
    Book.find().sort({ title: 1 }).exec(),
  ]);
  if (bookinstance === null) res.redirect("/cataog/bookinstances");

  res.render("bookinstance_form", {
    title: "Update Bookinstance",
    bookinstance: bookinstance,
    book_list: allBooks,
    selected_book: bookinstance.book,
  });
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("bookinstance_form", {
        title: "Bookintance Form",
        book_list: allBooks,
        selected_book: bookinstance.book._id,
        bookinstance: bookinstance,
        errors: errors.array(),
      });
      return;
    } else {
      await BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {});
      res.redirect(bookinstance.url);
    }
  }),
];
