import {getConfig} from './config';
import {execSync} from "child_process";

module.exports = function stopGremlin() {
  const config = getConfig();
  execSync(`
    CONTAINER_IDS=$(docker ps -q --filter "ancestor=${config.imageName}")

    if [ -n "$CONTAINER_IDS" ] ; then
      echo "Stopping containers: $CONTAINER_IDS"
      docker stop $CONTAINER_IDS

      # Allow some time for containers to stop
      sleep 2

      # Remove the stopped containers
      echo "Removing containers: $CONTAINER_IDS"
      docker rm $CONTAINER_IDS
    else
      echo "No containers found with ancestor image '${config.imageName}'."
    fi
  `, {stdio: 'inherit'});
};
