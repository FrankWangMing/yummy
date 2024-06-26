
# Tag=1.3

# docker-compose build
# docker tag  bookmanager:latest  console.frankwm.cn/travelgo/backend:$Tag
# docker push console.frankwm.cn/travelgo/backend:$Tag


sudo docker-compose -f docker-compose.db.yml up -d --build
sudo docker-compose -f docker-compose.migrate.yml up -d --build
sudo docker-compose up -d --build
sudo docker exec -it bookmanager npm run seed 