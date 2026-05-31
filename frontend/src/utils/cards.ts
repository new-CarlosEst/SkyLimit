//Aqui hay un array con un array con las tarjetas de credito de testing de strip
export const cards = [
    // DÉBITO
    // Visa
    {
        number: '4000056655665556',
        brand: 'Visa',
        type: 'debit',
        expMonth: '12',
        expYear: '2027',
        cvc: '123',
        paymentMethodId: 'pm_card_visa_debit',
    },
    
    // Mastercard
    {
        number: '5200828282828210',
        brand: 'Mastercard',
        type: 'debit',
        expMonth: '12',
        expYear: '2027',
        cvc: '123',
        paymentMethodId: 'pm_card_mastercard',
    },
    
    // CRÉDITO
    // Visa
    {
        number: '4242424242424242',
        brand: 'Visa',
        type: 'credit',
        expMonth: '12',
        expYear: '2027',
        cvc: '123',
        paymentMethodId: 'pm_card_visa',
    },
    // Mastercard
    {
        number: '5555555555554444',
        brand: 'Mastercard',
        type: 'credit',
        expMonth: '12',
        expYear: '2027',
        cvc: '123',
        paymentMethodId: 'pm_card_mastercard',
    }
];