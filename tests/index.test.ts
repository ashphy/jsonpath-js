import { testJSONPath } from "./utils";

const book1 = {
  category: 'reference',
  author: 'Nigel Rees',
  title: 'Sayings of the Century',
  price: 8.95,
};

const book2 = {
  category: 'fiction',
  author: 'Evelyn Waugh',
  title: 'Sword of Honour',
  price: 12.99,
};

const book3 = {
  category: 'fiction',
  author: 'Herman Melville',
  title: 'Moby Dick',
  isbn: '0-553-21311-3',
  price: 8.99,
};

const book4 = {
  category: 'fiction',
  author: 'J. R. R. Tolkien',
  title: 'The Lord of the Rings',
  isbn: '0-395-19395-8',
  price: 22.99,
};

const json = {
  store: {
    book: [book1, book2, book3, book4],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

// https://goessner.net/articles/JsonPath/index.html#e2
describe('Stefan Goessner JsonPath implementation', () => {
  test.skip('the current object/element', () => {
    testJSONPath({ json: json, jsonpath: '$..book[(@.length-1)]', expected: [book4] });
  });

  test.skip('child operator', () => {
    testJSONPath({ json: json, jsonpath: '$.store.bicycle.color', expected: ['red'] });
  });

  test.skip('recursive descent', () => {
    testJSONPath({ json: json, jsonpath: '$..author', expected: [
        book1['author'],
        book2['author'],
        book3['author'],
        book4['author'],
      ]
    });
  });

  test('wildcard', () => {
    testJSONPath({ json: json, jsonpath: '$.store.book.*', expected: [
        book1,
        book2,
        book3,
        book4,
      ]
    });
  });

  test.skip('subscript operator', () => {
    testJSONPath({ json: json, jsonpath: '$..book[2]', expected: [book3] });
  });

  test.skip('array slice operator borrowed from ES4', () => {
    testJSONPath({ json: json, jsonpath: '$..book[1:3]', expected: [book2, book3] });
  });

  test.skip('array slice operator with slice', () => {
    testJSONPath({ json: json, jsonpath: '$..book[0:3:2]', expected: [book1, book3] });
  });

  test.skip('array slice operator with end', () => {
    testJSONPath({ json: json, jsonpath: '$..book[:2]', expected: [book1, book2] });
  });

  test.skip('applies a filter expression', () => {
    testJSONPath({ json: json, jsonpath: '$..book[?(@.isbn)]', expected: [book3, book4] });
  });

  test.skip('applies a script expression', () => {
    testJSONPath({ json: json, jsonpath: '$..book[?(@.price<10)]', expected: [book1, book3] });
  });
});
