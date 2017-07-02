var digitalFlashPlayApp = function () {
    var cards = []
    var counter = 0
    var errorHandler = function (err, status) {
        console.error(status);
    }

    var playCards = function () {
        totalScore = 0;
        attemptCounter = 0;
        $.ajax({
            url: '/cards',
            type: 'get',
            error: function (err, status) {
                console.error(status)
            },
            success: function (data) {
                cards = data;
                shuffleCards()
                renderCardsPlay()
            }
        })
    }


    var renderCardsPlay = function () {
        attemptCounter = 0;
        counter = 0;
        totalScore = 0;
        $('.cardList').empty();
        if (counter < cards.length) {
            var source = $('#render-card').html();
            var template = Handlebars.compile(source);
            var newHTML = template(cards[counter]);
            $('.cardList').append(newHTML);
            return counter = counter + 1;
        } else {
            $('.cardList').append('<h2>Game Over</h2>');
            $('.cardList').append('<p>' + 'Total score =' + totalScore + '</p>')
            attemptCounter = 0;
            counter = 0;
            totalScore = 0;
        }
    };


    var shuffleCards = function () {
        var shuffleArray = [];
        var randCard = Math.floor(Math.random() * cards.length);
        while (cards.length > 0) {
            shuffleArray.push(cards[randCard]);
            cards.splice(randCard, 1);
            randCard = Math.floor(Math.random() * cards.length);
        }
        return cards = shuffleArray
    }

    var findCardByIdPlay = function (cardId) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i]._id == cardId) {
                return cards[i];
            }
        }
    }
    var attemptCounter = 0;
    var totalScore = 0;

    var playAttempt = function () {
        attemptCounter = attemptCounter + 1
        if (attemptCounter == 3) {
            return renderAnswer()
        };
    };

    var calcScore = function () {
        totalScore = totalScore + cards[counter - 1].level * (10 - (3 * attemptCounter))
    };
    var renderAnswer = function (res) {
        console.log(attemptCounter)
        if (res == undefined) {
            res = "Better luck next time"
        }
        var $cardList = $('.cardList')
        calcScore()
        $cardList.empty();
        $cardList.append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
            '<h2>' + 'The answer is:  ' + cards[counter - 1].back + '</h2> </div>')
        $cardList.append('<p>' + res + '</p>')
        var levelScore = cards[counter - 1].level * (10 - (3 * attemptCounter))
        $cardList.append('<p>' + 'Score =' + levelScore + '</p>')
        attemptCounter = 0
        $cardList.append('<p>' + 'Total score =' + totalScore + '</p>')
        $cardList.append('<button type="button" class="btn btn-large btn-block btn-default next-button">next</button>')

    }

    return {
        renderCardsPlay: renderCardsPlay,
        playCards: playCards,
        findCardByIdPlay: findCardByIdPlay,
        renderAnswer: renderAnswer,
        playAttempt: playAttempt,
    };
};

var appPlay = digitalFlashPlayApp()


$('.play').click(function () {
    appPlay.playCards()
})

$(document).on('click', '.next-button', appPlay.renderCardsPlay)


$(document).on("click", ".play-try", function () {
    var tryValue = $(this).siblings('.tryText').val();
    console.log(tryValue)
    var cardId = $(this).closest(".card").data().id
    console.log(cardId)
    var card = appPlay.findCardByIdPlay(cardId)
    var backText = card.back;

    if (tryValue == backText) {
        var response = "Well done!"
        $(this).siblings(".response").html(response)
        appPlay.renderAnswer(response)
    } else {
        var response = "Try again"
        $(this).siblings(".response").html(response)
        appPlay.playAttempt(response)
    }
})