const {
  addingBookHandler,
  getBooksHandler,
  getDetailBooksHandlerById,
  editBookHandlerById,
  deleteBookHandlerById,
} = require('./book_handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addingBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBooksHandlerById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookHandlerById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandlerById,
  },
];

module.exports = routes;
