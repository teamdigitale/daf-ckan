#!/bin/env bash

eurovoc_to_themes_mapping_file="$CKAN_HOME/src/ckanext-dcatapit/examples/eurovoc_mapping.rdf"
pato_to_eurovoc="$CKAN_HOME/src/ckanext-dcatapit/examples/eurovoc.rdf"
config="${CKAN_CONFIG}/ckan.ini"

# Add user "ckanadmin" with password "ckanpassword". Change password at first login.
paster --plugin=ckan user add ckanadmin email=admin@mail.com password=ckanpassword --config "${config}"
# Add user "ckanadmin" to sysadmin group. 
paster --plugin=ckan sysadmin add ckanadmin --config "${config}"
paster --plugin=ckanext-ldap ldap setup-org -c "${config}"

# Load Vocabulary
paster --plugin=ckanext-dcatapit vocabulary load --url http://publications.europa.eu/mdr/resource/authority/language/skos/languages-skos.rdf --name languages --config "${config}"
paster --plugin=ckanext-dcatapit vocabulary load --url http://publications.europa.eu/mdr/resource/authority/data-theme/skos/data-theme-skos.rdf --name eu_themes --config "${config}"
paster --plugin=ckanext-dcatapit vocabulary load --url http://publications.europa.eu/mdr/resource/authority/place/skos/places-skos.rdf --name places --config "${config}"
paster --plugin=ckanext-dcatapit vocabulary load --url http://publications.europa.eu/mdr/resource/authority/frequency/skos/frequencies-skos.rdf --name frequencies --config "${config}"
paster --plugin=ckanext-dcatapit vocabulary load --url http://publications.europa.eu/mdr/resource/authority/file-type/skos/filetypes-skos.rdf --name filetype --config "${config}"

wget "https://github.com/italia/daf-ontologie-vocabolari-controllati/raw/c998fb435ee77082880b6f98e230ec5273a09e6d/VocabolariControllati/ClassificazioneTerritorio/Istat-Classificazione-08-Territorio.rdf" -O "/tmp/Istat-Classificazione-08-Territorio.rdf"
paster --plugin=ckanext-dcatapit vocabulary load --filename "/tmp/Istat-Classificazione-08-Territorio.rdf" --name regions --config "${config}"

wget "https://raw.githubusercontent.com/italia/daf-ontologie-vocabolari-controllati/master/VocabolariControllati/licences/licences.rdf" -O "/tmp/Licenze.rdf"
paster --plugin=ckanext-dcatapit vocabulary load --filename "/tmp/Licenze.rdf" --name licenses --config "${config}"
paster --plugin=ckanext-dcatapit vocabulary load --filename "$eurovoc_to_themes_mapping_file" --name subthemes --config "${config}" "$pato_to_eurovoc"

APIKEY=$(psql -q -t -h db -U postgres -d ckan -c "select apikey from public.user where name='ckanadmin';")
${CKAN_HOME}/data/init/create.sh $APIKEY localhost:5000
