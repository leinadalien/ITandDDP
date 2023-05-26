export function showWinWindow(){
    let close_modal = document.getElementById('close_modal');
    let modal = document.getElementById('modal');
    let body = document.getElementsByTagName('body')[0];
    modal.classList.add('modal_vis'); // добавляем видимость окна// удаляем эффект закрытия
    body.classList.add('body_block');
    close_modal.onclick = function() { // клик на закрытие// добавляем эффект закрытия
        modal.classList.remove('modal_vis');
        body.classList.remove('body_block');
    };
}



