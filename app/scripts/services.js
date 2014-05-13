'use strict';

angular.module('javascriptApp')
  .factory('pouchdbWrapper', ['pouchdb', function(pouchdb) {
    return pouchdb.create('natura-tempos');
  }]);

angular.module('javascriptApp')
  .factory('pouchdbService', ['pouchdbWrapper', function(pouchdbWrapper) {
    return {
      add: function(obj) {
        return pouchdbWrapper.put(obj);
      },
      get: function(id) {
        return pouchdbWrapper.get(id);
      },
      all: function() {
        return pouchdbWrapper.allDocs({
          include_docs: true,
          descending: true
        });
      },
      destroy: function() {
        return pouchdbWrapper.destroy();
      }
    };
  }]);