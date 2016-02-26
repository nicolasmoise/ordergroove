var scope = (function () {

  var page = 1;

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

  function responseHandler (data) {
    updateItemList(data);
  }

  function updateItemList (data) {
    resultContainer().innerHTML = '';
    data.results.map(createItemElement);
  }

  function createItemElement (item) {
    var listingElement = document.createElement('div');
    listingElement.innerHTML = item.title;
    resultContainer().appendChild(listingElement);
  }

  function resultContainer () {
    return document.getElementById('result-container');
  }

  return {
    makeJSONPRequest: makeJSONPRequest,
    responseHandler: responseHandler
  };

})();

window.onload = scope.makeJSONPRequest;
