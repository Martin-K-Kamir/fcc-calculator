import {useState} from "react";
import * as math from "mathjs";

const buttons = [
    {id: 'clear', value: 'AC'},
    {id: "del", value: "DEL"},
    {id: "divide", value: "/"},
    {id: "seven", value: "7"},
    {id: "eight", value: "8"},
    {id: "nine", value: "9"},
    {id: "multiply", value: "*"},
    {id: "four", value: "4"},
    {id: "five", value: "5"},
    {id: "six", value: "6"},
    {id: "subtract", value: "-"},
    {id: "one", value: "1"},
    {id: "two", value: "2"},
    {id: "three", value: "3"},
    {id: "add", value: "+"},
    {id: "zero", value: "0"},
    {id: "decimal", value: "."},
    {id: "equals", value: "="},
];

export default function App() {
    const [output, setOutput] = useState('');
    const [entry, setEntry] = useState('');
    const [lastValue, setLastValue] = useState('');

    function handleClick(value) {
        setLastValue(value)

        if (value === '0' && lastValue === '0') return;
        if (value === '.' && lastValue === '.') return;
        if (isOperator(value) && isOperator(lastValue) && lastValue === value) return;

        if (lastValue === '=' && isOperator(value)) {
            setOutput(value);
            setEntry(output + value);
            return;
        }

        if (lastValue === '=' && isNumber(value)) {
            setOutput(value);
            setEntry(value);
            return;
        }

        if (value === '=') {
            calculate();
            return;
        }

        if (value === 'AC') {
            clearAll();
            return;
        }

        if (value === 'DEL') {
            clearLastEntry();
            return;
        }

        if (isOperator(value) && isOperator(lastValue) && lastValue !== value) {
            if (value === '-') {
                setOutput(value);
                setEntry(prevEntry => prevEntry + value);
                return;
            }

            if (lastValue === '-') {
                setEntry(prevEntry => prevEntry.slice(0, -2) + value)
                setOutput(value);
                return;
            }

            setOutput(value);
            setEntry(entry.slice(0, -1) + value);
            return;
        }

        if (isNumber(value)) {
            if (value === '.' && (lastValue === '.' || lastValue === '')) {
                value = '0.';
            }

            if (entry.includes('.')) {
                const lastNumber = entry.split(/[-+*/]/).pop();
                if (lastNumber.includes('.') && value === '.') return;
            }

            setOutput(prevOutput => isOperator(prevOutput) ? value : prevOutput + value);
            setEntry(prevEntry => prevEntry + value);
            return;
        }

        if (isOperator(value)) {
            setOutput(value);
            setEntry(prevEntry => prevEntry + value);
        }
    }

    function clearAll() {
        setOutput('');
        setEntry('');
    }
    function clearLastEntry() {
        setOutput(prevOutput => prevOutput.slice(0, -1));
        setEntry(prevEntry => prevEntry.slice(0, -1));
    }

    function isNumber(value) {
        return !isNaN(value) || value === '.';
    }

    function isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }

    function calculate() {
        try {
            const result = math.evaluate(entry);
            setOutput(result);
            setEntry(prevEntry => prevEntry + '=' + result)


        } catch (error) {
            console.error("Error occurred during calculation:", error);
        }
    }

    function renderButtons() {
        return buttons.map(button => (
            <button key={button.id} id={button.id} onClick={() => handleClick(button.value)}>
                {button.value}
            </button>
        ));
    }

    return (
        <div className="container">
            <div className="calculator">
                <div className="calculator__view">
                    <div className="calculator__formula">{entry}</div>
                    <div id="display" className="calculator__output">{output ? output : 0}</div>
                </div>
                {renderButtons()}
            </div>
        </div>
    );
}
