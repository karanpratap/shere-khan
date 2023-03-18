const priceRecalculator = (item, prices) => {
    console.log('PRICE RECALC START -> ', item)
    let prices_reworked = {}
    prices.forEach(item => {
        prices_reworked[item.item] = item.price;
    })
    item.results.forEach(result_item => {
        result_item.price = result_item.roundOffAmount * prices_reworked[result_item.item]/1000;
    })
    console.log('PRICE RECALC END -> ', item);
    return item;
}

export default priceRecalculator;