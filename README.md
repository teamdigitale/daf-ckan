# Data & Analytics Framework (DAF) CKAN

CKAN is a powerful data management system that makes data accessible – by providing tools to streamline publishing, sharing, finding and using data. CKAN is a key component consumed by the DAF project.

## What is the Data & Analytics Framework (DAF)?

More informations about the DAF can be found on the [Digital Transformation Team website](https://teamdigitale.governo.it/it/projects/daf.htm)

## Tools references

The tools used in this repository are

* [CKAN](https://ckan.org/)

## CKAN components

* **CKAN** the tool included in this repository

* **Solr** (packeged for CKAN and with some customizations), available [here](https://github.com/teamdigitale/daf-ckan-solr)

* **PostgreSQL** version 10.1 is certified to work with the current CKAN distribution. PostgreSQL is pulled in as a dependency from the official Docker repositories (see Docker documentation below).

* **Redis** version XX.XX is certified to work with the current CKAN distribution. Redies is automatically pulled in as a dependency from the official Docker repositories (see Docker documentation below).

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

## How to build and test CKAN

In this repository, CKAN and its related tools are redistributed as a set of Docker containers interacting with one each other.

The tools needed to build the `CKAN container` and a working local test environment are provided in the `docker` folder of this repository. The commands below should be run from such folder.

Build the local test environment (build the CKAN container and download dependencies)

```shell
docker-compose up -d
```

Load "ckan vocabulary" in ckan container:

```shell
docker exec -it ckandcat /bin/bash -c ./ckan-vocabulary.sh
```

Access ckan server with browser at this link `http://localhost:5000`

The following default credentials can be used to access the portal

```
User: ckanadmin
Password: ckanpassword
```

> NOTE: Credentials should be changed after the first login.

## How to contribute

Contributions are welcome. Feel free to open issues and submit a pull request at any time!

This is a temporary repository, still maintained because consumed by the production DAF environment. Anyway, an ongoing development work is moving on [here](https://github.com/italia/dati-ckan-docker).
