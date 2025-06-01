import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}


export function fCurrency(number) {
  if(number !== 0){
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedAmount = number ? formatter.format(number) : '';

    return result(formattedAmount, '.00');
  }
  else{
    return "0 €";
  }
}

export function fPercent(number) {

  if(number !== 0){
    const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

    return result(format, '.0');
  }
  else{
    return "0%"
  }
  
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
