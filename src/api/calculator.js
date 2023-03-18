import scale from './scale.json';

const roundOffToNearestTen = (number) => {
    return (number%10 >= 5) ? Math.ceil(number/10) * 10 : Math.floor(number/10) * 10;
}

const calculateNutritionAmount = (metrics, breakfast, prices) => {
    console.log('ENTER CALCULATOR')
    let prices_reworked = {}
    prices.forEach(item => {
        prices_reworked[item.item] = item.price;
    })
    // translate old results into temp and then work
    let results = [];
    let temp = {};
    let lastTemp = {};
    let days = metrics.days;
    let adjustments = metrics.adjustments ? metrics.adjustments : null;

    if (metrics.days != -1) {
        // We doing days based calculation
        console.log('DAYS BASED CALC');
        const days_arr = [...Array(metrics.days).keys()];
        Object.keys(scale).forEach(key => {
            days_arr.forEach( day => {
                scale[key][day%6]['midday'].forEach( item => {
                    switch (key) {
                        case 'pregnantNursing':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.pregnantCount : item['amount'] * metrics.pregnantCount;
                            break;
                        case '6mTo3y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.sixtothreeCount : item['amount'] * metrics.threetosixCount;
                            break;
                        case '3yTo6y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.threetosixCount : item['amount'] * metrics.threetosixCount;
                            break;
                    }
                });
                scale[key][day%6]['breakfast'].forEach( item => {
                    switch (key) {
                        case 'pregnantNursing':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.pregnantCount : item['amount'] * metrics.pregnantCount;
                            break;
                        case '6mTo3y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.sixtothreeCount : item['amount'] * metrics.threetosixCount;
                            break;
                        case '3yTo6y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.threetosixCount : item['amount'] * metrics.threetosixCount;
                            break;
                    }
                });
            });
        });
        lastTemp = temp;
        adjustments = null;
    }
    else {
        // We doing money based calculation
        console.log('MONEY BASED CALC');
        const totalMoney = metrics.money;
        let day = 0;
        let increment = true;
        let finalPrice = 0;
        let lastPrice = 0;
        while(increment === true) {
            Object.keys(scale).forEach(key => {
                scale[key][day%6]['midday'].forEach( item => {
                    switch (key) {
                        case 'pregnantNursing':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.pregnantCount : item['amount'] * metrics.pregnantCount;
                            break;
                        case '6mTo3y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.sixtothreeCount : item['amount'] * metrics.sixtothreeCount;
                            break;
                        case '3yTo6y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.threetosixCount : item['amount'] * metrics.threetosixCount;
                            break;
                    }
                });
                scale[key][day%6]['breakfast'].forEach( item => {
                    switch (key) {
                        case 'pregnantNursing':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.pregnantCount : item['amount'] * metrics.pregnantCount;
                            break;
                        case '6mTo3y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.sixtothreeCount : item['amount'] * metrics.sixtothreeCount;
                            break;
                        case '3yTo6y':
                            temp[item['item']] = temp[item['item']] ? temp[item['item']] + item['amount'] * metrics.threetosixCount : item['amount'] * metrics.threetosixCount;
                            break;
                    }
                });
            });
            Object.keys(temp).forEach(tempKey => {
                finalPrice += roundOffToNearestTen(temp[tempKey]) * prices_reworked[tempKey]/1000;
            });
            if (finalPrice > totalMoney) {
                let diff = totalMoney - lastPrice;
                if (diff != 0) {
                    adjustments = {};
                    adjustments['Channa'] = ((diff*500)/prices_reworked.Channa).toFixed(2);
                    adjustments['Moongi'] = ((diff*500)/prices_reworked.Moongi).toFixed(2);
                    console.log(adjustments.Channa, ' - ', adjustments.Moongi)
                }
                increment = false;
                days = day;
            }
            else {
                lastPrice = finalPrice;
                finalPrice = 0;
                Object.assign(lastTemp, temp);
                day+=1;
            }
        };

    };
    console.log(lastTemp);
    Object.keys(lastTemp).forEach(tempKey => {
        results.push({ 'item': tempKey, 'amount': lastTemp[tempKey], 'roundOffAmount': roundOffToNearestTen(lastTemp[tempKey]), 'price': roundOffToNearestTen(lastTemp[tempKey]) * prices_reworked[tempKey]/1000 });
    });
    console.log('EXIT CALCULATOR -> ', results)
    return { results, days, adjustments };
};

export default calculateNutritionAmount;