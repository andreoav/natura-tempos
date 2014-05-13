'use strict';

angular.module('javascriptApp')
  .controller('MainCtrl', ['$scope', 'pouchdbService', function ($scope, pdbService) {

    $scope.data = {};

    /* Adiciona um novo atleta */
    $scope.addAtleta = function() {
        pdbService.add({
            _id : $scope.data.atleta
        }).then(function() {
            $scope.getData();
            $scope.data.atleta = '';
        });
    };

    /* Adiciona uma partida */
    $scope.addSaida = function() {

        pdbService.get($scope.data.atletaSaida).then(function(response) {

            var tempoPercurso = '';
            if (response.chegada) {
                tempoPercurso = moment(response.chegada, 'HH:mm')
                    .diff(moment($scope.data.horarioSaida, 'HH:mm'), 'minutes', true)
            }

            // Existing record
            pdbService.add({
                _id     : response._id,
                _rev    : response._rev,
                tempo   : tempoPercurso,
                chegada : response.chegada,
                saida   : $scope.data.horarioSaida
            })
            .then(function() {
                $scope.getData();
                $scope.data.atletaSaida = '';
                $scope.data.horarioSaida = '';
            });

        });
    };

    /* Adiciona uma chegada */
    $scope.addChegada = function() {

        pdbService.get($scope.data.atletaChegada).then(function(response) {

            var tempo = '';
            var hAtual = moment().format('HH:mm');
            
            if (response.saida) {
                tempo = moment(hAtual, 'HH:mm').diff(moment(response.saida, 'HH:mm'), 'minutes', true)
            }
            
            // Existing record
            pdbService.add({
                _id     : response._id,
                _rev    : response._rev,
                tempo   : tempo,
                saida   : response.saida,
                chegada : moment().format('HH:mm')
            })
            .then(function() {
                $scope.getData();
                $scope.data.atletaChegada = '';
                $scope.data.horarioChegada = '';
            });

        });
    };

    $scope.destroy = function() {
        pdbService.destroy().then(function() {
            $scope.getData();
            $scope.data.records = null;
        });
    };

    $scope.getData = function() {

        pdbService.all().then(function(response) {
            $scope.data.records = response.rows;
        });

    };

    /* Remove um registro */
    $scope.removeRecord = function(record) {

        pdbService.get(record).then(function(response) {
            pdbService.remove(response).then(function(response) {
                $scope.getData();
            });
        });

    };

    $scope.getData();

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  }]);
