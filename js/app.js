var scope = (function () {

  var page = 1,
    limit = 20,
    keywords = '',
    MAX_PAGE = 2001; //Max of page according to Etsy API

  function makeJSONPRequest () {
    var head = document.head,
      script = document.createElement('script'),
      url = generateRequestUrl();

    document.getElementById('result-container').style.display = 'none';
    document.getElementById('no-items-found').style.display = 'none';
    document.getElementById('loading-animation').style.display = '';

    script.setAttribute('src', url);
    script.setAttribute('type', 'application/javascript');
    head.appendChild(script);
    head.removeChild(script);
  }

  function generateRequestUrl () {
    var endpoint = 'https://openapi.etsy.com/v2/listings/active',
      queryObj = {
        api_key :'p169gzr369njgueyv6e489a7',
        page : page,
        callback : 'scope.responseHandler',
        limit : limit,
        includes : 'Images(url_75x75)'
      };

      if (keywords){
        queryObj.keywords = keywords;
      }

    return endpoint + '.js?' + toQueryString(queryObj);
  }

  function toQueryString(obj) {
    var parts = [];
    _.forOwn(obj, function(value, key) {
      parts.push( encodeURIComponent(key) + '=' + encodeURIComponent(value) );
    });
    return parts.join("&");
  }

  function getNextPage () {
    page++;
    makeJSONPRequest();
  }

  function getPreviousPage () {
    page--;
    makeJSONPRequest();
  }

  function search () {
    keywords = document.getElementById('keywords-input').value;
    page = 1;
    makeJSONPRequest();
    return false; //Prevent form submission
  }

  function responseHandler (data) {
    updatePagination(data);
    updateItemList(data);
  }

  function updateItemList (data) {

    document.getElementById('loading-animation').style.display = 'none';

    if(data.count === 0) {
      document.getElementById('no-items-found').style.display = '';
      document.getElementById('result-container').style.display = 'none';
    } else {
      document.getElementById('no-items-found').style.display = 'none';
      document.getElementById('result-container').style.display = '';
      document.getElementById('item-list').innerHTML = '';

      data.results.map(createItemElement);
    }
  }

  function updatePagination (data) {
    var lastPage = totalPages(data.count),
      previousPageBtn = document.getElementById('previous-page-btn'),
      nextPageBtn = document.getElementById('next-page-btn'),
      paginationCtn = document.getElementById('pagination-container');

    if (totalPages === 0 || totalPages === 1){
      paginationCtn.style.display = 'none';
    } else {
      paginationCtn.style.display = '';
      disableElementOnCondition(previousPageBtn, page === 1);
      disableElementOnCondition(nextPageBtn, page === lastPage);
      document.getElementById('current-page').innerHTML = 'Page ' + page + ' of ' + lastPage;
    }
  }

  function disableElementOnCondition (element, cond){
    if(cond) {
      element.setAttribute('disabled', 'true');
    } else {
      element.removeAttribute('disabled');
    }
  }

  function totalPages (itemCount) {
    var pages = Math.min(MAX_PAGE, itemCount / limit);
    return Math.ceil(pages);
  }

  function createItemElement (item) {
    var itemRow = document.createElement('tr');

    var itemImage = document.createElement('td');
    if(item.Images && item.Images.length > 0) {
      itemImage.innerHTML = '<img src="' + item.Images[0].url_75x75 + '" />';
    }

    var itemTitle = document.createElement('td');
    itemTitle.innerHTML = '<a href="' + item.url + '" target="_blank">' + item.title + '</a>';

    var itemPrice = document.createElement('td');
    itemPrice.innerHTML = item.price + ' ' + item.currency_code;

    itemRow.appendChild(itemImage);
    itemRow.appendChild(itemTitle);
    itemRow.appendChild(itemPrice);
    document.getElementById('item-list').appendChild(itemRow);
  }


  function testModule () {

    var element;

    function assertEqual () {
      if (arguments[0] !== arguments[1]) {
        throw('Test ""' + arguments[2] + '"" Failed: ' + arguments[0] + ' is not equal to ' + arguments[1]);
      } else {
        var passedMessage = 'Test Passed: ' + arguments[2];
        console.log(passedMessage);
      }
    }

    assertEqual(totalPages(20), 1, 'totalPages() should properly set the right number of pages');
    assertEqual(totalPages(33), 2, 'totalPages() should properly set the right number of pages');
    assertEqual(totalPages(2005 * limit), MAX_PAGE, 'totalPages() should not go over the max pages allowed by the API');

    page = 3;
    getNextPage();
    assertEqual(page, 4, 'getNextPage()');

    page = 3;
    getPreviousPage();
    assertEqual(page, 2, 'getPreviousPage()');

    element = document.createElement('input');
    disableElementOnCondition(element, true);
    assertEqual(element.getAttribute('disabled'), 'true', 'disableElementOnCondition() should add the disabled attribute');

    element = document.createElement('input');
    disableElementOnCondition(element, false);
    assertEqual(element.getAttribute('disabled'), null, 'disableElementOnCondition() should remove the disabled attribute');

    assertEqual(toQueryString({param1: 'value=', param2: 'value'}), 'param1=value%3D&param2=value', 'toQueryString() should convert an object to a query string');

    return 'Tests pass';
  }

  return {
    getNextPage: getNextPage,
    getPreviousPage : getPreviousPage,
    makeJSONPRequest: makeJSONPRequest,
    responseHandler: responseHandler,
    search: search,
    testModule: testModule
  };

})();

window.onload = scope.makeJSONPRequest;
