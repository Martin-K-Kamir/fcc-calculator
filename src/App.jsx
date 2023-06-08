import {useState} from "react";
import * as math from "mathjs";

export default function App() {
    const [outputView, setOutputView] = useState("0");
    const [formulaView, setFormulaView] = useState("");
    const inputs = [
        {id: "clear", value: "AC"},
        {id: "add", value: "+"},
        {id: "subtract", value: "-"},
        {id: "multiply", value: "*"},
        {id: "divide", value: "/"},
        {id: "equals", value: "="},
        {id: "decimal", value: "."},
        {id: "nine", value: "9"},
        {id: "eight", value: "8"},
        {id: "seven", value: "7"},
        {id: "six", value: "6"},
        {id: "five", value: "5"},
        {id: "four", value: "4"},
        {id: "three", value: "3"},
        {id: "two", value: "2"},
        {id: "one", value: "1"},
        {id: "zero", value: "0"},
    ];
    const operators = {
        AC: clear,
        "+": addOperator,
        "-": subtractOperator,
        "*": multiplyOperator,
        "/": divideOperator,
        "=": calculate,
    };

    function handleClick(value) {
        const operatorAction = operators[value];

        if (formulaView.includes("=")) {
            setFormulaView(outputView + value);
        } else if (operatorAction) {
            operatorAction(value);
            setOutputView(value);
        } else if (value === "=") {
            calculate();
        } else {
            setFormulaView(prevFormulaView => prevFormulaView + value);
            setOutputView(prevOutputView => prevOutputView === "0" ? value : prevOutputView + value);
        }
    }

    function clear() {
        setOutputView("0");
        setFormulaView("");
    }


    function addOperator(value) {
        if (formulaView.at(-1) === "+") {
            console.log('return')
            return;
        } else if (isOperator(value)) {
            console.log('slice')
            // setFormulaView(prevFormulaView => prevFormulaView.slice(0, -1) + value);
            setFormulaView(prevFormulaView => prevFormulaView + value);
        } else {
            console.log('add')
            setFormulaView(prevFormulaView => prevFormulaView + value);
        }
    }

    function subtractOperator(value) {
        if (lastOperator === "-") {
            return;
        } else if (isOperator(value)) {
            setFormulaView(prevFormulaView => prevFormulaView.slice(0, -1) + value);
        } else {
            setFormulaView(prevFormulaView => prevFormulaView + value);
        }
    }

    function multiplyOperator(value) {
        if (lastOperator === "*") {
            return;
        } else if (lastOperator && isOperator(value)) {
            setFormulaView(prevFormulaView => prevFormulaView.slice(0, -1) + value);
        } else {
            setFormulaView(prevFormulaView => prevFormulaView + value);
        }
    }

    function divideOperator(value) {
        if (lastOperator === "/") {
            return;
        } else if (isOperator(value)) {
            setFormulaView(prevFormulaView => prevFormulaView.slice(0, -1) + value);
        } else {
            setFormulaView(prevFormulaView => prevFormulaView + value);
        }
    }

    function isOperator(value) {
        return ["+", "-", "*", "/"].includes(value);
    }

    function calculate() {
        try {
            const result = math.evaluate(formulaView);
            setOutputView(result.toString());
            setFormulaView(prevFormulaView => prevFormulaView + "=" + result);
        } catch (error) {
            console.error("Error occurred during calculation:", error);
        }
    }

    function renderInputs() {
        return inputs.map(input => (
            <button key={input.id} id={input.id} onClick={() => handleClick(input.value)}>
                {input.value}
            </button>
        ));
    }

    return (
        <div className="container">
            <div className="calculator">
                <div className="calculator__view">
                    <div className="calculator__formula">{formulaView}</div>
                    <div id="display" className="calculator__output">{outputView}</div>
                </div>
                {renderInputs()}
            </div>
        </div>
    );
}
