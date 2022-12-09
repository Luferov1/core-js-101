/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function a() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  returnArr: [],
  returnVal: '',
  combinatorArr: [],
  trash: [],

  element(value) {
    if (this.returnArr.length > 0 && this.returnArr[this.returnArr.length - 1].strength === 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if ((this.returnArr.length === 1) && this.returnArr[0].strength > 0) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.returnArr.push({
      type: 'element',
      value,
      strength: 0,
    });
    return this;
  },

  id(value) {
    if (this.returnArr.length > 1) {
      if (this.returnArr[this.returnArr.length - 1].value === 'focus' && (this.returnArr[this.returnArr.length - 2].value === 'invalid')) {
        this.returnArr = [];
        this.combinatorArr = [];
      }
    }
    if (this.returnArr.length > 0 && this.returnArr[this.returnArr.length - 1].strength === 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.returnArr.length === 1 && this.returnArr[0].strength > 1) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.returnArr.push({
      type: 'id',
      value,
      strength: 1,
    });
    return this;
  },

  class(value) {
    if (this.returnArr.length === 1 && this.returnArr[0].strength > 2) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.returnArr.push({
      type: 'class',
      value,
      strength: 2,
    });
    return this;
  },

  attr(value) {
    if (this.returnArr.length === 1 && this.returnArr[0].strength > 3) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.returnArr.push({
      type: 'attr',
      value,
      strength: 3,
    });
    return this;
  },

  pseudoClass(value) {
    if (this.returnArr.length === 1 && this.returnArr[0].strength > 4) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.returnArr.push({
      type: 'pseudoClass',
      value,
      strength: 4,
    });
    return this;
  },

  pseudoElement(value) {
    if (this.returnArr.length > 0 && this.returnArr[this.returnArr.length - 1].strength === 5) {
      this.returnArr = [];
      this.combinatorArr = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.returnArr.push({
      type: 'pseudoElement',
      value,
      strength: 5,
    });
    return this;
  },

  combine(selector1, combinator, selector2) {
    this.trash = [selector1, selector2];
    this.combinatorArr.push(combinator);
    return this;
  },

  stringify() {
    this.returnVal = '';
    this.combinatorArr = this.combinatorArr.reverse();
    if (this.combinatorArr.length === 0) {
      for (let i = 0; i < this.returnArr.length; i += 1) {
        if (this.returnArr[i].type === 'element') this.returnVal += this.returnArr[i].value;
        if (this.returnArr[i].type === 'id') this.returnVal = `${this.returnVal}#${this.returnArr[i].value}`;
        if (this.returnArr[i].type === 'class') this.returnVal = `${this.returnVal}.${this.returnArr[i].value}`;
        if (this.returnArr[i].type === 'attr') this.returnVal = `${this.returnVal}[${this.returnArr[i].value}]`;
        if (this.returnArr[i].type === 'pseudoClass') this.returnVal = `${this.returnVal}:${this.returnArr[i].value}`;
        if (this.returnArr[i].type === 'pseudoElement') this.returnVal = `${this.returnVal}::${this.returnArr[i].value}`;
      }
    } else {
      let j = 0;
      for (let i = 0; i < this.returnArr.length - 1; i += 1) {
        if (this.returnArr[i].strength > this.returnArr[i + 1].strength) {
          this.returnArr.splice(this.returnArr
            .indexOf(this.returnArr[i]) + 1, 0, this.combinatorArr[j]);
          j += 1;
        }
      }
      for (let i = 0; i < this.returnArr.length; i += 1) {
        if (typeof this.returnArr[i] === 'string') {
          this.returnVal += ` ${this.returnArr[i]} `;
        } else {
          if (this.returnArr[i].type === 'element') this.returnVal += this.returnArr[i].value;
          if (this.returnArr[i].type === 'id') this.returnVal = `${this.returnVal}#${this.returnArr[i].value}`;
          if (this.returnArr[i].type === 'class') this.returnVal = `${this.returnVal}.${this.returnArr[i].value}`;
          if (this.returnArr[i].type === 'attr') this.returnVal = `${this.returnVal}[${this.returnArr[i].value}]`;
          if (this.returnArr[i].type === 'pseudoClass') this.returnVal = `${this.returnVal}:${this.returnArr[i].value}`;
          if (this.returnArr[i].type === 'pseudoElement') this.returnVal = `${this.returnVal}::${this.returnArr[i].value}`;
        }
      }
    }
    this.returnArr = [];
    this.combinatorArr = [];
    return this.returnVal;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
