import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { useEffect, useState } from "react";

interface CurrencyItem {
  currency: string;
  date: string;
  price: number;
}

function App() {
  const [valueLeft, setValueLeft] = useState({
    currency: "ETH",
    amount: "1",
  });
  const [valueRight, setValueRight] = useState({
    currency: "USD",
    amount: "1",
  });
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);

  if (currencies.length !== 0) {
    const leftPriceIdx = currencies.findIndex((i) => i.currency === valueLeft.currency);
    const calculatedAmountRight =
      Number.parseInt(valueRight.amount, 10) * currencies[leftPriceIdx].price;
    if (valueRight.amount !== calculatedAmountRight.toString()) {
      // FIXME: Incorrect condition.
      console.log(calculatedAmountRight.toString())
    }
    // Number.parseInt(valueLeft.amount, 10) + Number.parseInt(valueRight.amount, 10);
  }

  async function getExchangeRate() {
    const r = await fetch("https://interview.switcheo.com/prices.json", {
      method: "GET",
    });

    if (!r.ok) {
      throw new Error("Fatal: Fail to fetch exchange rate.");
    }

    const data = (await r.json()) as CurrencyItem[];
    const processedData = data.reduce((acc, currentItem) => {
      const currItemIdxInAcc = acc.findIndex(
        (item) => item.currency === currentItem.currency,
      );
      if (currItemIdxInAcc === -1) {
        acc.push(currentItem);
      } else {
        const itemInAcc = acc[currItemIdxInAcc];
        if (new Date(currentItem.date) >= new Date(itemInAcc.date)) {
          // The comparison is inclusive since we prioritise later-appear items.
          acc[currItemIdxInAcc] = currentItem;
        }
      }
      return acc;
    }, [] as CurrencyItem[]);

    console.log(processedData);
    setCurrencies(processedData);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: `getExchangeRate is not going to change.`
  useEffect(() => {
    getExchangeRate();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <section>
        <h1 className="font-bold text-white">Currency Swap</h1>

        <div className="mb-8" />

        <div className="flex gap-2">
          <div className="flex gap-2">
            <Select
              onValueChange={(value) =>
                setValueLeft((v) => ({
                  ...v,
                  currency: value,
                }))
              }
              value={valueLeft.currency}
            >
              <SelectTrigger className="w-[250px]">
                <img
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${valueLeft.currency}.svg`}
                  alt={`${valueLeft.currency} Token Icon`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USD.svg";
                  }}
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem value={c.currency} key={c.currency + c.date}>
                    {c.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              id="l-amount"
              placeholder="10000"
              value={valueLeft.amount}
              onChange={(e) => {
                setValueLeft((v) => ({
                  ...v,
                  amount: e.currentTarget.value,
                }));
              }}
            />
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              id="r-amount"
              placeholder="10000"
              value={valueRight.amount}
              onChange={(e) => {
                setValueRight((v) => ({
                  ...v,
                  amount: e.currentTarget.value,
                }));
              }}
            />
            <Select
              onValueChange={(value) =>
                setValueRight((v) => ({
                  ...v,
                  currency: value,
                }))
              }
              value={valueRight.currency}
            >
              <SelectTrigger className="w-[250px]">
                <img
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${valueRight.currency}.svg`}
                  alt={`${valueRight.currency} Token Icon`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USD.svg";
                  }}
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem value={c.currency} key={c.currency + c.date}>
                    {c.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
