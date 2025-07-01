
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    }
};

const pathImages = "src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "PAPER",
        IMG: `${pathImages}dragon.png`,
        WinOF: [1],
        LosenOF: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        IMG: `${pathImages}magician.png`,
        WinOF: [2],
        LosenOF: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        IMG: `${pathImages}exodia.png`,
        WinOF: [0],
        LosenOF: [1],
    },
];

// ✅ Agora está fora de setCardsField
async function ShowHiddenCardFieldsImages(value) {
    state.fieldCards.player.style.display = value ? "block" : "none";
    state.fieldCards.computer.style.display = value ? "block" : "none";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    const playerCard = cardData[playerCardId];

    if (playerCard.WinOF.includes(Number(computerCardId))) {
        duelResults = "Win";
        await playAudio(duelResults);
        state.score.playerScore++;
    } else if (playerCard.LosenOF.includes(Number(computerCardId))) {
        duelResults = "Lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages() {
    const { computerBOX, player1BOX } = state.playerSides;

    computerBOX.querySelectorAll("img").forEach((img) => img.remove());
    player1BOX.querySelectorAll("img").forEach((img) => img.remove());
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(Number(cardImage.getAttribute("data-id")));
        });
    }

    return cardImage;
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    const computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, computerCardId);

    const duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].IMG;
    state.fieldCards.computer.src = cardData[computerCardId].IMG;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].IMG;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    await ShowHiddenCardFieldsImages(false);
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    ShowHiddenCardFieldsImages(false);
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

// ✅ Garante que o JS só execute após o DOM carregar
window.onload = () => {
    const bgm = document.getElementById("bgm");
    bgm.play();

    init();
};
