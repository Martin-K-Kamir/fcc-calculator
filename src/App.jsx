import {useEffect, useState} from "react";
import * as math from "mathjs";

const buttons = [
    {id: 'ce', value: 'CE'},
    {id: "clear", value: "AC"},
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

// The expression 3 + 5 * 6 - 2 / 4 should produce 32.5 or 11.5 as an
//           answer, depending on the logic your calculator uses

export default function App() {
    const [output, setOutput] = useState('0');
    const [entry, setEntry] = useState('');
    const [lastOperator, setLastOperator] = useState(null);
    const [lastValue, setLastValue] = useState(null);

    function handleClick(value) {
        setLastValue(value)

        if (value === 'AC') {
            clearAll();
            return;
        }

        if (value === 'CE') {
            clearEntry();
            return;
        }

        if (value === 'del') {
            deleteLast();
            return;
        }

        if (value === '=') {
            calculate(value);
            return;
        }

        if (lastValue === '=') {
            setEntry('');
            setOutput(value);
            return;
        }

        if (isOperator(lastValue) && isOperator(value)) {
            setLastOperator(value);
            setEntry(prevEntry => prevEntry.slice(0, -1) + value);
            return;
        }

        if (isNumber(value)) {
            if (isOperator(lastValue)) {
                if (value === '.') {
                    setOutput('0.');
                    return;
                }

                setOutput(value);
                return;
            }

            if (value === '.' && output.includes('.')) {
                return;
            }

            if (value === '.') {
                setOutput(prevOutput => prevOutput + value);
                return;
            }

            setOutput(prevOutput => prevOutput === '0' ? value : prevOutput + value);
            return;
        }

        if (isOperator(value)) {
            setLastOperator(value)

            if (includesOperator(entry)) {
                calculate(value);
                return;
            }
            console.log("output", output, value)
            console.log("output", output.includes('0.') && isOperator(value))
            if (output.includes('0.') && isOperator(value)) {
                setOutput('0');
                setEntry(prevEntry => prevEntry + '0' + value);
                return;
            }

            setEntry(prevEntry => prevEntry + output + value);
            return;
        }
    }

    function clearAll() {
        setOutput('0');
        setEntry('');
        setLastOperator(null);
        setLastValue(null);
    }

    function clearEntry() {
        setOutput('0');
    }

    function deleteLast() {
        setOutput(prevOutput => {
            return prevOutput.length === 1 ? '0' : prevOutput.slice(0, -1);
        });
    }

    function isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }

    function includesOperator(value) {
        const operators = ['+', '-', '*', '/'];

        return operators.some(operator => value.includes(operator));
    }

    function isNumber(value) {
        return !isNaN(value) || value === '.';
    }

    function calculate(operator) {
        try {
            const result = math.evaluate(entry + output);
            setOutput(result);


            if (operator === '=') {
                setEntry(prevEntry => {
                    console.log("prevEntry", prevEntry)
                    return prevEntry + output + operator;
                });
            } else {
                setEntry(`${result}${operator}`);
            }

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
                    <div id="display" className="calculator__output">{output}</div>
                </div>
                {renderButtons()}
            </div>
        </div>
    );
}
