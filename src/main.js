// -----import { createFilter } from "vite" ------
import "./css/index.css"
import IMask from "imask"

// *************************************** Biblioteca IMask JavaScript ********************************************//

//  --------------------- Mudança de cores e logos
const ccColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".logo-visa")
const primaryColorCard = document.querySelector(".cc")

function setCardColor(type) {
  // a variável/parâmetro 'type' aqui é uma string
  const colors = {
    visa: ["#8e60f6", "##54be46"],
    mastercard: ["#ffe37c", "#c17609"],
    default: ["#000", "gray"],
  }
  primaryColorCard.style.backgroundImage = `url('cc-bg-${type}.svg')`
  ccColor01.setAttribute("fill", colors[type][0])
  ccColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// globalThis.setCardColor = setCardColor

// ------------------------- IMask para criar máscaras
const securityCode = document.querySelector("#security-code")
const securityCodeStandard = {
  mask: "000",
}
const securityCodeMasked = IMask(securityCode, securityCodeStandard)

// ------------------------- Uso do data-mask, para datas
const expDate = document.querySelector("#expiration-date")
const expDateStandard = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expDateMasked = IMask(expDate, expDateStandard)

// -------------------------- Regex para cartões com uso do Dynamic Masked
const cardNumber = document.querySelector("#card-number")
const cardStandard = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  // ------------------------ Evento do método é disparado
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardStandard)

// -------------------------- Evento click botão
function addButton() {
  const addBtn = document.querySelector("[data-btn]")
  addBtn.addEventListener("click", () => {
    alert("Cartão adicionado!")
  })

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
  })
}
addButton()

// ------------------------- Evento para alterar o nome do titular
function cardHolder() {
  const cardHolder = document.querySelector("#card-holder")
  cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText =
      cardHolder.value.length === 0 ? "PESSOA DA SILVA" : cardHolder.value
  })
}
cardHolder()

// ------------------------- Evento para alterar código CVC
function cvc() {
  securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
  })

  function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
  }
}
cvc()

// ------------------------- Evento para alterar número do cartão
function cdNumber() {
  cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardColor(cardType)
    updateCardNumber(cardNumberMasked.value)
  })

  function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 4321 2122 6660" : number
  }
}
cdNumber()

// ------------------------- Evento para alterar data/vencimento
expDateMasked.on("accept", () => {
  updateExpDate(expDateMasked.value)
})

function updateExpDate(date) {
  const ccExp = document.querySelector(".cc-expiration .value")
  ccExp.innerText = date.length === 0 ? "02/32" : date
}
