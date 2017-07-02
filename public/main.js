var digitalFlashApp = function () {
    var cards = []

    var getCards = function () {
        $.ajax({
            url: '/cards',
            type: 'get',
            error: function (err, status) {
                console.error(err)
            },
            success: function (data) {
                cards = data;
                renderCards();
            }
        })
    }

    var renderCards = function () {
        $('.cardList').empty()
        var source = $('#card-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < cards.length; i++) {
            var newHTML = template(cards[i]);
            $('.cardList').append(newHTML);
        }
    }

    var addCard = function (newCard) {
        $.ajax({
            url: "/cards",
            type: "post",
            data: newCard,
            error: function (err, status) {
                console.error(status);
            },
            success: function (data) {
                cards.push(data);
                renderCards();

            }
        });
    }


    var deleteCard = function (cardId) {
        $.ajax({
            type: "DELETE",
            url: '/cards/' + cardId,
            success: function (data) {
                getCards()
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };


    var findCardById = function (cardId) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i]._id == cardId) {
                return cards[i];
            }
        }
    }

    return {
        addCard: addCard,
        getCards: getCards,
        deleteCard: deleteCard,
        renderCards: renderCards,
        findCardById: findCardById

    }
}

var app = digitalFlashApp();
app.getCards();


$('.show-cards').click(app.getCards)


$(".saveCard").click(function () {

    var front = $(this).siblings('.frontText').val();
    var back = $(this).siblings('.backText').val();
    var diff = $(this).siblings('.diif-select').find('#sel1').val();
    if (back == '' || front == '' || diff == null ) {
        alert("Please fill in the Front, Back and Level fields.");
        return false;
    }

    var diff = $(this).siblings('.diif-select').find('#sel1').val();

    var newCard = {
        front: front,
        back: back,
        level: diff,
    };
    app.addCard(newCard);

    $(this).siblings('.frontText').val('');
    $(this).siblings('.backText').val('');
    $(this).siblings('.hint').val('');
})


$('.playArea').on("click", ".deleteCard", function () {

    var cardId = $(this).closest(".card").data().id
    var card = app.findCardById(cardId)
    app.deleteCard(cardId)
})





$('.playArea').on("click", ".tryButton", function () {


    var tryValue = $(this).siblings('.tryText').val();
    console.log(tryValue)
    var cardId = $(this).closest(".card").data().id
    console.log(cardId)
    var card = app.findCardById(cardId)
    var backText = card.back;
    if (tryValue == backText) {
        var response = "Well done!"
        $(this).siblings(".response").html(response)
    } else {
        var response = "Try again"
        $(this).siblings(".response").html(response)
    }
})