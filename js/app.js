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
        limit : limit
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
    document.getElementById('item-list').innerHTML = '';

    if(data.count === 0) {
      document.getElementById('no-items-found').style.display = '';
      document.getElementById('result-container').style.display = 'none';
    } else {
      document.getElementById('no-items-found').style.display = 'none';
      document.getElementById('result-container').style.display = '';
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
    var itemData = document.createElement('td');
    itemData.innerHTML = item.title;
    itemRow.appendChild(itemData);
    document.getElementById('item-list').appendChild(itemRow);
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
