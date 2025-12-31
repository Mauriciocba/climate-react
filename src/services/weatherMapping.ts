export function weatherCodeToText(code?: number) {
    if (code === undefined || code === null) return "Condición";
  
    if (code === 0) return "Despejado";
    if ([1, 2, 3].includes(code)) return "Parcialmente nublado";
    if ([45, 48].includes(code)) return "Niebla";
    if ([51, 53, 55].includes(code)) return "Llovizna";
    if ([61, 63, 65].includes(code)) return "Lluvia";
    if ([71, 73, 75, 77].includes(code)) return "Nieve";
    if ([80, 81, 82].includes(code)) return "Chubascos";
    if ([95, 96, 99].includes(code)) return "Tormenta";
  
    return "Condición";
  }
  