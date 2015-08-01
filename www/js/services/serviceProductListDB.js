/**
 * Created by evertondecastro on 6/11/15.
 */
var app = angular.module('anotei');

app.service('serviceProductListDB', function(factoryDB, $q) {


    return {
        getProductListNext: function(typeQuery){
            var sqlQuery;
            var defer = $q.defer();

            var param = [];

            // adjust string of query to make mor precise research.....
            if (typeQuery.nome){
                try{
                    typeQuery.nome = typeQuery.nome.trim();
                }catch(e){
                    // do nothing....
                }
            }

            if(typeQuery.cat){

                sqlQuery = 'select p.*, c.id as idCarrinho from produtos p ' +
                    'left outer join carrinho c on c.cod_prod = p.cod_prod ' +
                    'where cod_cat = ?';
                param.push(typeQuery.cat);
            }
            if(typeQuery.nome){
                sqlQuery = 'select p.*, c.id as idCarrinho from produtos p ' +
                    'left outer join carrinho c on c.cod_prod = p.cod_prod ' +
                    'where nome like ?';
                var paramReady = '%'+typeQuery.nome+'%';
                param.push(paramReady);
            }

            // insert pagination engine...

            var resp = factoryDB.executeQuery(sqlQuery, param);

            resp.then(
                function (resultSet){
                    var listProd = [];
                    var i = 0;

                    /// trabalhar os dados....
                    for(i = 0; i < resultSet.rows.length; i++){
                        var row = {};

                        row.cod_prod = resultSet.rows.item(i).cod_prod;
                        row.codigo = resultSet.rows.item(i).codigo;
                        row.nome = resultSet.rows.item(i).nome;
                        row.cod_cat = resultSet.rows.item(i).cod_cat;
                        row.foto = resultSet.rows.item(i).foto;
                        row.foto_64 = resultSet.rows.item(i).foto_64;
                        row.descricao = resultSet.rows.item(i).descricao;
                        row.info_adicionais = resultSet.rows.item(i).info_adicionais;
                        row.metros_tecido = resultSet.rows.item(i).metros_tecido;
                        row.largura = resultSet.rows.item(i).largura;
                        row.altura = resultSet.rows.item(i).altura;
                        row.profundidade = resultSet.rows.item(i).profundidade;
                        row.diametro = resultSet.rows.item(i).diametro;
                        row.suspenso = resultSet.rows.item(i).suspenso;
                        row.idCarrinho = resultSet.rows.item(i).idCarrinho;

                        listProd.push(row);
                    }

                    // make sure restart pagination engine....
                    if (i == 0) {
                        $gserviceDatabase.setEndOfQuery();
                    }

                    defer.resolve(listProd);
                },

                // TODO: remove this...
                function (error){
                    alert(error);
                }
            );

            return defer.promise;

        }

    }
});