function calculateBmi(heightCm: number, weightKg: number): string {
    const heightM = heightCm / 100.0;
    const bmi = weightKg / (heightM * heightM);
    if (bmi < 18.5)
        return "Underweight";
    if (bmi < 25)
        return "Normal (healthy weight)";
    if (bmi < 30)
        return "Overweight";
    return "Obese";
}

console.log(calculateBmi(180, 74))
