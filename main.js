const reset_instruction_text = '<div class="instruction">(กดแอ็คชั่นเพื่อเริ่มเล่นใหม่)</div>';

let charge = 0;
let charge_button = document.getElementById('charge-button');
let charge_number = document.getElementById('charge-number');

let round = 0;
let log = document.getElementById('log');
let reset_log = false;

let scores = {
  'human': 0,
  'bot': 0
}
let human_emoji= document.getElementById('human-emoji');
let human_score = document.getElementById('human-score');
let bot_score = document.getElementById('bot-score');

update_buttons();

function update(human) {
  round++;

  let bot = bot_action();

  switch(human) {
    case 'charge':
      charge++
      break;
    case 'block':
      break;
    case 'attack':
      if (charge <= 0) {
        return;
      } else {
        charge--;
      }
      break;
    default: break;
  }
  update_buttons();

  let log_text = `<div><span class='round'>รอบที่ ${round}:</span> 🙂 ${translate_text(human)} vs ${translate_text(bot)} 🤖</div>`;
  if (reset_log) {
    log.innerHTML = log_text;
    reset_log = false;
  } else {
    log.insertAdjacentHTML('afterbegin', log_text);
  }

  if (human === 'attack' && bot === 'charge') {
    scores['human']++;
    human_score.innerHTML = scores['human'];

    log.insertAdjacentHTML('afterbegin', '<div class="announcement">มนุษย์ชนะ! 🎉</div>' + reset_instruction_text);
  }
  if (human === 'charge' && bot === 'attack') {
    scores['bot']++;
    bot_score.innerHTML = scores['bot'];

    log.insertAdjacentHTML('afterbegin', '<div class="announcement">บอตครองโลก! 🦾</div>' + reset_instruction_text);
  }
  if ((human === 'attack' && bot === 'charge') || (human === 'charge' && bot === 'attack')) {
    const game_num = scores['human'] + scores['bot'];
    // const diff = scores['human'] - scores['bot'];
    const ratio =  scores['human'] / game_num;
    // if (game_num >= 10) {
    if (ratio > 0.9) {
      human_emoji.innerHTML = '🥳';
    } else if (ratio > 0.8) {
      human_emoji.innerHTML = '😆';
    } else if (ratio > 0.7) {
      human_emoji.innerHTML = '😁';
    } else if (ratio > 0.6) {
      human_emoji.innerHTML = '😄';
    } else if (ratio > 0.5) {
      human_emoji.innerHTML = '🙂';
    } else if (ratio > 0.4) {
      human_emoji.innerHTML = '😅';
    } else if (ratio > 0.3) {
      human_emoji.innerHTML = '🤨';
    } else if (ratio > 0.2) {
      human_emoji.innerHTML = '😔';
    } else if (ratio > 0.1) {
      human_emoji.innerHTML = '😩';
    } else {
      human_emoji.innerHTML = '🥺';
    }
    // }

    reset_game();
  }
}

function update_buttons() {
  charge_number.innerHTML = charge;
  if (charge <= 0) {
    charge_button.classList.add('disabled');
  } else {
    charge_button.classList.remove('disabled');
  }
}

function reset_game() {
  charge = 0;
  bot_charge = 0;
  update_buttons();

  round = 0;
  reset_log = true;
}

function translate_text(action) {
  switch(action) {
    case 'charge': return 'ชาร์จ';
    case 'block': return 'กัน';
    case 'attack': return 'ปล่อยพลัง';
    default: return '';
  }
}

function pick_random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let bot_charge = 0;
function bot_action() {
  let action;
  if (round === 1) { // always charge on the first round
    action = 'charge';
  } else if (charge === 0) { // if human has no charge (public information), do not block
    if (bot_charge > 0) {
      action = pick_random(['charge', 'attack']);
    } else { // a player cannot attack if there is no charge
      action = 'charge';
    }
  } else {
    if (bot_charge > 0) {
      action = pick_random(['charge', 'block', 'attack']);
    } else { // a player cannot attack if there is no charge
      action = pick_random(['charge', 'block']);
    }
  }

  switch(action) {
    case 'charge':
      bot_charge++
      break;
    case 'block':
      break;
    case 'attack':
      bot_charge--;
      break;
    default: break;
  }

  return action;
}