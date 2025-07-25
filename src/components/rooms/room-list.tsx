import { RoomCard } from "./room-card"

export const RoomList = ({ searchQuery, priceRange, area }) => {
  const rooms = [
    {
      id: 1,
      name: 'Phòng trọ 1',
      area: 'Cầu Giấy',
      price: 3000000,
      description: 'Phòng đầy đủ tiện nghi, gần trường học',
      image: 'https://cdn.chotot.com/iZuyCnfXRji-adKHkRBU9aOY8LEiP1ELoZUjN6ctPxw/preset:view/plain/10e3b5968c4ad1de24dfbb3f860b1b4d-2930499143535519925.jpg',
    },
    {
      id: 2,
      name: 'Phòng trọ 2',
      area: 'Đống Đa',
      price: 2000000,
      description: 'Phòng sạch sẽ, thoáng mát',
      image: 'https://cdn.chotot.com/cTAeIsLQqraYFndHj0zFlMP6nw7HvejUUh8Zr840cYM/preset:view/plain/83ace57e8e148bf1e109de2413739331-2930499143418295026.jpg',
    },
    {
      id: 3,
      name: 'Phòng trọ 3',
      area: 'Thanh Xuân',
      price: 4000000,
      description: 'Có máy lạnh, wifi tốc độ cao',
      image: 'https://cdn.chotot.com/W3h0hZUfJWcNQnGFQqXWaPP-UI5vtnqw54-Plfeg0Sg/preset:view/plain/2d464e85b1c8c75d5247109057974f5e-2930499087713562304.jpg',
    },
    {
      id: 4,
      name: 'Phòng trọ 4',
      area: 'Hoàn Kiếm',
      price: 5000000,
      description: 'Phòng rộng rãi, thuận tiện đi lại',
      image: 'https://cdn.chotot.com/FuRO1CCGyljDbvIxg6PQQ4_8eY2XluanJKp2xzkmUyc/preset:listing/plain/cee14d8fc8afe9241cda22241c764251-2924772497063472735.jpg',
    },
  ]

  const filteredRooms = rooms.filter(room => 
    (room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (area ? room.area === area : true) &&
    (room.price >= priceRange[0] && room.price <= priceRange[1])
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}
