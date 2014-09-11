'use strict';

angular.module('natura.tempos')
  .controller('MainCtrl', ['$scope', '$timeout', 'ngTableParams', 'TimesManager', 'CATEGORIAS',
    function ($scope, $timeout, ngTableParams, TimesManager, CATEGORIAS) {

      $scope.atletaChegada = { numero: '' };
      $scope.atletaSaida   = { numero: '', horario: '' };
      $scope.novoAtleta    = { numero    : '', categoria : CATEGORIAS[0], saida: '', chegada: '', tempo: '' };
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
            numero    : $scope.novoAtleta.numero,
            categoria : $scope.novoAtleta.categoria,
            saida     : '',
            chegada   : '',
            tempo     : ''
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
      $scope.addSaida = function() {

        if (isInvalidTime($scope.atletaSaida.horario))
        {
          return showWarningMessage('A horário informado é inválido.');
        }

        // Procura se o atleta está cadastrado
        var _index = indexByNumber($scope.atletaSaida.numero);

        if (_index === -1)
        {
          return showWarningMessage('O atleta ' + $scope.atletaSaida.numero + ' não está cadastrado no sistema.');
        }

        // Seta o horário no model
        $scope.atletas.cadastrados[_index].saida = moment($scope.atletaSaida.horario + '00', 'HHmmss').format('HH:mm:ss');

        TimesManager.sync($scope.atletas.cadastrados).then(function() {
          $scope.atletaSaida.numero  = '';
          $scope.atletaSaida.horario = '';
        });

      };

      /* Adiciona uma chegada */
      $scope.addChegada = function() {

        // Procura se o atleta está cadastrado
        var _index = indexByNumber($scope.atletaChegada.numero);

        if (_index === -1)
        {
          return showWarningMessage('O atleta ' + $scope.atletaSaida.numero + ' não está cadastrado no sistema.');
        }

        // Adiciona a chegada
        var _atleta = $scope.atletas.cadastrados[_index];
        var _now    = moment();

        if (_now.isBefore(moment(_atleta.saida, 'HH:mm:ss')))
        {
          return showWarningMessage('O horário de chegada é anterior ao horário de saída.');
        }

        if (_atleta.saida == '')
        {
          return showWarningMessage('O atleta não possui um horário de saída cadastrado.');
        }

        _atleta.chegada = _now.format('HH:mm:ss');
        _atleta.tempo   = _now.subtract(moment(_atleta.saida, 'HH:mm:ss')).format('HH:mm:ss');

        TimesManager.sync($scope.atletas.cadastrados).then(function() {
          $scope.atletaChegada.numero = '';
        });

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

      /*
      | Mostra uma mensagem de aviso
      */
      var showWarningMessage = function(message) {
        $timeout(function(){
          $scope.warningMessage = '';
        }, 2500);

        return $scope.warningMessage = message;
      };

      /*
      | Validade do horario informado
       */
      var isInvalidTime = function(_date) {
        return ! moment(_date, 'HH:mm').isValid();
      };

      var indexByNumber = function(_number) {
        return _.findIndex($scope.atletas.cadastrados, { numero: _number });
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
