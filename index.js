// variables refering to the html elements
const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

// Event listener for currency dropdowns (select)
// The two dropdowns are populated with currency options.
// The first dropdown pre-selects "USD", and the second pre-selects "GBP".
// When the user changes the selected currency, the corresponding flag image is updated to reflect the new selection.
[fromCur, toCur].forEach((select, i) => {
  for (let curCode in Country_List) {
    const selected =
      (i === 0 && curCode === "USD") || (i === 1 && curCode === "GBP")
        ? "selected"
        : "";
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${curCode}" ${selected}>${curCode}</option>`
    );
  }
  select.addEventListener("change", () => {
    const code = select.value;
    const imgTag = select.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`;
  });

  // Function to get exchange rate from api

  async function getExchangeRate() {
    const amountVal = amount.value || 1;
    exRateTxt.innerText = "Getting exchange rate...";
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/0313f0fa390cfc15547cfcfd/latest/${fromCur.value}`
      );
      const result = await response.json();
      const exchangeRate = result.conversion_rates[toCur.value];
      const totalExRate = (amountVal * exchangeRate).toFixed(2);
      exRateTxt.innerText = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`;
    } catch (error) {
      exRateTxt.innerText = "Something went wrong...";
    }
  }

  // Event listeners for button and exchange icon click

  window.addEventListener("load", getExchangeRate); //When the page loads, it automatically fetches and shows the exchange rate.
  // When a button is clicked, it fetches the exchange rate again.
  getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
  });

  // When an exchange icon is clicked, the currencies are swapped, the flags are updated, and the exchange rate is fetched based on the new selection.
  exIcon.addEventListener("click", () => {
    [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
    [fromCur, toCur].forEach((select) => {
      const code = select.value;
      const imgTag = select.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${Country_List[
        code
      ].toLowerCase()}.png`;
    });
    getExchangeRate();
  });
});
