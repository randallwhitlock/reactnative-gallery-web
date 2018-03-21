require('dotenv').config()
const {
  compose, pathOr, propOr, head, curry, map
} = require('ramda')
const { then, catchP, log } = require('../../utils/pointFreePromise')
const {
  documentBulkable, bulkAsync, getAllAsync, getByIdAsync, deleteByIdAsync
} = require('./')

const { GALLERY_INDEX, GALLERY_TYPE } = process.env

const gifBulkBase = documentBulkable(GALLERY_INDEX, GALLERY_TYPE)

const getGifByIdAsync = getByIdAsync(GALLERY_INDEX, GALLERY_TYPE)

const deleteGifByIdAsync = deleteByIdAsync(GALLERY_INDEX, GALLERY_TYPE)

const createGifAsync = doc => bulkAsync(gifBulkBase(doc))

const readAllGifAsync = () =>
  compose(
    catchP(log),
    then(map(propOr({}, '_source'))),
    then(pathOr([], ['hits', 'hits'])),
    then(head),
    then(propOr([], ['responses'])),
    curry(getAllAsync)
  )(GALLERY_INDEX, GALLERY_TYPE)

module.exports = {
  createGifAsync,
  readAllGifAsync,
  getGifByIdAsync,
  deleteGifByIdAsync
}
