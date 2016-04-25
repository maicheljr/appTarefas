// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','ui.mask'])

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

.controller('mainCtrl', function ($scope,$ionicPopup,$ionicListDelegate) {

  //controla o Título da Aplicação
  $scope.titulo = "ClienteON";
  // controla icone de deletar clientes
  $scope.deleteCLiente = false;

  //inverte a lógica do botão de deleteCLiente
  $scope.onClickRemoveCliente = function(){
    $scope.deleteCLiente = !$scope.deleteCLiente;
  }

})

.controller("ClienteCtrl", function($scope,$ionicPopup,$ionicListDelegate,$cordovaGeolocation,$cordovaToast) {

  $scope.showToast = function(message,duration,location){
    $cordovaToast.show(message,duration,location);
  }



  function getNovoCliente(item,novo ){

    $scope.data = {};
    $scope.data.nome=item.nome;
    $scope.data.telefone=item.telefone;
    $scope.data.endereco=item.endereco;
    $scope.data.uf=item.uf;
    $scope.data.cidade=item.cidade;
    $scope.data.date=item.date;
    $scope.data.lat = item.lat;
    $scope.data.lng = item.lng;

    /**/
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert( 'Não suporta GPS via Browser!!');
    }
    var latitude = '';
    var longitude = '';



    function showPosition(position) {

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      $scope.latitude = latitude.toFixed(5);
      $scope.longitude = longitude.toFixed(5);

      $ionicPopup.show({

        title:"<b>Novo Cliente<b>",
        scope:$scope,
        template:
        "<div class='list list-inset'>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Nome</span> <input type='text'placeholder='Nome completo' autofocus='true' ng-model='data.nome'>  </label>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Telefone</span><input type='tel' ui-mask='(99) 9999-9999?9' ng-model='data.telefone'>  </label> "+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Endereço</span><input type='text' placeholder='Av, Rua, nº'ng-model='data.endereco'>  </label>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>UF</span><input type='text' placeholder='RS'ng-model='data.uf'>  </label>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Cidade</span><input type='text' placeholder='Santa Marias'ng-model='data.cidade'>  </label>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Data</span><input  data-date-format='DD MMMM YYYY'type='date' ng-model='data.date'>  </label> "+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Latitude</span><input type='text' placeholder="+$scope.latitude+" ng-model='data.lat' ></input></label>"+
        " <label class='item item-input item-stacked-label'><span class='input-label'>Longitude</span><input type='text' placeholder="+$scope.longitude+" ng-model='data.lng'></input></label>"+
        " </div>",
        buttons:[
          {text:"<b>Salvar</b>",
          onTap: function (e){

            if($scope.data.nome  && $scope.data.telefone  && $scope.data.endereco  && $scope.data.uf && $scope.data.cidade){
              item.nome = $scope.data.nome;
              item.telefone = $scope.data.telefone;
              item.endereco = $scope.data.endereco;
              item.date = $scope.data.date;
              item.uf = $scope.data.uf;
              item.cidade = $scope.data.cidade;
              item.lat = $scope.latitude;
              item.lng =  $scope.longitude;

              if(novo){
                cliente.add(item);
                //$scope.showToast('Cliente cadastrado com sucesso!!!','long','center');
              }
              cliente.save();
              //$scope.showToast('Cliente editado com sucesso!!!','short','center');
            }else{
              alert("Há Campos vazios!!!");
              //$scope.showToast('Preencha todos os campos!!!','long','center');
            }
            //onClienteAdd();
          },

          type:"button-assertive"},

          {text:"<b>Sair</b>"}

        ]
      });

    }

    $ionicListDelegate.closeOptionButtons();
  };

  //criando o objeto cliente
  var cliente = new getCliente();
  //var pos = new getCoordenada();


  // criando uma lista q irá receber os clientes
  $scope.lista =  cliente.items;


  $scope.onClienteRemove = function(item){
    cliente.remove(item);
    cliente.save();
    $ionicListDelegate.closeOptionButtons();
  };

  //metodo que adiciona novos clientes
  $scope.onClienteAdd = function(){
    var item = {nome:"",telefone:"",endereco:"",uf:"",cidade:"",date:"",lat:"",lng:""};
    getNovoCliente(item,true);
    //alert("Lat: "+lat+"Lng: "+long);

  };

  $scope.onClienteEdit = function (item){
    getNovoCliente(item, false);
    cliente.save();
  }

  $scope.Upper = function(name){
    var nomeOut = name.toUpperCase(name);
    return nomeOut;
  };


})
.controller('MapCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform,$cordovaToast) {

  var cliente = new getCliente();
  $scope.listaCoordenadas =  cliente.items;

  $scope.showToast = function(message, duration, location) {
    $cordovaToast.show(message, duration, location).then(function(success) {

    }, function (error) {

    });
  }

  $scope.onMap = function(menu) {

    if (menu == 1){

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
        //console.log(err);
      });
    }

    // listando todos os clientes no mapa
    if (menu == 2){

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
        //alert("->" + $scope.lista.);

        for(i = 0;i < $scope.listaCoordenadas.length;i++){

          //alert($scope.listaCoordenadas[i].lat+","+$scope.listaCoordenadas[i].lng);
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.listaCoordenadas[i].lat,$scope.listaCoordenadas[i].lng),
            map: map,
            icon: 'img/marcador_32.png',
            draggable:true
          });

          $ionicLoading.hide();
          $scope.map = map;

        }// fim do for
        $ionicLoading.hide();

      }, function(err) {
        $ionicLoading.hide();
        //console.log(err);
      });
    }// fecha o menu 02
  } //fecha onMap;
})//fecha  controlLer

.controller('AgendaCtrl', function($scope,$ionicPopup,$ionicListDelegate,$ionicLoading){

  var cliente = new getCliente();
  var agenda = new getAgenda();

  $scope.listarCliente = cliente.items;
  $scope.listarAgenda = agenda.items;
  $scope.deleteAgenda = false;




  $scope.formatDate = function(date){
    var dateOut = new Date(date);
    return dateOut;
  };

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
    var item = {nome:"",date:"",hora:""};
    getNovaAgenda(item,true);
    //agenda.save();

  };

  $scope.onAgendaEdit = function (item){
    getNovaAgenda(item, false);
    agenda.save();
  };

  function getNovaAgenda(item,novo ){
    $scope.data = {};
    $scope.data.nome=item.nome;
    $scope.data.date=item.date;
    $scope.data.hora=item.hora;

    $ionicPopup.show({
      title:"<b>Novo Agendamento<b>",
      scope:$scope,
      template:"<div class='list list-inset'>"+
      "<label class='item item-input'><select ng-model='data.cliente' ng-options='item.nome for item in listarCliente track by  item.nome'>"+
      "<option value=''>{{item.nome}}</option></select></label>"+
      " <label class='item item-input'> <input type='text' placeholder='{{data.cliente.nome}}' ></label>"+
      " <label class='item item-input'> <input  data-date-format='DD MMMM YYYY'type='date' ng-model='data.date'>  </label> "+
      " <label class='item item-input'> <input type='text' ui-mask='99:9?9' ng-model='data.hora'>  </label> "+
      " </div>",
      buttons:[
        {text:"<b>Salvar</b>",
        onTap: function (e){
          if ($scope.data.cliente && $scope.data.date && $scope.data.hora) {
            item.nome = $scope.data.cliente.nome;
            item.date = $scope.data.date;
            item.hora = $scope.data.hora;
            if(novo){
              agenda.add(item);
            }
            agenda.save();
          }else{alert("Há Campos vazios!!!")}
        },
        type:'button-assertive'},
        {text:"<b>Cancelar</b>"}
      ]
    });
    $ionicListDelegate.closeOptionButtons();
  };




})
