var scope = (function () {

  var page = 1,
    limit = 25,
    keywords = '',
    MAX_PAGE = 2001; //Max of page according to Etsy API

  function makeJSONPRequest () {
    var head = document.head,
      script = document.createElement('script'),
      url = generateRequestUrl();

    document.getElementById('result-container').style.display = 'none';
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
        callback : 'scope.responseHandler'
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
    document.getElementById('result-container').style.display = '';

    if(data.count === 0) {
      document.getElementById('item-list').innerHTML = 'No items match your search';
    } else {
      document.getElementById('item-list').innerHTML = '';
      data.results.map(createItemElement);
    }
  }

  function updatePagination (data) {
    var lastPage = totalPages(data.count);
    document.getElementById('previous-page-btn').style.display = page === 1 ? 'none' : '';
    document.getElementById('next-page-btn').style.display = page ===  lastPage ? 'none': '';
    document.getElementById('current-page').innerHTML = 'Page ' + page + ' of ' + lastPage;
  }

  function totalPages (itemCount) {
    var pages = Math.min(MAX_PAGE, itemCount / limit);
    return Math.ceil(pages);
  }

  function createItemElement (item) {
    var itemElement = document.createElement('div');
    itemElement.innerHTML = item.title;
    document.getElementById('item-list').appendChild(itemElement);
  }

  return {
    getNextPage: getNextPage,
    getPreviousPage : getPreviousPage,
    makeJSONPRequest: makeJSONPRequest,
    responseHandler: responseHandler,
    search: search
  };

})();

window.onload = scope.makeJSONPRequest;
