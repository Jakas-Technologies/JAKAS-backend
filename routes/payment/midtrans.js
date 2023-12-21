require('dotenv').config()

const axios = require('axios');

const BaseUrl = 'https://api.sandbox.midtrans.com/v2';
const serverKey = process.env.MIDTRANS_SERVER_KEY;

const post = (url, serverKey, payloads) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + Buffer.from(serverKey + ":").toString("base64"),
    };

    let body = JSON.stringify(payloads);

    return axios.post(url, body, {
        headers: headers,
    }).then((res) => {
        return res.data;
    }).catch(e => console.log(e));
};

const charge = (payloads) => {
    return post(
        BaseUrl + "/charge",
        serverKey,
        payloads
    );
};

const baseBody = (items, customer) => {
    let gross_amount = 0;
    let order_id = new Date().getTime();

    console.log(items);

    items.forEach(function (item) {
        gross_amount += item.price * item.quantity;
    });

    return {
        transaction_details: {
            gross_amount,
            order_id,
        },
        customer_details: {
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
        },
        item_details: items,
    };
};

const goPay = (items, customer) => {
    let base = baseBody(items, customer);

    return {
        payment_type: "gopay",
        transaction_details: base.transaction_details,
        customer_details: base.customer_details,
        item_details: base.item_details,
        gopay: {
            enable_callback: true,
            callback_url: "jakas://callback",
        },
    };
};

const shopeePay = (items, customer) => {
    let base = baseBody(items, customer);

    return {
        payment_type: "shopeepay",
        transaction_details: base.transaction_details,
        customer_details: base.customer_details,
        item_details: base.item_details,
        shopeepay: {
            callback_url: "jakas://callback",
        },
    };
};

module.exports = {
    charge,
    goPay,
    shopeePay,
};
