



export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


export class Tools {
  static UserID() {
    let user_id = sessionStorage.getItem("user_id")
    if (!user_id) {
      user_id = generateUUID();
      sessionStorage.setItem("user_id", user_id);
    }
    return user_id;
  }
  static uuid(){
    return generateUUID()
  }
}