console.log(import.meta.env.MODE)
// export const webSocketUrl = import.meta.env.MODE == "development" ? "ws://localhost:3000" : "ws://49.233.216.137:3000";
export const webSocketUrl = import.meta.env.MODE == "development" ? "ws://localhost:3000" : "wss://yummy.frankwm.cn:3000";

