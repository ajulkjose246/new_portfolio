const commands = {
    'help': 'Available commands:\n' +
           'help     - Show this help message\n' +
           'about    - About me\n' +
           'edu      - Education details\n' +
           'skills   - Technical skills\n' +
           'projects - List of projects\n' +
           'contact  - Contact information\n' +
           'social   - Social media links\n' +
           'clear    - Clear terminal',

    'about': '🚀 Hi, I\'m Ajul K Jose!\n\n' +
            'I am a versatile digital artisan with a passion for:\n' +
            '- Web Development\n' +
            '- Web Design\n' +
            '- Flutter Development\n\n' +
            'I orchestrate elegant symphonies of code, transforming concepts into interactive realities. ' +
            'As a Web Designer, I meticulously blend aesthetics with functionality, ensuring that each creation is a visual masterpiece. ' +
            'Fluttering into the mobile cosmos as a Flutter Developer, I craft apps that defy gravity, guided by the language of Dart.\n\n' +
            'Beyond the binary realm, you\'ll find me exploring analog wonders, sipping on creativity, and penning down thoughts that refuse to be confined. ' +
            'With HTML, CSS, JavaScript, and Flutter as my tools of choice, I embark on a continuous learning journey, always ready for the next big challenge.',

    'edu': 'Education:\n\n' +
           '🎓 2020 - Present | Integrated MCA\n' +
           'Amal Jyothi College Of Engineering, Kerala\n' +
           '- Currently pursuing integrated MCA program\n\n' +
           '📚 2018 - 2020 | PLUS ONE - PLUS TWO (Science)\n' +
           'GHSS Malappuram, Kerala\n\n' +
           '🏫 2017 - 2018 | SSLC\n' +
           'Crescent HSS Adakkakkundu High School, Malappuram, Kerala',

    'skills': 'Professional Skills:\n\n' +
             '💻 Development:\n' +
             '- Web Development\n' +
             '- User Interface Design\n' +
             '- Flutter Development\n\n' +
             '🔤 Languages:\n' +
             '- HTML, CSS, JavaScript\n' +
             '- Python, PHP, SQL\n' +
             '- C, C++\n' +
             '- BASH, Dart\n\n' +
             '🛠 Frameworks:\n' +
             '- Laravel\n' +
             '- Bootstrap',

    'projects': 'Major Projects:\n\n' +
                '📱 Mobile Apps:\n' +
                '1. Bit-Chat: Firebase-based chat application\n' +
                '2. Bit-Wall: Dynamic wallpaper app\n' +
                '3. Bit-Weather: AccuWeather API integration\n' +
                '4. Kerd: Flutter-based card management app\n\n' +
                '🌐 Web Applications:\n' +
                '1. Bolt-Stream: Movie streaming platform (Laravel & PHP versions)\n' +
                '2. CustRom: Custom ROM discovery platform\n' +
                '3. Parmas: Parish management system\n\n' +
                'Type "project <number>" for more details',

    'contact': 'Contact Information:\n\n' +
              '📧 Email: ajulkjose@gmail.com\n' +
              '📱 Phone: +91 8921119320\n' +
              '📍 Location: Kerala, India',

    'social': 'Social Media Links:\n\n' +
             '🔗 GitHub: github.com/ajulkjose\n' +
             '🔗 LinkedIn: linkedin.com/in/ajul-k-jose\n' +
             '🔗 Instagram: instagram.com/ajul_k_jose'
};

const projectDetails = {
    'bit-chat': 'Bit-Chat\n' +
                '- Android chat application\n' +
                '- Firebase Firestore integration\n' +
                '- Real-time messaging\n' +
                '- Secure communication',
    
    'bolt-stream': 'Bolt-Stream\n' +
                   '- Movie streaming platform\n' +
                   '- Available in Laravel and PHP versions\n' +
                   '- User-friendly interface\n' +
                   '- High-quality streaming capabilities',
    
    'custrom': 'CustRom\n' +
               '- Custom ROM discovery platform\n' +
               '- Available as web and Android versions\n' +
               '- Easy ROM downloading\n' +
               '- User-friendly interface'
};

const terminal = document.getElementById('terminal-body');
const currentCommand = document.getElementById('current-command');

const commandHistory = [];
let historyIndex = -1;

// Add paste event listener to the terminal
document.addEventListener('paste', function(event) {
    event.preventDefault();
    
    // Get the pasted text
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    
    // Add the pasted text to the current command
    currentCommand.textContent += pastedText;
});

// Update the keydown event listener to include Ctrl+V handling
document.addEventListener('keydown', function (event) {
    // Allow default behavior for Ctrl+V to enable paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
        return;
    }
    
    if (event.key === 'Enter') {
        const command = currentCommand.textContent;
        if (command.trim() !== '') {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
        processCommand(command);
        currentCommand.textContent = '';
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        currentCommand.textContent = currentCommand.textContent.slice(0, -1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            currentCommand.textContent = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentCommand.textContent = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            currentCommand.textContent = '';
        }
    } else if (event.key.length === 1) {
        currentCommand.textContent += event.key;
    }
});

function processCommand(cmd) {
    const command = cmd.toLowerCase().trim();

    if (command.startsWith('project ')) {
        const projectNum = command.split(' ')[1];
        if (projectDetails[projectNum]) {
            addLine(projectDetails[projectNum], 'output');
        } else {
            addLine('Project not found. Type "projects" to see available projects.', 'output');
        }
        return;
    }

    if (command === 'resume') {
        window.open('https://ajulkjose.in/resume.pdf', '_blank');
        addLine(commands[command], 'output');
        return;
    }

    // Add command to terminal
    addLine(`visitor@portfolio:~$ ${command}`);

    // Process command and show output
    if (commands.hasOwnProperty(command)) {
        addLine(commands[command], 'output');
    } else if (command === 'clear') {
        clearTerminal();
    } else if (command !== '') {
        addLine(`Command not found: ${command}. Type 'help' for available commands.`, 'output');
    }
}

function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    terminal.insertBefore(line, terminal.lastElementChild);
    
    // Smooth scroll to bottom
    terminal.scrollTo({
        top: terminal.scrollHeight,
        behavior: 'smooth'
    });
}

function clearTerminal() {
    while (terminal.children.length > 1) {
        terminal.removeChild(terminal.firstChild);
    }
} 