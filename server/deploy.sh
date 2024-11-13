#!/bin/bash

project_name='yummy'

# 定义保存浮点数的文件路径
counter_file="counter.txt"

# 检查保存浮点数的文件是否存在，如果不存在则创建并初始化为0
if [ ! -e "$counter_file" ]; then
  echo "0.0" > "$counter_file"
fi

# 读取当前浮点数
counter=$(cat "$counter_file")

# 定义自增的步长
increment=0.1

# 使用 awk 进行浮点数加法
counter=$(awk -v c="$counter" -v inc="$increment" 'BEGIN {printf "%.1f\n", c + inc}')


# 保存浮点数到文件
echo "$counter" > "$counter_file"

docker login 120.26.170.100:8882

docker build -t 120.26.170.100:8882/$project_name/backend:$counter --platform linux/amd64 -f Dockerfile .

docker push 120.26.170.100:8882/$project_name/backend:$counter

echo "sudo docker rm -f yummy-backend && sudo docker run -p 3000:3000 --name $project_name-backend -it -d 120.26.170.100:8882/$project_name/backend:$counter"




