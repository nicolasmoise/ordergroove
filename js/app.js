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

    if (lastPage === 0 || lastPage === 1){
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
    itemRow.appendChild(imageCell(item));
    itemRow.appendChild(titleCell(item));
    itemRow.appendChild(priceCell(item));
    document.getElementById('item-list').appendChild(itemRow);
  }

  function priceCell (item) {
    var priceCell = document.createElement('td');
    priceCell.innerHTML = item.price + ' ' + item.currency_code;
    return priceCell;
  }

  function titleCell (item) {
    var titleCell = document.createElement('td');
    titleCell.innerHTML = '<a href="' + item.url + '" target="_blank">' + item.title + '</a>';
    return titleCell;
  }

  function imageCell (item) {
    var imageCell = document.createElement('td');
    if(item.Images && item.Images.length > 0) {
      imageCell.innerHTML = '<img src="' + item.Images[0].url_75x75 + '" />';
    }
    return imageCell;
  }

  return {
    getNextPage: getNextPage,
    getPreviousPage : getPreviousPage,
    makeJSONPRequest: makeJSONPRequest,
    responseHandler: responseHandler,
    search: search
  };

})();
