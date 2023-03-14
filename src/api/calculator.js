import scale from './scale.json';

const roundOffToNearestTen = (number) => {
    return (number%10 >= 5) ? Math.ceil(number/10) * 10 : Math.floor(number/10) * 10;
}

const calculateNutritionAmount = (metrics, breakfast, prices) => {
    let prices_reworked = {}
    console.log(prices)
    prices.forEach(item => {
        prices_reworked[item.item] = item.price;
    })
    console.log(prices_reworked);
    let results = [];
    let temp = {};
    let tempBF = {};
 
    Object.keys(scale).forEach(key => {

        const middaySliced = scale[key].slice(0,3);

        middaySliced.forEach( day => {
            day['midday'].forEach( item => {
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

        //breakfast
        if (key == '3yTo6y') {
            const breakfastSliced = scale[key].slice(0,3);
            console.log('BFSliced', breakfastSliced);
            scale[key].forEach( day => {
                day['breakfast'].forEach( item => {
                    tempBF[item['item']] = tempBF[item['item']] ? tempBF[item['item']] + item['amount'] * metrics.threetosixCount * Math.floor(metrics.days/6) : item['amount'] * metrics.threetosixCount * Math.floor(metrics.days/6);
                    console.log('Gulu Gulu')
                });
            });

            console.log('tempBFinit', tempBF);

            breakfastSliced.forEach( day => {
                day['breakfast'].forEach( item => {
                    tempBF[item['item']] = tempBF[item['item']] ? tempBF[item['item']] + item['amount'] * metrics.threetosixCount * Math.floor((metrics.days%6)/3): item['amount'] * metrics.threetosixCount * Math.floor((metrics.days%6)/3);
                });
            });
            console.log('tempBF', tempBF);
        }

    });

    // Add midday results
    Object.keys(temp).forEach(tempKey => {
        results.push({ 'item': tempKey, 'amount': temp[tempKey] * (metrics.days/3), 'roundOffAmount': roundOffToNearestTen(temp[tempKey] * (metrics.days/3)), 'price': roundOffToNearestTen(temp[tempKey] * (metrics.days/3)) * prices_reworked[tempKey]/1000 });
    });

    // Add breakfast results
    Object.keys(tempBF).forEach(tempKey => {
        results.push({ 'item': tempKey, 'amount': tempBF[tempKey], 'roundOffAmount': roundOffToNearestTen(tempBF[tempKey]), 'price': roundOffToNearestTen(tempBF[tempKey]) * prices_reworked[tempKey]/1000 });
    });
    console.log(results);

    return results;

};

export default calculateNutritionAmount;