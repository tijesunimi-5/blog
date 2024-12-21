const users = [
  {
    id: 1,
    name: "Tijesunimi Samuel Idowu",
    profile_picture: "/codelight.jpg",
    bio: "Web developer || 3D artist",
    post: "Web development has been very amazing. Let me show you how it's done she jgie ndkfl heutn heito hsue fhvjg",
    following: 0,
    followers: 0,
    isFollowing: false,
  },
  {
    id: 2,
    name: "Ayomide Grace Ogundeji",
    profile_picture: "/bunnyi.jpg",
    bio: "Beauty care vendor || Accountant",
    post: "To take car of your skin, my page is meant for things like that, follow up to see more details about beauty",
    following: 0,
    followers: 0,
    isFollowing: false,
  },
];

export function getAllUser() {
  return users;
}
