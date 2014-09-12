"use strict";angular.module("natura.tempos",["ngCookies","ngResource","ngSanitize","ngAnimate","ngRoute","ngTable","ui.utils","ui.select2","ngTableExport","ngNumeraljs","angularMoment","LocalForageModule"]).config(["$routeProvider","$localForageProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"}),b.config({name:"naturaTimes",storeName:"timesTable"})}]),angular.module("natura.tempos").constant("CATEGORIAS",["H10N","D10N","H12N","D12N","H12B","D12B","H14N","D14N","H14B","D14B","H14A","D14A","H16N","D16N","H16B","D16B","H16A","D16A","H16E","D16E","H18N","D18N","H18B","D18B","H18A","D18A","H18E","D18E","H20N","D20N","H20B","D20B","H20A","D20A","H20E","D20E","H21N","D21N","H21B","D21B","H21A","D21A","H21E","D21E","H35N","D35N","H35B","D35B","H35A","D35A","H40N","D40N","H40B","D40B","H40A","D40A","H45N","D45N","H45B","D45B","H45A","D45A","H50N","D50N","H50B","D50B","H50A","D50A","H55N","D55N","H55B","D55B","H55A","D55A","H60N","D60N","H60B","D60B","H60A","D60A","H65N","D65N","H65B","D65B","H65A","D65A","H70N","D70N","H70B","D70B","H70A","D70A","H75N","D75N","H75B","D75B","H75A","D75A","H80N","D80N","H80B","D80B","H80A","D80A","H85N","D85N","H85B","D85B","H85A","D85A","H90N","D90N","H90B","D90B","H90A","D90A","H95N","D95N","H95B","D95B","H95A","D95A","HSN","DSN","HN1","DN1","HN2","DN2","HN3","DN3","Aberto C","Aberto L"]),angular.module("natura.tempos").factory("TimesManager",["$localForage",function(a){var b="atletas";return{all:function(){return a.getItem(b)},sync:function(c){return a.setItem(b,c)},destroy:function(){return a.removeItem(b)}}}]),angular.module("natura.tempos").controller("MainCtrl",["$scope","$timeout","ngTableParams","TimesManager","CATEGORIAS",function(a,b,c,d,e){a.selectOptions={width:"100%"},a.atletaChegada={numero:""},a.atletaSaida={numero:"",horario:""},a.novoAtleta={numero:"",categoria:e[0],saida:"",chegada:"",tempo:""},a.atletas={cadastrados:[]},a.categorias=e,a.addAtleta=function(){var b=_.find(a.atletas.cadastrados,{numero:a.novoAtleta.numero});angular.isDefined(b)?b.categoria=a.novoAtleta.categoria:a.atletas.cadastrados.push({numero:a.novoAtleta.numero,categoria:a.novoAtleta.categoria,saida:"",chegada:"",tempo:""}),d.sync(a.atletas.cadastrados).then(function(){a.novoAtleta.numero="",a.novoAtleta.categoria=e[0]}),a.tableParams.reload()},a.addSaida=function(){if(g(a.atletaSaida.horario))return f("A horário informado é inválido.");var b=h(a.atletaSaida.numero);return-1===b?f("O atleta "+a.atletaSaida.numero+" não está cadastrado no sistema."):(a.atletas.cadastrados[b].saida=moment(a.atletaSaida.horario+"00","HHmmss").format("HH:mm:ss"),void d.sync(a.atletas.cadastrados).then(function(){a.atletaSaida.numero="",a.atletaSaida.horario=""}))},a.addChegada=function(){var b=h(a.atletaChegada.numero);if(-1===b)return f("O atleta "+a.atletaSaida.numero+" não está cadastrado no sistema.");var c=a.atletas.cadastrados[b],e=moment();return e.isBefore(moment(c.saida,"HH:mm:ss"))?f("O horário de chegada é anterior ao horário de saída."):""===c.saida?f("O atleta não possui um horário de saída cadastrado."):(c.chegada=e.format("HH:mm:ss"),c.tempo=e.subtract(moment(c.saida,"HH:mm:ss")).format("HH:mm:ss"),void d.sync(a.atletas.cadastrados).then(function(){a.atletaChegada.numero=""}))},a.removeRecord=function(b){var c=_.findIndex(a.atletas.cadastrados,b);a.atletas.cadastrados.splice(c,1),d.sync(a.atletas.cadastrados),a.tableParams.reload()},a.destroy=function(){d.destroy().then(function(){a.atletas.cadastrados=[],a.tableParams.reload()})};var f=function(c){return b(function(){a.warningMessage=""},2500),a.warningMessage=c,c},g=function(a){return!moment(a,"HH:mm").isValid()},h=function(b){return _.findIndex(a.atletas.cadastrados,{numero:b})};d.all().then(function(b){a.atletas.cadastrados=b?b:[],a.tableParams.reload()}),a.tableParams=new c({page:1,count:10},{total:0,groupBy:"categoria",getData:function(b,c){c.total(a.atletas.cadastrados.length),b.resolve(a.atletas.cadastrados)}})}]);