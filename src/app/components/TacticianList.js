import { useEffect, useState } from 'react';

export default function TacticianList() {
  const [tacticians, setTacticians] = useState([]);

  useEffect(() => {
    // Fetch data from the given URL
    const fetchTacticians = async () => {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-tactician.json');
      const data = await response.json();
      
      // Extract and set tactician data
      const tacticianList = Object.values(data.data).map(tactician => ({
        id: tactician.id,
        name: tactician.name,
        image: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/tft/tactician/${tactician.id}.png`, // Construct image URL
        description: tactician.title, // You can use `title` or another property as the description
      }));

      setTacticians(tacticianList);
    };

    fetchTacticians();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tacticians.map((tactician) => (
        <div key={tactician.id} className="bg-white rounded-lg shadow-lg p-4 text-center">
          <img
            src={tactician.image}
            alt={tactician.name}
            className="w-24 h-24 mx-auto rounded-full mb-4"
          />
          <h2 className="text-lg font-bold">{tactician.name}</h2>
          <p className="text-sm text-gray-600">{tactician.description}</p>
        </div>
      ))}
    </div>
  );
}