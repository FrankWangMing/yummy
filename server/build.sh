# URL=

docker login 120.26.170.100:8882

docker build -t 120.26.170.100:8882/market/backend:latest -f Dockerfile .

docker push 120.26.170.100:8882/market/backend:latest



