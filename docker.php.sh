docker_name='staticgen.php'
docker run -tid -p 80:80 --name=$docker_name -v /Users/pitiboy/Work/dev/git/finnoconsult/staticgen/public/:/var/www/html nimmis/apache-php5
docker exec -it $docker_name bash
