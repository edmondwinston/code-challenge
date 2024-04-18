import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useState } from "react";

function App() {
	const [valueLeft, setValueLeft] = useState("BTC");
	const [valueRight, setValueRight] = useState("BTC");

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
