$(document).ready(function () {
    $('.message a').click(function () {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    });

    $('.register-btn').click(function () {
        var data = {
            nome: $('input[name=name]').val(),
            login: $('input[name=username]').val(),
            senha: $('input[name=password]').val(),
            email: $('input[name=email]').val()
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/seguranca/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Account created successfully!'
                }).then((result) => {
                    localStorage.setItem('token', response.token);
                    window.location.href = "/produtos.html";
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error creating account: ' + xhr.responseJSON.message
                }).then((result) => {
                    if (error == 'Unauthorized') {
                        window.location = '/';
                    }
                });
            }
        });
    });

    $('.login-btn').click(function () {
        var data = {
            login: $('input[name=username]').val(),
            senha: $('input[name=password]').val()
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/seguranca/login",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'Logged in successfully!'
                }).then((result) => {
                    localStorage.setItem('token', response.token);
                    window.location.href = "/produtos.html";
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error logging in: ' + xhr.responseJSON.message
                }).then((result) => {
                    if (error == 'Unauthorized') {
                        window.location = '/';
                    }
                });
            }
        });
    });
});
