import { useEffect, useState } from "react"
import { currencies } from "./currency"
import axios from "axios"

const App = () => {

  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [amount, setAmount] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [conversionHistory, setConversionHistory] = useState([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || []
    setConversionHistory(savedHistory)
  }, [])

  const savedHistory = (entry) => {
    
    const updatedHistory = [entry, ...conversionHistory]

    setConversionHistory(updatedHistory)

    localStorage.setItem("history", JSON.stringify(updatedHistory))
  }

  const convertCurrencies = async () => {

    try {

      const { data } = await axios.get(`http://localhost:10000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`)

      // let result = Object.values(data.data)[0] * amount
      let result = Object.values(data.data)[0] * amount;

      let roundOfResult = result.toFixed(2)

      const countryCode = currencies.find((currencies) => currencies.code === selectedCurrency)

      console.log(countryCode);

      savedHistory({
        result : roundOfResult,
        flag : countryCode.flag,
        symbol : countryCode.symbol,
        code : countryCode.code,
        countryName: countryCode.name,
        date : new Date().toLocaleString()
      })

    } catch(error) {

      alert("error fetching conversion rates.")
    }   
    
  }

  const deleteHistoryItem = (index) => {

    const updatedHistory = conversionHistory.filter((_,i) => i !== index)
    localStorage.setItem("history", JSON.stringify(updatedHistory))
    conversionHistory(updatedHistory)

  }

  return (    
    <div className='h-screen p-5 bg-gradient-to-r from-pink-700 to-purple-600 flex justify-center items-center md:px-20'>

      <div className="bg-white w-full max-w-[660px] h-full overflow-hidden p-6 rounded-lg shadow-md">

        <h1 className="text-3xl font-bold text-gray-800 mb-6 overflow-hidden">
          Smart Currency Converter
        </h1>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Base Currency:</label>
          <select className="w-full border-gray-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1"
            value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {
              currencies.map(element => (
                <option key={element.code} value={element.code}>{element.name}</option>
              ))
            }
          </select>
        </div>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Amount:</label>
          <input
            type="number"
            className="w-full border-gray-300 rounded-lg p-2 my-1 bg-gray-200 font-semibold text-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-pink-400 text-white p-3 rounded-lg font-semibold text-xl w-52 transition-all duration-300 hover:bg-pink-500"
            onClick={convertCurrencies}
          >
            Convert
          </button>
        </div>

        <div className="mb-4 px-1">
          <label className="block text-gray-700">Currencies to Convert:</label>
          <select
            className="w-full border-gray-300 rounded-lg p-2 my-1 bg-gray-200 font-semibold text-xl"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="">Search Currency</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 px-1">
          <h2 className="text-2xl px-1 font-bold text-gray-800 mb-4">
            Conversion History
          </h2>
        </div>

        <div className="px-1 h-[400px]">
          <ul className="px-1">
            {conversionHistory.length > 0 ? (
              conversionHistory.map((entry, index) => (
                <li
                  key={index}
                  className="text-gray-700 mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={`https://flagcdn.com/w40/${entry.flag}.png`}
                      alt="Country Flag"
                      className="w-11 h-11"
                    />{" "}
                    <p className="flex flex-col gap-1 text-gray-500 font-medium">
                      <span className="text-xl font-semibold text-black">
                        {entry.symbol} {entry.result}
                      </span>
                      <span>
                        {entry.code} - {entry.countryName}
                      </span>
                    </p>
                  </div>
                  <span onClick={() => deleteHistoryItem(index)}
                    className="text-gray-500 font-bold text-xl hover:cursor-pointer"                    
                  >
                    x
                  </span>
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-500 font-semibold">
                Conversion history is empty.
              </p>
            )}
          </ul>
        </div>

      </div>

    </div>    
  )
}

export default App