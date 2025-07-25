import { Slider } from '@/components/ui/slider'

export const SearchBar = ({ searchQuery, setSearchQuery, priceRange, setPriceRange, area, setArea }: any) => {
  const areas = ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Thanh Xuân']

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm phòng..."
        className="p-2 w-full sm:w-64 border border-gray-300 rounded-md mb-4 sm:mb-0"
      />

      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-4 sm:mb-0"
      >
        <option value="">Chọn khu vực</option>
        {areas.map((areaOption, index) => (
          <option key={index} value={areaOption}>{areaOption}</option>
        ))}
      </select>

      <div className="w-full sm:w-64">
        <p className="text-sm text-gray-600 mb-2">Khoảng giá</p>
        <Slider
          min={0}
          max={100000}
          step={5000}
          value={priceRange}
          onChange={(value) => setPriceRange(value)}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{priceRange[0]}₫</span>
          <span>{priceRange[1]}₫</span>
        </div>
      </div>
    </div>
  )
}
