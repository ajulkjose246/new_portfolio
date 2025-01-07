const commands = {
    'help': 'Available commands: help, about, skills, projects, contact, social, education, resume',
    'about': 'Hi, I\'m Ajul K Jose\nA passionate Full Stack Developer from Kerala, India\nCurrently pursuing B.Tech in Computer Science at SJCET Palai',
    'skills': 'Frontend: HTML, CSS, JavaScript, React, Bootstrap\nBackend: PHP, Node.js, Express\nDatabase: MySQL, MongoDB\nOther: Git, Python, Java',
    'projects': '1. Attendance Management System\n2. E-Commerce Website\n3. Student Management System\n4. Portfolio Website\n\nType "project <number>" for more details',
    'contact': 'Email: ajulkjose@gmail.com\nPhone: +91 8921119320\nLocation: Kottayam, Kerala, India',
    'social': 'GitHub: github.com/ajulkjose\nLinkedIn: linkedin.com/in/ajul-k-jose\nInstagram: instagram.com/ajul_k_jose',
    'education': 'B.Tech in Computer Science (2020-2024)\nSt. Joseph\'s College of Engineering and Technology, Palai',
    'resume': 'Opening resume in new tab...'
};

// Add project details
const projectDetails = {
    '1': 'Attendance Management System\n- Built with PHP and MySQL\n- Features: Student tracking, Report generation\n- Role-based access control',
    '2': 'E-Commerce Website\n- MERN Stack application\n- Features: Product management, Cart system, Payment integration',
    '3': 'Student Management System\n- Developed using PHP and MySQL\n- Features: Student records, Grade management, Attendance tracking',
    '4': 'Portfolio Website\n- Built with React and Bootstrap\n- Features: Responsive design, Project showcase, Contact form'
};

const terminal = document.getElementById('terminal-body');
const currentCommand = document.getElementById('current-command');

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        processCommand(currentCommand.textContent);
        currentCommand.textContent = '';
    } else if (event.key === 'Backspace') {
        // Prevent the default backspace behavior
        event.preventDefault();
        // Remove the last character
        currentCommand.textContent = currentCommand.textContent.slice(0, -1);
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