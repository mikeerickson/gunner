/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

// some often used helpers
Array.prototype.last = function () {
  return this[this.length - 1]
}

Array.prototype.first = function () {
  return this[0]
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item)
}

const arrays = {
  first: (array) => {
    return array[0]
  },

  last: (array) => {
    if (Array.isArray(array) && array.length > 0) {
      return array[array.length - 1]
    } else {
      return 'undefined'
    }
  },

  formatSelect: (array) => {
    return array.map((item) => {
      return { text: item, value: item }
    })
  },

  objectToSelect: (array) => {
    return array.map((item) => {
      return { text: item, value: item }
    })
  },

  insert: (arr, index, item) => [...arr.slice(0, index), item, ...arr.slice(index)],

  delete: (arr, index, num = 1) => {
    if (index > arr.length) return
    // let value = arr[index]
    // return arr.filter(element => {
    //     return element != value
    // })
    arr.splice(index, num)
  },

  deleteByValue: (arr, value) => {
    if (index > arr.length) return
    return arr.filter((element) => {
      return element != value
    })
  },

  intersect: (arr1 = [], arr2 = []) => {
    return arr1.filter((x) => arr2.includes(x))
  },

  difference: (arr1 = [], arr2 = []) => {
    return arr1.filter((x) => !arr2.includes(x))
  },

  differenceSymmetrical: (arr1 = [], arr2 = []) => {
    return arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)))
  },

  union: (arr1 = [], arr2 = []) => {
    return [...new Set([...arr1, ...arr2])]
  },
}

module.exports = arrays
