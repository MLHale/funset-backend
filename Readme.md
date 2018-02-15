# FunSet Enrichment Visualization Backend API

The FunSet webserver performs Gene Ontology (GO) enrichment analysis, identifying GO terms that are statistically overrepresented in a target set with respect to a background set. The enriched terms are displayed in a 2D plot that captures the semantic similarity between terms, with the option to cluster the terms and identify a representative term for each cluster. FunSet can be used interactively or programmatically, and allows users to download the enrichment results both in tabular form and in graphical form as SVG files or in data format as JSON.

This is the `backend JSONAPI` portion of FunSet.

## API
The FunSet server is, at its core, a RESTful web service API. It allows users to not only interact with the data using the visualization interface discussed in 2b, but it also provides the raw enrichment and clustering data as JSON. The API is designed to the http://jsonapi.org/ standard to facilitate ease of interaction.

### API endpoints
The API is organized around a set of endpoints that can be invoked programmatically using a REST client, such as POSTMAN, or using any http command line tool, such as CURL. The endpoints it provides are documented below. All are accessible without login.

* **GET** `/runs/<primary key>`
  Returns the data from a previous run.

* **POST** `/runs/invoke`
  Required POST Parameters (must be in submitted using `application/x-www-form-urlencoded` encoding)
  ```
  genes=<comma-seperated-list-of-target-genes>
  background=<comma-seperated-list-of-background-genes>
  p-value=<false detection rate [0-1]> clusters=<desired number of clusters>
  organism=<3-letter organism code>
  ```
  > Acceptable 3 letter codes are: 'hsa','gga','bta','cfa','mmu','rno','cel','ath','dme','sce','eco', or 'dre'

  This will run the enrichment analysis algorithms and return JSONAPI compatible JSON data that lists all of the enriched terms. To retrieve the data for each of the terms, you must request each enriched term as given below.

* **GET** `/runs/<primary key>/recluster?clusters=<desired number of clusters>`
  Returns the same data as /runs/invoke, but only re-runs the clustering algorithm for an existing run.

* **GET** `/enrichments/<enrichment primary key>?include=term,term.parents,genes`
  Returns the enrichment term data and all submodels

* **GET** `/terms/<term primary key>`
  Returns the GO term data for the term matching the primary key

* **GET** `/genes/<gene primary key>`
  Returns the gene name for the gene matching the primary key

### API Data Schema
#### Gene
* id (int)
* name (string)

#### Term
* id (int)
* name (string)
* termid (string, official GO id)
* namespace (string)
* description (string)
* synonym (string)
* parents (many-to-many)

#### Run
* id (int)
* created (date)
* ip (string, requestor's IP)
* enrichements (one-to-many)

#### Enrichment
* id (int)
* term (ForeignKey to associated GO Term)
* pvalue (float - detection rate in sample)
* level (float - enrichment level in sample)
* semanticdissimilarityx (float - x position of term in graph scaled to 0-1)
* semanticdissimilarityy (float - y position of term in graph scaled to 0-1)
* cluster (int - the cluster to which the enriched term is assigned)
* medoid (boolean - true if this term is the metoid of its cluster)
* genes (one-to-many - all genes enriched in the sample)

## License
Funset is a web-based BIOI tool for visualizing genetic pathway information.
Copyright (C) 2017  Matthew L. Hale, Dario Ghersi, Ishwor Thapa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
