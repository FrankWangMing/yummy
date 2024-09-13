import axios, { AxiosInstance } from 'axios';
import { SocketCore } from './socket';
import { Tools } from './tools';

export class Api {
    public http: AxiosInstance
    constructor(
        public socketCore: SocketCore,
    ) {
        this.http = axios.create({
            baseURL: 'http://localhost:3000', // 使用完整的 baseURL
            headers: {
                'Content-Type': 'application/json',
                user_id: Tools.UserID(),
                socket_id: socketCore.id,
            },
        })
        this.http.interceptors.response.use((r) => {
            if (typeof r.data === 'string') {
                try {
                    return JSON.parse(r.data); // 解析为 JSON 对象
                } catch (error) {
                    console.error('Error parsing response:', error);
                    return r.data; // 返回原始字符串
                }
            }
            return r.data.data; // 如果是对象，直接返回
        }, (error) => {
            return Promise.reject(error);
        });
    }

    // 创建会议
    createMeet() {
        return this.http.get('/meet/create'); // 使用相对路径
    }

    // 重新连接会议
    reconnectMeet() {
        return this.http.get('/meet/reconnect'); // 使用相对路径
    }


    // 离开会议
    leaveMeet(meet_id: string) {
        this.http.post('/meet/leave', {
            meet_id
        }); // 使用相对路径
    }
    // 加入会议
    async joinMeet(meet_id: string) {
        try {
            const response = await this.http.post('/meet/join', {
                meet_id,
                socket_id: this.socketCore.id,
            });
            return response; // 返回拦截器处理后的数据
        } catch (error) {
            console.error('Error joining the meeting:', error);
            throw error;
        }
    }
}
