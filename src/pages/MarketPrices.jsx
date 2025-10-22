import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabase';

const MarketPrices = () => {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    filterPrices();
  }, [prices, searchTerm, selectedDistrict]);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrices = () => {
    let filtered = [...prices];

    if (searchTerm) {
      filtered = filtered.filter((price) =>
        price.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter((price) => price.district === selectedDistrict);
    }

    setFilteredPrices(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredPrices].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPrices(sorted);
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Crop,Mandi,District,Price,Change'];
    const rows = filteredPrices.map((p) =>
      `${p.crop_name},${p.mandi_name},${p.district},${p.price_per_quintal},${p.price_change_percentage}%`
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market_prices.csv';
    a.click();
  };

  const districts = [...new Set(prices.map((p) => p.district))];

  const chartData = prices
    .slice(0, 10)
    .map((p, i) => ({
      name: p.crop_name.substring(0, 8),
      price: p.price_per_quintal,
    }));

  const topDeals = [...filteredPrices]
    .sort((a, b) => b.price_change_percentage - a.price_change_percentage)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          {t('marketPrices.title')}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('marketPrices.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t('marketPrices.allDistricts')}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>{t('marketPrices.export')}</span>
            </button>
          </div>

          {topDeals.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                {t('marketPrices.bestPrice')} 🎯
              </h3>
              <div className="flex flex-wrap gap-3">
                {topDeals.map((deal, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg"
                  >
                    <span className="font-semibold text-gray-900">{deal.crop_name}</span>
                    <span className="text-sm text-gray-600">@ {deal.mandi_name}</span>
                    <span className="text-sm font-semibold text-green-600">
                      +{deal.price_change_percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th
                    onClick={() => handleSort('crop_name')}
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    {t('marketPrices.crop')}
                  </th>
                  <th
                    onClick={() => handleSort('mandi_name')}
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    {t('marketPrices.mandi')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    District
                  </th>
                  <th
                    onClick={() => handleSort('price_per_quintal')}
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    {t('marketPrices.price')}
                  </th>
                  <th
                    onClick={() => handleSort('price_change_percentage')}
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    {t('marketPrices.change')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No prices found
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((price) => (
                    <tr key={price.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {price.crop_name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{price.mandi_name}</td>
                      <td className="py-3 px-4 text-gray-700">{price.district}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{price.price_per_quintal}
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`flex items-center space-x-1 ${
                            price.price_change_percentage >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {price.price_change_percentage >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            {price.price_change_percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('marketPrices.pricetrend')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
