/* Import module */
const {nanoid} = require('nanoid');
const books = require('./books');

const addingBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          // eslint-disable-next-line max-len
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const accomplish = books.filter((book) => book.id === id).length > 0;

  if (accomplish) {
    return h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        }).code(201);
  }

  return h
      .response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      }).code(500);
};

const getBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (reading === '1') {
    return h
        .response({
          status: 'success',
          data: {
            books: books
                .filter((book) => book.reading === true)
                .map((book) => ({
                  id: book.id,
                  name: book.name,
                  publisher: book.publisher,
                })),
          },
        }).code(200);
  }

  if (reading === '0') {
    return h
        .response({
          status: 'success',
          data: {
            books: books
                .filter((book) => book.reading === false)
                .map((book) => ({
                  id: book.id,
                  name: book.name,
                  publisher: book.publisher,
                })),
          },
        }).code(200);
  }

  if (finished === '1') {
    return h
        .response({
          status: 'success',
          data: {
            books: books
                .filter((book) => book.finished === true)
                .map((book) => ({
                  id: book.id,
                  name: book.name,
                  publisher: book.publisher,
                })),
          },
        }).code(200);
  }

  if (finished === '0') {
    return h
        .response({
          status: 'success',
          data: {
            books: books
                .filter((book) => book.finished === false)
                .map((book) => ({
                  id: book.id,
                  name: book.name,
                  publisher: book.publisher,
                })),
          },
        }).code(200);
  }

  if (name) {
    return h
        .response({
          status: 'success',
          data: {
            books: books
                // eslint-disable-next-line max-len
                .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
                .map((book) => ({
                  id: book.id,
                  name: book.name,
                  publisher: book.publisher,
                })),
          },
        }).code(200);
  }

  return h
      .response({
        status: 'success',
        data: {
          books: books.map((book) =>({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      }).code(200);
};

const getDetailBooksHandlerById = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (!book) {
    return h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        }).code(404);
  }

  return h
      .response({
        status: 'success',
        data: {
          book,
        },
      }).code(200);
};

const editBookHandlerById = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          // eslint-disable-next-line max-len
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    return h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        }).code(200);
  }
  return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
};

const deleteBookHandlerById = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
        .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
  }

  books.splice(index, 1);
  return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
};

module.exports = {
  addingBookHandler,
  getBooksHandler,
  getDetailBooksHandlerById,
  editBookHandlerById,
  deleteBookHandlerById,
};
