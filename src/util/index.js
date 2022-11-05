"use strict";
require("dotenv").config();

const slug = () => {
  return (
    Math.random().toString(36).substring(2, 7) +
    Math.random().toString(36).substring(2, 7)
  );
};

const code = () => {
  let code = Math.random() * (999999999999999) + 10000;
  code = Math.round(code);
  return code;
};

const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const toUnique = (a, b, c) => {
  b = a.length;
  while ((c = --b)) while (c--) a[b] !== a[c] || a.splice(c, 1);
  return a;
};

const removeItem = (array, element) => {
  let index = array.indexOf(element);
  if (index >= 1) {
    array.splice(index, 1);
  }
  return array;
};

const requiredFields = (object, array) => {
  let result;
  array.forEach((item) => {
    !object[item] ? (result = `${item} is required`) : (result = false);
  });
  return result;
};

const getEXT = (file) => {
  file = file.split(".");
  let count = file.length;
  count = count - 1;
  return file[count];
};

const isImage = (type) => {
  if (
    type === "jpg" ||
    type === "JPG" ||
    type === "jpeg" ||
    type === "JPEG" ||
    type === "png" ||
    type === "PNG" ||
    type === "gif"
  ) {
    return true;
  } else {
    return false;
  }
};

const isDoc = (type) => {
  if (
    type === "pdf" ||
    type === "xls" ||
    type === "xlsx" ||
    type === "ppt" ||
    type === "pptx" ||
    type === "doc" ||
    type === "docx" ||
    type === "csv" ||
    type === "txt"
  ) {
    return true;
  } else {
    return false;
  }
};

const percentage = (current, total) => {
  let val = current / total;
  val = val * 100;
  val = val.toFixed(2);
  val = Number(val);
  return val;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const pastItems = (items) => {
  const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  return items.filter(({ start_date }) => new Date(start_date) < yesterday);
}

const upcomingItems = (items) => {
  const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  return items.filter(({ start_date }) => new Date(start_date) >= yesterday);
}

const displayDate = (d) => {
  const date = new Date(d);
  if(!date) return null;
  return date.toDateString();
}

const getQR = (item) => {
  return `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${item}&choe=UTF-8`;
}

const sortDate = (items, options) => {
  const x_options = { date_to_sort: 'start_date', ...options }
  return items.sort(
    (itemA, itemB) => Number(new Date(itemA[x_options?.date_to_sort])) - Number(new Date(itemB[x_options?.date_to_sort])),
  )
}

const sortBy = (function () {
  const toString = Object.prototype.toString,
      // default parser function
      parse = function (x) { return x; },
      // gets the item to be sorted
      getItem = function (x) {
        const isObject = x != null && typeof x === "object";
        const isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
      };
      
  /**
   * Sorts an array of elements.
   *
   * @param {Array} array: the collection to sort
   * @param {Object} cfg: the configuration options
   * @property {String}   cfg.prop: property name (if it is an Array of objects)
   * @property {Boolean}  cfg.desc: determines whether the sort is descending
   * @property {Function} cfg.parser: function to parse the items to expected type
   * @return {Array}
   */
  return function sortby (array, cfg) {
    if (!(array instanceof Array && array.length)) return [];
    if (toString.call(cfg) !== "[object Object]") cfg = {};
    if (typeof cfg.parser !== "function") cfg.parser = parse;
    cfg.desc = !!cfg.desc ? -1 : 1;
    return array.sort(function (a, b) {
      a = getItem.call(cfg, a);
      b = getItem.call(cfg, b);
      return cfg.desc * (a < b ? -1 : +(a > b));
    });
  };
  
}());

module.exports = {
  slug,
  code,
  guid,
  toUnique,
  removeItem,
  requiredFields,
  isDoc,
  isImage,
  getEXT,
  percentage,
  asyncForEach,
  pastItems,
  upcomingItems,
  displayDate,
  getQR,
  sortDate,
  sortBy
};
