<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Pasos para ejecutar app

1. Clonar repositorio

2. Instalar dependencias

```
npm i
```

3. Instalar Nest CLI

```
npm i -g @nestjs/cli
```

4. Iniciar DB

```
docker-compose up -d
```

docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d