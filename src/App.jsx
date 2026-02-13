import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault()
      
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key)
      } else if (e.key === '.') {
        inputDecimal()
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key)
      } else if (e.key === 'Enter' || e.key === '=') {
        performOperation('=')
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll()
      } else if (e.key === 'Backspace') {
        backspace()
      } else if (e.key === '%') {
        inputPercent()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, previousValue, operation, waitingForOperand])

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (waitingForOperand) return
    
    const newDisplay = display.slice(0, -1)
    setDisplay(newDisplay === '' ? '0' : newDisplay)
  }

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1
    setDisplay(String(newValue))
  }

  const inputPercent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const formatDisplay = (value) => {
    // Handle very long numbers
    if (value.length > 12) {
      const num = parseFloat(value)
      if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6)
      }
    }
    return value
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          {formatDisplay(display)}
        </div>
        
        <div className="keypad">
          <button className="function-key" onClick={clearAll}>AC</button>
          <button className="function-key" onClick={toggleSign}>±</button>
          <button className="function-key" onClick={inputPercent}>%</button>
          <button className="operator-key" onClick={() => performOperation('/')}>÷</button>
          
          <button className="number-key" onClick={() => inputDigit(7)}>7</button>
          <button className="number-key" onClick={() => inputDigit(8)}>8</button>
          <button className="number-key" onClick={() => inputDigit(9)}>9</button>
          <button className="operator-key" onClick={() => performOperation('*')}>×</button>
          
          <button className="number-key" onClick={() => inputDigit(4)}>4</button>
          <button className="number-key" onClick={() => inputDigit(5)}>5</button>
          <button className="number-key" onClick={() => inputDigit(6)}>6</button>
          <button className="operator-key" onClick={() => performOperation('-')}>−</button>
          
          <button className="number-key" onClick={() => inputDigit(1)}>1</button>
          <button className="number-key" onClick={() => inputDigit(2)}>2</button>
          <button className="number-key" onClick={() => inputDigit(3)}>3</button>
          <button className="operator-key" onClick={() => performOperation('+')}>+</button>
          
          <button className="number-key zero" onClick={() => inputDigit(0)}>0</button>
          <button className="number-key" onClick={inputDecimal}>.</button>
          <button className="operator-key" onClick={() => performOperation('=')}>=</button>
        </div>
      </div>
      
      <div className="keyboard-hint">
        💡 Tip: You can use your keyboard too!
      </div>
    </div>
  )
}

export default App
