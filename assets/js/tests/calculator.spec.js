const calculator = require('../calculator.js');
const calculateExpression = calculator.calculateExpression;

describe("Calculator", () => {
    test("basic addition", () => {
        expect(calculateExpression("2+3")).toBe(5);
    });
    test("negative number at start", () => {
        expect(calculateExpression("-2+3")).toBe(1);
    });
    test("negative result", () => {
        expect(calculateExpression("2-5")).toBe(-3);
    });
    test("priority operation", () => {
        expect(calculateExpression("2+3*4")).toBe(14);
    });
    test("division and subtraction", () => {
        expect(calculateExpression("10/2-3")).toBe(2);
    });
    test("sqrt", () => {
        expect(calculateExpression("√9+1")).toBe(4);
    });
    test("complex mix", () => {
        expect(calculateExpression("22*5-3/2")).toBe(108.5);
    });
    test("invalid sqrt", () => {
        expect(calculateExpression("√-9")).toBe("ERROR");
    });
    test("division by zero", () => {
        expect(calculateExpression("5/0")).toBe("ERROR");
    });
    test("negative number after multiplication", () => {
        expect(calculateExpression("5*-2")).toBe(-10);
    });
    test("negative inside sqrt", () => {
        expect(calculateExpression("√-16")).toBe("ERROR");
    });
    test("nested negative result", () => {
        expect(calculateExpression("-2*-3")).toBe(6);
    });
    test("power operation", () => {
        expect(calculateExpression("2^3")).toBe(8);
    });
    test("multiple operations", () => {
        expect(calculateExpression("2+3*4-5^2/2")).toBe(1.5);
    });
    test("all operations combined", () => {
        expect(calculateExpression("√16+2^3-5*2/4")).toBe(9.5);
    });
    test("implicit multiplication", () => {
        expect(calculateExpression("2(3+4)")).toBe(14);
    });
    test("implicit multiplication with parentheses", () => {
        expect(calculateExpression("(2+3)(4+5)")).toBe(45);
    });
    test("implicit multiplication with pi", () => {
        expect(calculateExpression("2π")).toBeCloseTo(6.283185307179586);
    });
    test("implicit multiplication with negative number", () => {
        expect(calculateExpression("-2(3+4)")).toBe(-14);
    });
    test("implicit multiplication with negative number and parentheses", () => {
        expect(calculateExpression("(-2+3)(4+5)")).toBe(9);
    });
    test("implicit multiplication with negative square root", () => {
        expect(calculateExpression("√(-9)")).toBe("ERROR");
    });
    test("implicit multiplication with negative pi", () => {
        expect(calculateExpression("-2π")).toBeCloseTo(-6.283185307179586);
    });
    test("double operators", () => {
        expect(calculateExpression("2++3")).toBe("ERROR");
        expect(calculateExpression("2**3")).toBe("ERROR");
    });
    test("decimal addition", () => {
        expect(calculateExpression("2.5+3.1")).toBeCloseTo(5.6);
    });
    test("negative base and exponent in power", () => {
        expect(calculateExpression("-2^-3")).toBeCloseTo(-0.125);
    });
    test("square root of expression", () => {
        expect(calculateExpression("√(4+5)")).toBe(3);
    });

});