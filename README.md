# CKAN for Piattaforma Digitale Nazionale Dati (PDND), previously DAF

CKAN is a powerful data management system that makes data accessible – by providing tools to streamline publishing, sharing, finding and using data. CKAN is a key component consumed by the PDND project.

## What is the PDND (previously DAF)?

PDND stays for "Piattaforma Digitale Nazionale Dati" (the Italian Digital Data Platform), previously known as Data & Analytics Framework (DAF).

You can find more informations about the PDND on the official [Digital Transformation Team website](https://teamdigitale.governo.it/it/projects/daf.htm).

## Tools references

The tools used in this repository are

* [CKAN](https://ckan.org/)

## CKAN components

* **CKAN** version 2.6.7. What's inside this repository.

* **Solr** version 6.2, packaged for CKAN and with some customizations. Solr code is available [here](https://github.com/teamdigitale/pdnd-ckan-solr).

* **PostgreSQL** version 10.1, modified for CKAN. The container is available [here](https://hub.docker.com/r/geosolutionsit/dati-ckan-docker/tags). The image is tagged `postgresql-10.1`.

* **Redis** version 5.0.5. Redis is automatically pulled in as a dependency from its [official Docker repository](https://hub.docker.com/_/redis).

## Environment variables

Contributions are welcome. Feel free to [open issues](./issues) and submit a [pull request](./pulls) at any time, but please read [our handbook](https://github.com/teamdigitale/daf-handbook) first.

### General variables

* CKAN_DEBUG *(format: {"true"|"false"})* - Whether to activate or not the debug log messages. It should always be false for production environments.

* CKAN_SITE_URL - The base URL of your CKAN deployment.

* CKAN_ADMIN_EMAIL - The email address of the local admin user.

* CKAN_ADMIN_USERNAME - The user name of the local admin user.

* CKAN_ADMIN_PASSWORD - The password of the local admin user.

### Database variables

* CKAN_DB_HOST - The host name of the CKAN PostgreSQL database.

* CKAN_DB_PORT - The port of the CKAN PostgreSQL database.

* CKAN_DB_USER - The user name of the CKAN PostgreSQL database.

* PGPASSWORD - The password of the CKAN PostgreSQL database.

* CKAN_SQLALCHEMY_URL *(format: {postgresql://{CKAN_DB_USER}:{PGPASSWORD}@{CKAN_DB_HOST}:{CKAN_DB_PORT}/})* - The connection string to your PostgreSQL database.

### Redis variables

* CKAN_REDIS_HOST - The host name of your Redis service.

* CKAN_REDIS_PORT - The port of your Redis service.

* CKAN_REDIS_URL *(format: redis://{CKAN_REDIS_HOST}:/{CKAN_REDIS_PORT})* - The full address of the Redis service.

### Solr variables

* CKAN_SOLR_HOST - The host name of the Solr service.

* CKAN_SOLR_PORT - The port of the Solr service.

* CKAN_SOLR_URL *(format: http://{CKAN_SOLR_HOST}:{CKAN_SOLR_PORT}/solr/ckan)* - The full URL of the Solr service.

## How to build and test CKAN

In this repository, CKAN and its related tools are redistributed as a set of Docker containers interacting with one each other.

The `dockerfile` and the `docker-compose.yaml` files are in the root of this repository.

To build the local test environment (build the CKAN container and download dependencies) run:

```shell
docker-compose up -d
```

>NOTE: the `docker-compose.yaml` file sets different environment variables that could be used to adapt and customized many platform functionalities.

Then, access the CKAN GUI in a browser at `http://localhost:5000`.

The following default credentials can be used to access the portal

```
Username: ckanadmin
Password: ckanpassword
```

> NOTE: Credentials should be changed after the first login.

To bring down the test environment and remove the containers use

```shell
docker-compose down
```

## CKAN 2.6.4 extensions reference

```
0   "stats"
1   "text_view"
2   "image_view"
3   "recline_view"
4   "harvest"
5   "ckan_harvester"
6   "dcat"
7   "dcat_rdf_harvester"
8   "dcat_json_harvester"
9   "dcat_json_interface"
10  "dcatapit_pkg"
11  "dcatapit_org"
12  "dcatapit_config"
13  "dcatapit_harvester"
```

## How to contribute

Contributions are welcome. Feel free to open issues and submit a pull request at any time!

This repository is very specific to the PDND project that could be used as an example. Meanwhile, the community is working on an generic, [redistributable version](https://github.com/italia/dati-ckan-docker).

## License

Copyright (c) 2019 Presidenza del Consiglio dei Ministri

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
