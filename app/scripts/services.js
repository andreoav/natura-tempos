'use strict';

/**
* javascriptApp Module
*
* Description
*/
angular.module('javascriptApp')
  .factory('TimesManager', ['$localForage', function($localForage) {

    var dbKey = 'atletas';

    return {

      all: function() {
        return $localForage.getItem(dbKey);
      },

      sync: function(_atletas) {
        return $localForage.setItem(dbKey, _atletas);
      },

      destroy: function() {
        return $localForage.removeItem(dbKey);
      }

    };

  }]);
