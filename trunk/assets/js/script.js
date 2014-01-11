var i_count = 0;
var j_count = 0;
var right_word = "";
var string_tmp = "";
var string_plain = "Có một con đường mang tên là tình yêu, khi tôi bước một mình đếm những nỗi cô đơn đếm trong từng làn gió thoảng đếm trong từng hạt mưa bay đến đây từng tia nắng sớm mai đến khi ngàn ánh sao rơi trong bóng đêm.";
var string_length = string_plain.length;
var text_input_length = 0;
var clear = false;
var start_time = "";
var step = 0;

$(function() {
    $('#typer').focus();
    var date = new Date();
    start_time = (date.getTime() / 1000);
    string_tmp = string_plain.split(" ");
    step = 65 / string_tmp.length;    
});
function typer(obj) {
    var keyCode = (obj.charCode) ? obj.which : obj.keyCode;
    var plain_word = string_tmp[i_count];
    var input_word = String.fromCharCode(keyCode);
    console.log("Input: " + input_word);
    console.log("Plain: " + plain_word);
    console.log("Plain char: " + plain_word[j_count]);
    console.log("Words: " + string_tmp.length);
    console.log("Step: " + step);
    if (plain_word[j_count] === input_word) {
        console.log("Print: " + input_word);
        right_word += input_word;
        j_count++;
    }
    console.log(right_word);
    console.log("Key code: " + keyCode);
    if (keyCode === 32) {
        var text_input = $.trim($('#typer').val());
        if (plain_word.length === j_count && plain_word === text_input) {
            obj.preventDefault();
            clear_typer();
            j_count = 0;
            right_word = "";
            text_input_length += (plain_word.length + 1); // count space bar
            i_count++;

            var time = new Date();
            var current_time = (time.getTime() / 1000);
            var speed = parseInt((i_count / (current_time - start_time)) * 60);
            $('#speed-rate').text(speed);

            if (string_length === (text_input_length - 1)) {
                $('#typer').attr('disabled', true);
                $('#typer').val('Hoàn tất!');
                $('#typer').css({background: 'rgb(153, 204, 0)', color: 'white'});
            } else {
                racing(step);
                $('#done').append(plain_word + " ");
                $('#target').html(string_tmp[i_count]);
                $('#plain').html($('#plain').text().replace(string_tmp[i_count], ""));
                $('#typer').css({background: 'none', color: 'gray'});
                $('#target').css({color: 'rgb(153, 204, 0)'});
            }
        } else {
            $('#typer').css({background: 'red', color: 'white'});
            $('#target').css({color: 'red'});
        }
    }

    if (keyCode === 46) {
        var text_input_end = $.trim($('#typer').val());
        if (string_length === (text_input_length + text_input_end.length + 1)) {
            $('#typer').attr('disabled', true);
            $('#typer').val('Hoàn tất!');
            $('#typer').css({background: 'rgb(153, 204, 0)', color: 'white'});
        }
    }

    console.log("String length: " + string_length);
    console.log("Text input length:" + text_input_length);
    console.log("i: " + i_count);
    console.log("j: " + j_count);
    console.log("======================");
}

function racing(step) {
    $('.bg_car').animate({
        left: '+='+step+'%'
    }, 100);
}

function clear_typer(obj) {
    $('#typer').val("");
}