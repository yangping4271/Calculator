class Calculator {
    constructor() {
        this.displayElement = document.querySelector('.display-text');
        this.currentOperand = '0';
        this.previousOperand = null;
        this.operation = null;
        this.waitingForNewOperand = false;
        this.initializeButtons();
    }

    initializeButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    handleButtonClick(button) {
        if (button.dataset.number !== undefined) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
    }

    handleKeyPress(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.inputNumber(e.key);
        } else if (e.key === '.') {
            this.handleAction('decimal');
        } else if (e.key === '+') {
            this.handleAction('add');
        } else if (e.key === '-') {
            this.handleAction('subtract');
        } else if (e.key === '*') {
            this.handleAction('multiply');
        } else if (e.key === '/') {
            e.preventDefault();
            this.handleAction('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.handleAction('equals');
        } else if (e.key === 'Escape') {
            this.handleAction('clear');
        } else if (e.key === 'Backspace') {
            this.handleAction('delete');
        }
    }

    inputNumber(number) {
        if (this.waitingForNewOperand) {
            this.currentOperand = number;
            this.waitingForNewOperand = false;
        } else {
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = null;
        this.operation = null;
        this.waitingForNewOperand = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForNewOperand) {
            this.currentOperand = '0.';
            this.waitingForNewOperand = false;
        } else if (this.currentOperand.indexOf('.') === -1) {
            this.currentOperand += '.';
        }
        this.updateDisplay();
    }

    setOperation(nextOperation) {
        if (this.previousOperand === null) {
            this.previousOperand = this.currentOperand;
        } else if (this.operation) {
            const result = this.performCalculation();
            this.currentOperand = String(result);
            this.previousOperand = String(result);
            this.updateDisplay();
        }

        this.waitingForNewOperand = true;
        this.operation = nextOperation;
    }

    calculate() {
        if (this.previousOperand === null || this.operation === null || this.waitingForNewOperand) {
            return;
        }

        const result = this.performCalculation();
        this.currentOperand = String(result);
        this.previousOperand = null;
        this.operation = null;
        this.waitingForNewOperand = true;
        this.updateDisplay();
    }

    performCalculation() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) {
            return 0;
        }

        switch (this.operation) {
            case 'add':
                return this.add(prev, current);
            case 'subtract':
                return this.subtract(prev, current);
            case 'multiply':
                return this.multiply(prev, current);
            case 'divide':
                return this.divide(prev, current);
            default:
                return current;
        }
    }

    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            alert('错误：不能除以零！');
            return 0;
        }
        return a / b;
    }

    updateDisplay() {
        const displayValue = this.formatDisplayValue(this.currentOperand);
        this.displayElement.textContent = displayValue;
    }

    formatDisplayValue(value) {
        const number = parseFloat(value);
        
        if (isNaN(number)) {
            return '0';
        }

        if (value.toString().length > 12) {
            if (number < 1 && number > -1) {
                return number.toFixed(8);
            } else {
                return number.toExponential(6);
            }
        }

        return value;
    }
}

const calculator = new Calculator();