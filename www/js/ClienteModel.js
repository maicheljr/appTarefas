function getCliente(){
  this.items = [];

  var lista = localStorage.getItem("listaCliente");

  // se lista diferente de vazio pega os itens e monta no formato Json
  if (lista !== null)
  this.items = angular.fromJson(lista);

  // salvar os itens
  this.save = function (){

    var lista = angular.toJson(this.items);
    localStorage.setItem("listaCliente",lista);
  }

  //adicionar item na lista de cliente
  this.add = function(item){
    this.items.push(item);
  };

  //remover item da lista de clientes
  this.remove = function(item)  {
    var pos = this.items.indexOf(item);
    this.items.splice(pos,1);
  };
}
