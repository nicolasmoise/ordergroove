var scope = (function () {

  var page = 1;
  var limit = 25;

  function makeJSONPRequest () {
    var head = document.head,
      script = document.createElement('script'),
      url = generateRequestUrl();

    script.setAttribute('src', url);
    script.setAttribute('type', 'application/javascript');
    head.appendChild(script);
    head.removeChild(script);
  }

  function generateRequestUrl () {
    var apiKey = 'p169gzr369njgueyv6e489a7',
      resultParser = 'scope.responseHandler',
      endpoint = 'https://openapi.etsy.com/v2/listings/active';

    return endpoint + '.js?api_key=' + apiKey + '&page=' + page + '&callback=' + resultParser;
  }

  function getNextPage () {
    page++;
    makeJSONPRequest();
  }

  function getPreviousPage () {
    page--;
    makeJSONPRequest();
  }

  function responseHandler (data) {
    document.getElementById('result-container').style.display = '';
    updatePagination(data);
    updateItemList(data);
  }

  function updateItemList (data) {
    document.getElementById('item-list').innerHTML = '';
    data.results.map(createItemElement);
  }

  function updatePagination (data) {
    var MAX_PAGE = 2001; //Max of page according to Etsy API
    var totalPages= Math.min(MAX_PAGE, data.count / limit);
    document.getElementById('previous-page-btn').style.display = page === 1 ? 'none' : '';
    document.getElementById('next-page-btn').style.display = page === MAX_PAGE? 'none': '';
    document.getElementById('current-page').innerHTML = 'Page ' + page + ' of ' + totalPages;
  }

  function createItemElement (item) {
    var itemElement = document.createElement('div');
    itemElement.innerHTML = item.title;
    document.getElementById('item-list').appendChild(itemElement);
  }

  return {
    getPreviousPage : getPreviousPage,
    getNextPage: getNextPage,
    makeJSONPRequest: makeJSONPRequest,
    responseHandler: responseHandler
  };

})();

window.onload = scope.makeJSONPRequest;
