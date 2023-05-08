var produtos = [];
var produtoPopup = $('#produto-popup');
var produtoForm = $('#produto-form');

$(document).ready(function () {
    // Associa o evento de submit do formulário de adição de produto
    produtoForm.submit(function (event) {
        event.preventDefault();
        var produto = {
            id: $('#produto-id').val(),
            descricao: $('#produto-descricao').val(),
            valor: $('#produto-valor').val(),
            marca: $('#produto-marca').val()
        };
        salvarProduto(produto);
    });


    // Recupera a lista de produtos ao carregar a página
    listarProdutos();
});

// Recupera a lista de produtos do servidor e exibe na tabela
function listarProdutos() {
    $.ajax({
        type: "GET",
        url: "/api/v1/produtos",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: function (response) {
            produtos = response;
            renderizarProdutos();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao recuperar a lista de produtos: ' + error
            }).then((result) => {
                if (error == 'Unauthorized') {
                    window.location = '/';
                }
            });
        }
    });
}

// Renderiza a lista de produtos na tabela
function renderizarProdutos() {
    var tbody = $('#produtos-tbody');
    tbody.empty();
    for (var i = 0; i < produtos.length; i++) {
        var produto = produtos[i];
        var row = '<tr>' +
            '<td>' + produto.id + '</td>' +
            '<td>' + produto.descricao + '</td>' +
            '<td>' + produto.valor + '</td>' +
            '<td>' + produto.marca + '</td>' +
            '<td>' +
            '<button class="btn" onclick="editarProduto(' + produto.id + ')">Editar</button>' +
            '<button class="btn" onclick="excluirProduto(' + produto.id + ')">Excluir</button>' +
            '</td>' +
            '</tr>';
        tbody.append(row);
    }
}

// Exibe o formulário de adição de produto
function openProdutoPopup() {
    produtoForm.trigger('reset');
    $('#produto-form-title').text('Novo Produto');
    $('#produto-submit').text('Salvar');
    produtoPopup.css('display', 'block');
}

// Fecha o formulário de adição de produto
function closeProdutoPopup() {
    produtoPopup.css('display', 'none');
    $('#produto-id').val('');
}

// Salva ou atualiza um produto no servidor
function salvarProduto(produto) {
    let type = produto.id ? "PUT" : "POST";
    $.ajax({
        type: type,
        url: "/api/v1/produtos" + (produto.id ? "/" + produto.id : ""),
        data: JSON.stringify(produto),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: function (response) {
            let msg = type == 'POST' ? ' salvo ' : ' atualizado ';
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Produto' + msg + 'com sucesso!'
            }).then((result) => {
                listarProdutos();
                closeProdutoPopup();
            });
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao salvar o produto: ' + xhr.responseJSON.message
            }).then((result) => {
                if (error == 'Unauthorized') {
                    window.location = '/';
                }
            });
        }
    });
}

// Exclui um produto do servidor
function excluirProduto(id) {
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Deseja realmente excluir este produto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, apague!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: "/api/v1/produtos/" + id,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                success: function (response) {
                    listarProdutos();
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Erro ao excluir o produto: ' + xhr.responseJSON.message
                    }).then((result) => {
                        if (error == 'Unauthorized') {
                            window.location = '/';
                        }
                    });
                }
            });
        }
    })
}

// Edita um produto existente
function editarProduto(id) {
    var produto = produtos.find(function (p) {
        return p.id === id;
    });
    $('#produto-id').val(produto.id);
    $('#produto-descricao').val(produto.descricao);
    $('#produto-valor').val(produto.valor);
    $('#produto-marca').val(produto.marca);
    $('#produto-form-title').text('Editar Produto');
    $('#produto-submit').text('Atualizar');
    produtoPopup.css('display', 'block');
}
