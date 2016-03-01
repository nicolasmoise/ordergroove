var expect = chai.expect;

function expectToNotDisplayElement(elementId) {
  expect(document.getElementById(elementId).style.display).to.equal('none');
}
function expectToDisplayElement(elementId) {
  expect(document.getElementById(elementId).style.display).to.equal('');
}

describe('response handler', function() {


    it('should display the correct message if no items are returned', function() {
      scope.responseHandler({ count: 0 });
      expectToDisplayElement('no-items-found');
    });

    it('should not display the loading animation when items are returned', function() {
      scope.responseHandler({ count: 0 });
      expectToNotDisplayElement('loading-animation');
    });

    it('should not display the item table when no items are returned', function() {
      scope.responseHandler({ count: 0 });
      expectToNotDisplayElement('result-container');
    });

    it('should display the item table when items are returned', function() {
      scope.responseHandler({ count: 1, results: [] });
      expectToDisplayElement('result-container');
    });

    it('should display the item table when items are returned', function() {
      scope.responseHandler({ count: 1, results: [] });
      expectToDisplayElement('result-container');
    });

    it('should not display the no items found message when items are returned', function() {
      scope.responseHandler({ count: 1, results: [] });
      expectToNotDisplayElement('no-items-found');
    });

    it('should not display the pagination if there is only one page', function() {
      scope.responseHandler({ count: 1, results: [] });
      expectToNotDisplayElement('pagination-container');
    });

    it('should display the pagination if there is more than one page', function() {
      scope.responseHandler({ count: 30, results: [] });
      expectToDisplayElement('pagination-container');
    });

    it('should correctly populate the item table', function() {
      var items = [{},{}],
        item_list = document.getElementById('item-list');
      scope.responseHandler({ count: 2, results: items });
      expect(item_list.children.length).to.equal(2);
    });

    it('should correctly set the item title', function() {
      var items = [{title: 'item title'}],
        item_list = document.getElementById('item-list');

      scope.responseHandler({ count: 1, results: items });
      var itemRow = item_list.children[0],
        titleCell = itemRow.children[1],
        itemTitle = titleCell.children[0].innerHTML;
      expect(itemTitle).to.equal('item title');
    });

    it('should correctly set the item url', function() {
      var items = [{url: 'item url'}],
        item_list = document.getElementById('item-list');

      scope.responseHandler({ count: 1, results: items });
      var itemRow = item_list.children[0],
        titleCell = itemRow.children[1],
        itemUrl = titleCell.children[0].getAttribute('href');
      expect(itemUrl).to.equal('item url');
    });

    it('should correctly set the item price', function() {
      var items = [{price: 123, currency_code: 'USD'}],
        item_list = document.getElementById('item-list');

      scope.responseHandler({ count: 1, results: items });
      var itemRow = item_list.children[0],
        priceCell = itemRow.children[2],
        itemPrice = priceCell.innerHTML;
      expect(itemPrice).to.equal('123 USD');
    });



});
