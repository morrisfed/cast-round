#!/bin/sh
#
# Runs the cpanel-deploy workflow using the act tool.
#
# Intended to be used to test the workflow locally before pushing
# to GitHub.
#################################################################

# Find the path to this script.
SCRIPTPATH=$(dirname $(realpath $0))

PROJECTPATH=$(realpath "$SCRIPTPATH/..")

# Load the .env file if it exists, otherwise advise the user to create it.
if [ -f $SCRIPTPATH/.env ]; then
  . $SCRIPTPATH/.env
else
  echo "Please create a .env file in the same directory as this script: $SCRIPTPATH"
  echo "The .env file should be created from the .env.template file and the environment"
  echo "variables set to match your cPanel host."
  exit 1
fi

# Check that keys and the SSH configuration have been created.
KEYSPATH="$SCRIPTPATH/keys"
if [ ! -f $KEYSPATH/cpanel.key ]; then
  echo "Please run tools/gen-cpanel-keys.sh to create the keys and SSH configuration."
  exit 1
fi

cat > "$KEYSPATH/act-vars" <<END
TEST_HOSTING_APP_DOMAIN=$HOSTING_APP_DOMAIN
TEST_HOSTING_APP_SUBDOMAIN=$HOSTING_APP_SUBDOMAIN
TEST_HOSTING_APP_URLPATH=$HOSTING_APP_URLPATH
TEST_HOSTING_APP_INSTALL_DIRECTORY=$HOSTING_APP_INSTALL_DIRECTORY
TEST_HOSTING_WEB_INSTALL_DIRECTORY=$HOSTING_WEB_INSTALL_DIRECTORY

HOSTING_SSH_HOST=$HOSTING_SSH_HOST
HOSTING_SSH_HOST_PORT=$HOSTING_SSH_HOST_PORT
HOSTING_SSH_USER=$HOSTING_SSH_USER

TEST_MYSQL_DATABASE: $MYSQL_DATABASE
TEST_MYSQL_USER: $MYSQL_USER
TEST_MYSQL_PASSWORD: $MYSQL_PASSWORD
TEST_MYSQL_HOST: $MYSQL_HOST
TEST_MYSQL_PORT: $MYSQL_PORT
TEST_SESSION_SECRET: $SESSION_SECRET
TEST_MW_OAUTH2_CLIENT_ID: $MW_OAUTH2_CLIENT_ID
TEST_MW_OAUTH2_CLIENT_SECRET: $MW_OAUTH2_CLIENT_SECRET
TEST_MW_OAUTH2_CALLBACK_URL: $MW_OAUTH2_CALLBACK_URL
TEST_ADMIN_MW_LABEL_ID: $ADMIN_MW_LABEL_ID
END


cat > "$KEYSPATH/act-secrets" <<END
HOSTING_SSH_PRIVATE_KEY=$(cat $KEYSPATH/cpanel.key.singleline)
END

act --platform ubuntu-latest=catthehacker/ubuntu:act-latest --directory "$PROJECTPATH" --workflows "$PROJECTPATH/.github/workflows/cpanel-deploy-TEST.yml" --secret-file "$KEYSPATH/act-secrets" --var-file "$KEYSPATH/act-vars" 