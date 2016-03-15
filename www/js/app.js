// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.config(function ($ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('mainController', function ($scope,$ionicPopup,$ionicListDelegate) {

  //controla o Título da Aplicação
  $scope.titulo = "ClienteON";
  // controla icone de deletar clientes
  $scope.deleteCLiente = false;

  //inverte a lógica do botão de deleteCLiente
  $scope.onClickRemoveCliente = function(){
    $scope.deleteCLiente = !$scope.deleteCLiente;
  }

})

.controller("ClienteCtrl", function($scope,$ionicPopup,$ionicListDelegate,$cordovaGeolocation) {

  function getNovoCliente(item,novo ){
    $scope.data = {};
    $scope.data.nome=item.nome;
    $scope.data.telefone=item.telefone;
    $scope.data.endereco=item.endereco;


    /**/


    $ionicPopup.show({
      title:"<b>Novo Cliente<b>",
      scope:$scope,
      template:"<div class='list list-inset'>"+
      " <label class='item item-input'> <input type='text' placeholder='Nome' autofocus='true' ng-model='data.nome'>  </label>"+
      " <label class='item item-input'> <input type='tel' placeholder='Telefone'ng-model='data.telefone'>  </label> "+
      " <label class='item item-input'> <input type='text' placeholder='Endereco'ng-model='data.endereco'>  </label>"+
      " </div>",
      buttons:[
        {text:"<b>Salvar</b>",
        onTap: function (e){
          item.nome = $scope.data.nome;
          item.telefone = $scope.data.telefone;
          item.endereco = $scope.data.endereco;

          if(novo){
            cliente.add(item);
          }
          cliente.save();
        },
        type:'button-assertive'},
        {text:"<b>Cancelar</b>"}
      ]
    });
    $ionicListDelegate.closeOptionButtons();
  };

  //criando o objeto cliente
  var cliente = new getCliente();


  // criando uma lista q irá receber os clientes
  $scope.lista =  cliente.items;


  $scope.onClienteRemove = function(item){
    cliente.remove(item);
    cliente.save();
    $ionicListDelegate.closeOptionButtons();
  };

  //metodo que adiciona novos clientes
  $scope.onClienteAdd = function(){
    var item = {nome:"",telefone:"",endereco:"",latlng:""};
    getNovoCliente(item,true);

  };

  $scope.onClienteEdit = function (item){
    getNovoCliente(item, false);
    cliente.save();
  }

})
.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

  $scope.onMap = function() {

    $ionicLoading.show({
      template: '<ion-spinner class="spinner-assertive" icon="android"></ion-spinner><br/>Procurando Localização!'
    });

    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;

      var myLatlng = new google.maps.LatLng(lat, long);

      var mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions),
      marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                icon: 'img/marcador_32.png',
                draggable:true
          });

      $scope.map = map;
      $ionicLoading.hide();

    }, function(err) {
      $ionicLoading.hide();
      console.log(err);
    });
  }
})

.controller('AgendaCtrl', function($scope,$ionicPopup,$ionicListDelegate,$ionicLoading){

  var cliente = new getCliente();
  var agenda = new getAgenda();

  $scope.listarCliente = cliente.items;
  $scope.listarAgenda = agenda.items;
  $scope.deleteAgenda = false;


  $scope.onClickRemoveAgenda = function(){
    $scope.deleteAgenda = !$scope.deleteAgenda;
  }

  $scope.onAgendaRemove = function(item){
    agenda.remove(item);
    agenda.save();
    $ionicListDelegate.closeOptionButtons();
  };

  //metodo que adiciona novos clientes
  $scope.onAgendaAdd = function(){
    var item = {nome:"",date:""};
    getNovaAgenda(item,true);
    //agenda.save();

  };

  $scope.onAgendaEdit = function (item){
    getNovaAgenda(item, false);
    agenda.save();
  };

// ainda está bugggando
  $scope.onloadAgenda = function() {

    console.log('Atualizando!');
    $timeout( function() {
      //simulate async response
      $scope.listaCliente.push();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    }, 1000);

  };



    function getNovaAgenda(item,novo ){
      $scope.data = {};
      $scope.data.nome=item.nome;
      $scope.data.date=item.date;

      $ionicPopup.show({
        title:"<b>Novo Agendamento<b>",
        scope:$scope,
        template:"<div class='list list-inset'>"+
        "<select ng-model='data.selected' ng-options='item.nome for item in listarCliente track by item.nome'>"+
        "<option value=''>{{item.nome}}</option></select>"+
        " <label class='item item-input'> <input type='text' placeholder='{{selected.nome}}' autofocus='true' ></label>"+
        " <label class='item item-input'> <input type='date' placeholder='Data'ng-model='data.date'>  </label> "+
        " </div>",
        buttons:[
          {text:"<b>Salvar</b>",
          onTap: function (e){
            item.nome = $scope.data.selected.nome;
            item.date = $scope.data.date;
            if(novo){
              agenda.add(item);
            }
            agenda.save();
          },
          type:'button-assertive'},
          {text:"<b>Cancelar</b>"}
        ]
      });
      $ionicListDelegate.closeOptionButtons();
    };




  })
