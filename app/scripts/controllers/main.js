'use strict';

angular.module('javascriptApp')
  .controller('MainCtrl', ['$scope', 'ngTableParams', 'TimesManager', 'CATEGORIAS',
    function ($scope, ngTableParams, TimesManager, CATEGORIAS) {

      $scope.atletaChegada = '';
      $scope.atletaSaida   = { numero: '', horario: '' };
      $scope.novoAtleta    = { numero    : '', categoria : CATEGORIAS[0], saida: '', chegada: '' };
      $scope.atletas       = { cadastrados : [] };
      $scope.categorias    = CATEGORIAS;

      /* Adiciona um novo atleta */
      $scope.addAtleta = function() {

        var existente = _.find($scope.atletas.cadastrados, {
          numero: $scope.novoAtleta.numero
        });

        // Verifica se já está cadastrado
        if (angular.isDefined(existente))
        {
          existente.categoria = $scope.novoAtleta.categoria;
        }
        else
        {
          $scope.atletas.cadastrados.push({
            numero: $scope.novoAtleta.numero,
            categoria: $scope.novoAtleta.categoria
          });
        }

        // Salva no localStorage
        TimesManager.sync($scope.atletas.cadastrados).then(function() {

          $scope.novoAtleta.numero    = '';
          $scope.novoAtleta.categoria = CATEGORIAS[0];

        });

        // Recarrega a tabela
        $scope.tableParams.reload();
      };

      /* Adiciona uma partida */
      $scope.addSaida = function() { };

      /* Adiciona uma chegada */
      $scope.addChegada = function() {

          /*var tempo = '';
          var hAtual = moment().format('HH:mm:ss');

          if (response.saida) {
              tempo = moment(hAtual, 'HH:mm:ss').subtract(
                moment(response.saida, 'HH:mm')
              ).format('HH:mm:ss');
          }*/

      };

      // Remove o atleta selecionado
      $scope.removeRecord = function(_atleta) {
        var _index = _.findIndex($scope.atletas.cadastrados, _atleta);
        $scope.atletas.cadastrados.splice(_index, 1);
        TimesManager.sync($scope.atletas.cadastrados);
        $scope.tableParams.reload();
      };

      // Delete o banco de dados do sistema
      $scope.destroy = function() {
        TimesManager.destroy().then(function() {
          $scope.atletas.cadastrados = [];
          $scope.tableParams.reload();
        });
      };

      TimesManager.all().then(function(_atletasCadastrados) {
        $scope.atletas.cadastrados = _atletasCadastrados ? _atletasCadastrados : [];
        $scope.tableParams.reload();
      });

      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
      }, {
        total: 0,
        groupBy: 'categoria',
        getData: function($defer, params) {
          params.total($scope.atletas.cadastrados.length);
          $defer.resolve($scope.atletas.cadastrados);
        }
      });

    }]
  );
