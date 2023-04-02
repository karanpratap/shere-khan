import scale from './scale.json';

const itemizations = {
    'Oil': 1000,
    'Ghee': 1000,
    'Haldi': 1000,
    'Salt': 1000,
    'Biscuits': 50,
    'Suji': 1500,
    'Rice': 10,
    'Moongi': 10,
    'Channa': 10,
    'Sugar': 1000,
    'Nutri': 10
}

const roundOffToNearestTen = (number, unit, threshold, item) => {
    if (item === 'Suji') {
        let roundOffAmount = (number%unit < unit/2 && (number/unit).toFixed(0) != 0) ? Math.floor(number/unit) * unit : Math.ceil(number/unit) * unit;
        return roundOffAmount <= threshold ? roundOffAmount + 1500 : roundOffAmount;
    }
    return (number%unit < unit/2 && (number/unit).toFixed(0) != 0) ? Math.floor(number/unit) * unit : Math.ceil(number/unit) * unit;
}

const roundOffToNearestWholeNoBullshit = (number, unit) => {
    return (number%unit < unit/2 && (number/unit).toFixed(0) != 0) ? Math.floor(number/unit) * unit : Math.ceil(number/unit) * unit;
}

const calculateNutritionDays = (metrics) => {
    let temp = {};
    let adjustments = metrics.adjustments ? metrics.adjustments : null;
    console.log('DAYS BASED CALC');
    console.log('infamous days = ', metrics.days);
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
    adjustments = null;

    Object.keys(temp).forEach(tempKey => {
        temp[tempKey] = roundOffToNearestTen(temp[tempKey], itemizations[tempKey], roundOffToNearestTen(temp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey);
    });

    return { lastTemp: temp, adjustments, name: metrics.name };
}

const calculateNutritionMoney = (metrics, prices) => {
    let temp = {};
    let lastTemp = {};
    let days = metrics.days;
    let adjustments = metrics.adjustments ? metrics.adjustments : null;

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
            finalPrice += roundOffToNearestTen(temp[tempKey], itemizations[tempKey], roundOffToNearestTen(temp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey) * prices[tempKey]/1000;
        });
        if (finalPrice > totalMoney) {
            let diff = totalMoney - lastPrice;
            if (diff != 0) {
                adjustments = {};
                adjustments['Channa'] = ((diff*500)/prices.Channa).toFixed(2);
                adjustments['Moongi'] = ((diff*500)/prices.Moongi).toFixed(2);
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

    Object.keys(lastTemp).forEach(tempKey => {
        lastTemp[tempKey] = roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey);
        (tempKey === 'Channa' || tempKey === 'Moongi') && (adjustments) ? lastTemp[tempKey] += Number(Number(adjustments[tempKey]).toFixed(0)) : null;
        //   'amount': lastTemp[tempKey], 'roundOffAmount': roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey), 'price': roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey) * prices_reworked[tempKey]/1000 });
    });

    return { lastTemp, adjustments };

}

const calculateSplitNutrition = (metrics, centers, prices) => {
    console.log('ENTER SPLIT CALCULATOR -> ', centers );
    let prices_reworked = {}
    prices.forEach(item => {
        prices_reworked[item.item] = item.price;
    })
    let lastTemp = {};
    let days = metrics.days;
    let adjustments = metrics.adjustments ? metrics.adjustments : null;

    if (metrics.money=== 0) {
        // We doing days based calculation
        ({ lastTemp, adjustments } = calculateNutritionDays(metrics));
    }
    else {
        ({lastTemp, adjustments} = calculateNutritionMoney(metrics, prices_reworked));
    };
    // Object.keys(lastTemp).forEach(tempKey => {
    //     lastTemp[tempKey] = roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey);
    //     (tempKey === 'Channa' || tempKey === 'Moongi') && (adjustments) ? lastTemp[tempKey] += Number(Number(adjustments[tempKey]).toFixed(0)) : null;
    //     //   'amount': lastTemp[tempKey], 'roundOffAmount': roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey), 'price': roundOffToNearestTen(lastTemp[tempKey], itemizations[tempKey], roundOffToNearestTen(lastTemp['Ghee'], itemizations['Ghee'], null, 'Ghee'), tempKey) * prices_reworked[tempKey]/1000 });
    // });
    // console.log('EXIT SPLIT CALCULATOR -> ', results)

    let center_results = [];
    // compute actual amount for each center
    centers.forEach(center => {
        center_results.push(calculateNutritionDays({...center, days: days}));
    });

    let total_theoretical = {};
    center_results.forEach(center_res => {
        Object.keys(center_res.lastTemp).forEach(key => {
            total_theoretical[key] = total_theoretical[key] ? total_theoretical[key] + center_res.lastTemp[key] : center_res.lastTemp[key];
        })
    })

    let theoretical_split = [];
    let temp = []
    center_results.forEach(center_res => {
        Object.keys(center_res.lastTemp).forEach(key => {
            // temp.push({"amount": Number(center_res[key]/total_theoretical[key]*lastTemp[key]).toFixed(0) });
            temp.push({ 'item': key, 'amount' : ((center_res.lastTemp[key] / total_theoretical[key]) * lastTemp[key]).toFixed(0) });
        });
        theoretical_split.push({name: center_res.name, data: temp});
        temp = [];
    });

    return theoretical_split;
};

export default calculateSplitNutrition;