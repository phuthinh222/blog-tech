export type TeamMember = {
  name: string
  role: string
  initials: string
  color: string
  photo: string
  bio: string
  posts: number
}

export const TEAM: TeamMember[] = [
  {
    name: "Nguyễn Văn An",
    role: "Founder & Chief Editor",
    initials: "NA",
    color: "#7c3aed",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "7 năm kinh nghiệm review công nghệ, từng cộng tác với các tạp chí công nghệ lớn tại Đông Nam Á. Chuyên sâu về smartphone và hệ sinh thái Android.",
    posts: 3,
  },
  {
    name: "Trần Minh Khoa",
    role: "Senior Mobile Reviewer",
    initials: "MK",
    color: "#0ea5e9",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Reviewer chuyên về smartphone flagship và camera mobile. Đã trải nghiệm và đánh giá hơn 200 chiếc điện thoại từ Apple, Samsung đến các hãng Trung Quốc.",
    posts: 2,
  },
  {
    name: "Lê Hoàng Nam",
    role: "Display & PC Hardware Analyst",
    initials: "HN",
    color: "#10b981",
    photo: "https://randomuser.me/api/portraits/men/18.jpg",
    bio: "Chuyên gia phân tích màn hình và phần cứng máy tính. Sở hữu máy đo màu chuyên nghiệp và phòng test tiêu chuẩn để đánh giá chính xác mọi thông số kỹ thuật.",
    posts: 2,
  },
  {
    name: "Phạm Thu Hà",
    role: "Laptop & Accessories Reviewer",
    initials: "TH",
    color: "#f97316",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Reviewer laptop và phụ kiện với hơn 5 năm kinh nghiệm. Đặc biệt am hiểu về trải nghiệm người dùng thực tế — không chỉ benchmark con số mà là cảm giác dùng hàng ngày.",
    posts: 2,
  },
]

export const AUTHOR_PHOTOS: Record<string, string> = Object.fromEntries(
  TEAM.map((m) => [m.name, m.photo])
)
