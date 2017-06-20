#!/usr/bin/env bash
#!/usr/bin/env bash
if [[ $1 == 'yes' ]]; then
    echo "Running docker test with the build command"
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
else
    echo "Running docker test without the build command"
    docker-compose -f docker-compose.test.yml up --abort-on-container-exit
fi
