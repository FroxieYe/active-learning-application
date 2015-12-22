###Active Learning Application

============================================
#### Authors
* Wenshuai Ye \<wenshuaiye@g.harvard.edu\>

#### Advisors
* Pavlos Protopapas \<pavlos@seas.harvard.edu\>

#### Acknowledgements
I would like to thank Dr. Pavlos Protopapas for his invaluable assistance and insights leading to the accomplishment of this project.

#### Descripton
This application allows users to label time series graph and enhances the performance of active learning. There are three folders in this repository. The js_files contain the code for the front-end interface and the server, whereas time_series_plot has the time series plot samples that have already been stored in the database. Report contains the Bayesian model report on how to incorporate the result from this application to existed models.

#### Instruction for the Code

```
app.js
```
This is the main node js file that launches the server via node.js (express.js).
```
add_data.js
```
This is an independent js file that provides the API to store new time series objects into the database.
```
db.js
```
We used MongoDB in Modulus to be our database. To make sure the server can be launched, replace the username and password with your own user name and password if you have one already. Otherwise, register on https://modulus.io/.
```
package.json
```
This specifies all the dependencies that app.js requires. This actual modules are in the node_modules folder.
```
views
```
This folder contains files launched by the node.js server (app.js)
```
public
```
This folder contains dependent js, css, and img files for the front-end interface.
```
models
```
This folder contains database schema. Currently we have two schemas, the user profile schema and the object info schema. The object info one has been moved to app.js for test convenience.
```
passport
```
This folder contains js files for user authentication.

