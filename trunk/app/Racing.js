var socket = io.connect('http://127.0.0.1:8080');
var client_id;
var room_id;
socket.on('welcome', function(response) {
    client_id = response.data.client_id;
    console.log(response);
});

var Racing = {
    _request: function(action, params) {
        Racing[action](params);
    },
    _response: function(action, response) {
        if (response.code === 100000) {
            Racing[action]('response', response);
        }
    },
    verify: function() {
        var requestInfo = {
            client_id: client_id,
            control: 'auth',
            action: 'verify',
            data: {
                username: $('input[name=username]').val(),
                password: $('input[name=password]').val()
            }
        };
        socket.emit('request', requestInfo);
        return false;
    },
    join: function(roomId) {
        room_id = roomId;
        var requestInfo = {
            client_id: client_id,
            control: 'race',
            action: 'join',
            data: {
                room_id: room_id,
            }
        };
        socket.emit('request', requestInfo);
        return false;
    },
    playing: function(obj) {
        var requestInfo = {
            client_id: client_id,
            control: 'race',
            action: 'playing',
            data: {
                keyCode: (obj.charCode) ? obj.which : obj.keyCode,
                text_input: $.trim($('#typer').val()),
                room_id: room_id
            }
        };
        console.log(requestInfo.data);
        socket.emit('request', requestInfo);
        return false;
    },
    racing: function(step, player) {
        var cls = '.player-' + player;
        $(cls + ' .bg_car').animate({
            left: '+=' + step + '%'
        }, 100);
    },
    clearTyper: function() {
        $('#typer').val("");
    },
    setSpeed: function(speed, player) {
        var cls = '.player-' + player;
        $(cls + ' #speed-rate').text(speed);
    }
};
socket.on('verify', function(response) {
    if (response.code === 100000) {
        result = response.data.listRoom;
        for (index in result) {
            html = '<div class="item-room" onclick="Racing.join(' + result[index].id + ')">' + result[index].name + '<br /><small>' + result[index].desc + '</small></div>';
            $('#login').hide();
            $('#rooms').append(html);
        }
    } else {
        $('#login .error').html('Sai tên đăng nhập hoặc mật khẩu');
    }
});

socket.on('join', function(response) {
    if (response.code === 100000) {
        $('#typer-racing').html('');
        console.log(response);
        playerList = response.data.playerList;

        for (index in playerList) {
            player = playerList[index];
            if (player.id === client_id) {
                var html = '<div class="player-' + player.id + '" id="car">\n\
                        <div id="racer">\n\
                            <div class="bg_car car_' + player.data.carColor + '"><div class="player_name">Me</div></div>\n\
                            <div id="progress-bar"></div>\n\
                        </div>\n\
                        <div id="speed-clock">\n\
                            <div id="speed"><span>Tốc độ: <b>\n\
                            <span id="speed-rate">0</span></b> chữ/phút</span>\n\
                            </div>\n\
                        </div>\n\
                    </div>';
                $('#typer-racing').append(html);
            } else {
                var html = '<div class="player-' + player.id + '" id="car">\n\
                        <div id="racer">\n\
                            <div class="bg_car car_' + player.data.carColor + '"><div class="player_name">' + player.data.username + '</div></div>\n\
                            <div id="progress-bar"></div>\n\
                        </div>\n\
                        <div id="speed-clock">\n\
                            <div id="speed"><span>Tốc độ: <b>\n\
                            <span id="speed-rate">0</span></b> chữ/phút</span>\n\
                            </div>\n\
                        </div>\n\
                    </div>';
                $('#typer-racing').prepend(html);
            }
        }
        $('#rooms').hide();
        if (response.disconnect !== 1) {
            $('#race').show();
        }
    } else {
        $('#login .error').html('Sai tên đăng nhập hoặc mật khẩu');
    }
});

socket.on('playing', function(response) {
    if (response.code === 100000) {
        playerList = response.data.playerList;
        for (index in playerList) {
            console.log(playerList[index].data.dataPlayer);
            var dataPlayer = playerList[index].data.dataPlayer;
            if (dataPlayer.result === 1) {
                Racing.racing(dataPlayer.step, playerList[index].id);
                Racing.setSpeed(dataPlayer.speed, playerList[index].id);
                if (playerList[index].id === client_id) {
                    Racing.clearTyper();
                    $('#done').append(dataPlayer.plain_word + " ");
                    $('#target').html(dataPlayer.string_tmp[dataPlayer.i_count]);
                    $('#plain').html($('#plain').text().replace(dataPlayer.string_tmp[dataPlayer.i_count], ""));
                    $('#target').css({color: 'rgb(153, 204, 0)'});
                    $('#typer').css({background: 'none', color: 'gray'});

                }
            } else if (dataPlayer.result === 0) {
                if (playerList[index].id === client_id) {
                    $('#typer').css({background: 'red', color: 'white'});
                    $('#target').css({color: 'red'});
                }
            } else if (dataPlayer.result === 2) {
                if (playerList[index].id === client_id) {
                    $('#typer').attr('disabled', true);
                    $('#typer').val('Hoàn tất!');
                    $('#typer').css({background: 'rgb(153, 204, 0)', color: 'white'});
                }
            }

        }
    } else {
        $('#login .error').html('Sai tên đăng nhập hoặc mật khẩu');
    }
});

socket.on('disconnect', function(response) {
    if (response.code === 100000) {
        $('.player-' + response.data.client_id).hide();
    } else {
        $('#login .error').html('Sai tên đăng nhập hoặc mật khẩu');
    }
});