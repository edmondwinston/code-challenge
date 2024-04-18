import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useEffect, useState } from "react";

interface CurrencyItem {
	currency: string;
	date: string;
	price: number;
}

function App() {
	const [valueLeft, setValueLeft] = useState("BTC");
	const [valueRight, setValueRight] = useState("BTC");
	const [exchangeRates, setExchangeRates] = useState<CurrencyItem[]>([]);

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
		setExchangeRates(processedData);
	}

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
						<Select onValueChange={(v) => setValueLeft(v)} value={valueLeft}>
							<SelectTrigger className="w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="btc">BTC</SelectItem>
								<SelectItem value="blur">BLUR</SelectItem>
								<SelectItem value="busd">BUSD</SelectItem>
							</SelectContent>
						</Select>
						<Input type="text" id="in-amount" placeholder="10000" />
					</div>

					<div className="flex gap-2">
						<Input type="text" id="in-amount" placeholder="10000" />
						<Select onValueChange={(v) => setValueRight(v)} value={valueRight}>
							<SelectTrigger className="w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="btc">BTC</SelectItem>
								<SelectItem value="blur">BLUR</SelectItem>
								<SelectItem value="busd">BUSD</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</section>
		</div>
	);
}

export default App;
