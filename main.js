const fs = require("fs");
const path = require("path");
const https = require("https");
const { mainModule } = require("process");

(function main() {
  https
    .get("https://www.monogo.pl/competition/input.txt")
    .on("response", function (response) {
      let body = "";
      response.on("data", function (chunk) {
        body += chunk;
      });
      response.on("end", function () {
        const result = calculateResult(JSON.parse(body));

        console.log(`Finished with result: ${result}`);
      });
    });
})();

function calculateResult({ products, colors, sizes, selectedFilters }) {
  /* Prepare products array with full data (colors & sizes) */
  let productsData = prerpareData({ products, colors, sizes });

  /* Apply filtering rules */
  productsData = productsData
    .filter((item) => item.price > 200)
    .filter(
      (item) => item.color && selectedFilters.colors.indexOf(item.color) !== -1
    )
    .filter(
      (item) => item.size && selectedFilters.sizes.indexOf(item.size) !== -1
    );

  /* Calculate prices based min*max value */
  const roundedMinMax = calculatePricesBasedValue(productsData);

  /* Generate "magic" array */
  const magicArray = generateMagicArray(roundedMinMax);

  /* Final result calculation */
  const val1 = magicArray.indexOf(14);
  const val2 = roundedMinMax;
  const val3 = "Monogo".length;

  return val1 * val2 * val3;
}

function prerpareData({ products, colors, sizes }) {
  const colorsMap = colors.reduce((map, { id, value }) => {
    return { ...map, [id]: value };
  }, {});

  const sizesMap = sizes.reduce((map, { id, value }) => {
    return { ...map, [id]: value };
  }, {});

  let productsData = products.map((item) => {
    return { ...item, color: colorsMap[item.id], size: sizesMap[item.id] };
  });

  return productsData;
}

function calculatePricesBasedValue(productsData) {
  const prices = productsData.map((item) => item.price);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const calcMinMax = min * max;
  const roundedMinMax = Math.round(calcMinMax);

  return roundedMinMax;
}

function generateMagicArray(roundedMinMax) {
  const rawMinMaxArray = roundedMinMax.toString().split("");
  const magicArray = rawMinMaxArray.reduce((res, val, index) => {
    if (index % 2 === 1) {
      res.push(parseInt(val) + parseInt(rawMinMaxArray[index - 1]));
    }

    return res;
  }, []);

  return magicArray;
}
