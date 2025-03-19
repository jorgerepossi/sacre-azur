export const calculateDecantPriceWithMargin = (
    pricePer100ml: number,
    ml: number,
    quantity: number,
    margin: number = 1.3889
) => {
    const basePrice = (pricePer100ml / 100) * ml;
    return ((basePrice * margin) * quantity).toFixed(2);
};
