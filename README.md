We will using a single node docker swarm to do the blue-green deployment

```
# Init a docker swarm on the localhost
docker swarm init

# Build the doemo image
docker build . -t demo/hello-server

# Deploy service on docker swarm
$ VERSION=1 docker stack deploy -c docker-compose.yaml app
Ignoring unsupported options: build

Creating network app_default
Creating service app_app

# The server will listen on localhost:3000, make a continuous ping on the port
$ while true; do curl 127.0.0.1:3000 && echo && sleep 1; done
Hello world with version: 1. 2019-11-26T03:28:40.127Z ~ 2019-11-26T03:28:45.130Z
Hello world with version: 1. 2019-11-26T03:28:46.149Z ~ 2019-11-26T03:28:51.117Z
Hello world with version: 1. 2019-11-26T03:28:52.135Z ~ 2019-11-26T03:28:57.137Z
Hello world with version: 1. 2019-11-26T03:28:58.156Z ~ 2019-11-26T03:29:03.160Z

# Do a blue-green deployment
$ VERSION=2 docker stack deploy -c docker-compose.yaml app
Ignoring unsupported options: build

Updating service app_app (id: k5p71lbkljp85ugzaacnamhtb)
image demo/hello-server:latest could not be accessed on a registry to record
its digest. Each node will access demo/hello-server:latest independently,
possibly leading to different nodes running different
versions of the image.

Hello world with version: 1. 2019-11-26T03:28:40.127Z ~ 2019-11-26T03:28:45.130Z
Hello world with version: 1. 2019-11-26T03:28:46.149Z ~ 2019-11-26T03:28:51.117Z
Hello world with version: 1. 2019-11-26T03:28:52.135Z ~ 2019-11-26T03:28:57.137Z
Hello world with version: 1. 2019-11-26T03:28:58.156Z ~ 2019-11-26T03:29:03.160Z
Hello world with version: 1. 2019-11-26T03:29:04.181Z ~ 2019-11-26T03:29:09.183Z
Hello world with version: 2. 2019-11-26T03:29:10.208Z ~ 2019-11-26T03:29:15.216Z
Hello world with version: 2. 2019-11-26T03:29:16.233Z ~ 2019-11-26T03:29:21.202Z
Hello world with version: 2. 2019-11-26T03:29:22.221Z ~ 2019-11-26T03:29:27.223Z

# Cleanup
docker stack rm app
docker swarm leave -f
```

## Explain

By default, docker will send the `SIGTERM` to the process, and node process should do a cleanup before it exit.

`order: start-first` is key that docker swarm will deploy the new deployment before replacement
