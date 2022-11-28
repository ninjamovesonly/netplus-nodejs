$(function() {

    var owner = $('#owner');
    var cardNumber = $('#cardNumber');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv");
    var mastercard = $("#mastercard");
    var confirmButton = $('#confirm-purchase');
    var visa = $("#visa");
    var amex = $("#amex");
    var redirect = $("#redirect");
    var creditCardForm = $('#creditCardForm');

    redirect.hide();

    // Use the payform library to format and validate
    // the payment fields.

    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');


    cardNumber.keyup(function() {

        amex.removeClass('transparent');
        visa.removeClass('transparent');
        mastercard.removeClass('transparent');

        if ($.payform.validateCardNumber(cardNumber.val()) == false) {
            cardNumberField.addClass('has-error');
        } else {
            cardNumberField.removeClass('has-error');
            cardNumberField.addClass('has-success');
        }

        if ($.payform.parseCardType(cardNumber.val()) == 'visa') {
            mastercard.addClass('transparent');
            amex.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
            mastercard.addClass('transparent');
            visa.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'mastercard') {
            amex.addClass('transparent');
            visa.addClass('transparent');
        }
    });

    confirmButton.click(function(e) {

        e.preventDefault();

        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var isCvvValid = $.payform.validateCardCVC(CVV.val());

        if(owner.val().length < 5){
            alert("Wrong owner name");
        } else if (!isCardValid) {
            alert("Wrong card number");
        } else if (!isCvvValid) {
            alert("Wrong CVV");
        } else {
            // Everything is correct. Add your form submission code here.
            const baseUrl = window.location.origin; //"https://api.netpluspay.com/"; //
    
            // netpluspay.com payment endpoint
            const payUrl = baseUrl + "/api/v1/pay";
            const reQueryUrl = baseUrl + "/transactions/requery/";
            const myheaders = {"Content-Type": "application/json", "Accept": "application/json"};

            const payload = {
                cardNumber: cardNumber.val(),
                expiryDate: `${ $('#expiryMonth').val() }/${ $('#expiryYear').val() }`,
                cvv: $('#cvv').val(),
                transId: $("#transId").val()
            }
            
            const init = {
                body: JSON.stringify(payload),
                method: "POST",
                headers: {"content-type": "application/json"}
            };

            try {
                fetch(payUrl, init) //this makes POST request to the pay endpoint.
                    .then(async (res) => {
                        const body = await res.json(); // the return response is obtained from the promise response object.
                        if (body?.code === "S0") { // Check for the transaction response code. Where S0 means 3DS is required
                            creditCardForm.hide();
                            redirect.show();
                            document.getElementById('redirect').innerHTML = body.redirectHtml;
                            setTimeout(() => {
                                    const threeDF = document.getElementById('threedsChallengeRedirectForm') ?? document.getElementById('threedsFrictionLessRedirectForm');
                                    threeDF.submit();
                            }, 1000);

                            window.onmessage = (event) => {
                                fetch(reQueryUrl+`${body.transId}`,{ headers: myheaders, method: "GET"})
                                    .then(async(res2) => {
                                        const data = await res2.text();
                                        console.log(data);
                                    })
                                    .catch(err => console.log('requery error:\n*********************\n', err));
                            }
                                
                                /*let count = 0;
                                const timed = setInterval(() => {
                                    setTimeout(() => {
                                        fetch(reQueryUrl+`${body.transId}`,{headers: myheaders, method: "GET"})
                                        .then(async(res2) => {
                                            count += 1;
                                            const data = await res2.text();
                                            if(data.code == '00' || data.code == '90') {
                                                clearInterval(timed)
                                                console.log('No ',count,' try ', data);
                                            } else {
                                                console.log('No ',count,' try ', data);
                                            }
                                        })
                                        .catch(err => console.log('requery error:\n*********************\n', err));
                                    }, 2000);
                                }, 5000);*/
                    }
                    })
                    .catch(error => console.log('request error:\n*********************\n', error))
            } catch (error) {
                console.log('process error:\n**********************\n', error);
            }
        }
    });
});