function getAgenda(){
this.items = [];

var lista = localStorage.getItem("listaAgenda");

// se lista diferente de vazio pega os itens e monta no formato Json
if (lista !== null)
this.items = angular.fromJson(lista);

// salvar os itens
this.save = function (){

  var lista = angular.toJson(this.items);
  localStorage.setItem("listaAgenda",lista);

}
//adicionar item na lista de Agendamento
this.add = function(item){
  this.items.push(item);
};

//remover item da lista de Agendamentos
this.remove = function(item)  {
  var pos = this.items.indexOf(item);
  this.items.splice(pos,1);
};


}
