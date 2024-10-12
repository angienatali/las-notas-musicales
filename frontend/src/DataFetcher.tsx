import React, { useEffect } from "react";
import axios from "axios";

interface DataFetcherProps {
  onDataFetched: (
    joystickX: number,
    joystickY: number,
    light: number,
    slider: number
  ) => void;
}

const DataFetcher: React.FC<DataFetcherProps> = ({ onDataFetched }) => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/serial-data");
      const data = response.data.data.split(",");
      const joystickX = parseInt(data[0], 10);
      const joystickY = parseInt(data[1], 10);
      const light = Math.min(Math.max(parseInt(data[2], 10), 0), 1024);
      const slider = parseInt(data[4], 10);
      onDataFetched(joystickX, joystickY, light, slider);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
/*<button
      onClick={fetchData}
      className="border border-teal-400 text-stone-900 rounded px-4 py-2 bg-teal-400 active:bg-transparent active:text-teal-400 transition duration-300 mt-10"
    >
      ✐ Dibujar
    </button>*/
    <div className="switches">
    
<button>nota do ♩</button>
<button>nota Re ♪</button>
<button>nota Mi ♫</button>
<button>nota Fa ♬</button>
</div>
  );
};

export default DataFetcher;
