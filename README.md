# Data & Analytics Framework (DAF) CKAN

CKAN is a powerful data management system that makes data accessible – by providing tools to streamline publishing, sharing, finding and using data. CKAN is a key component consumed by the DAF project.

## What is the Data & Analytics Framework (DAF)?

More informations about the DAF -a.k.a. Piattaforma Digitale Nazionale Dati (PDND)- can be found on the [Digital Transformation Team website](https://teamdigitale.governo.it/it/projects/daf.htm)

## Tools references

The tools used in this repository are

* [CKAN](https://ckan.org/)

## CKAN components

* **CKAN** version 2.6.2. What's inside this repository.

* **Solr** version 6.2, packaged for CKAN and with some customizations. Solr code is available [here](https://github.com/teamdigitale/daf-ckan-solr).

* **PostgreSQL** version 10.1, modified for CKAN. The container is available [here](https://hub.docker.com/r/geosolutionsit/dati-ckan-docker/tags). The image is tagged `postgresql-10.1`.

* **Redis** version 5.0.5. Redis is automatically pulled in as a dependency from its [official Docker repository](https://hub.docker.com/_/redis).

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

## CKAN 2.6.2 extensions reference

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

This is a temporary repository, still maintained because consumed by the production DAF environment. Anyway, an ongoing development work is moving on [here](https://github.com/italia/dati-ckan-docker).
