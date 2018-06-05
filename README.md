# Site generator

Static site generator for the Finnoconsult websites and the Finnoblog.

## Technology
The Static Generator is using [MetalSmith](http://www.metalsmith.io/) to build and bundle the contents into static HTML pages.
Several MetalSmith plugins are used to optimize the generated HTML, CSS and JS code, such as
- metalsmith-browserify
- metalsmith-uglify
- for more details see package.js dependencies.

### The render.js module

The content of the generated pages are stored separately in an other repository. See [FinnoConsult portfolio](#portfolio) for exact details.
All of the content pages are generated from [Jade](http://jade-lang.com/) (a.k.a. [Pug](https://www.npmjs.com/package/pug) ) files, based on the well-designed templates located in this repository.

### The minify.js module

This service optimises the belonging assets (CSS, JS) for the generated page.


## Instructions

Once downloaded the repository, you need to build the required Node.js modules:

```
yarn install
```

### Using simply from [Mac|Unix] shellscript

In this case you can call the build script with a *relative_folder_reference* related repository.
```
./build.sh [relative_folder_reference]
```
The *relative_folder_reference* can be located anywhere related to your staticgen project.

### Using with one kind of Node package manager

```
yarn [build*]
```


In this case you need to adhere with the strong of the local file structure, to cope with the built-in *yarn script* references.
This project must be located to **./finnoconsult/staticgen**

### <a name="portfolio"></a> Generate webpages for FinnoConsult portfolio

All related projects has a
- development build (*yarn \*dev*),
- production build (*yarn \*build*),
- production backup (*yarn \*backup*),
- production deployment (*yarn \*deploy*),
feature set.

All *\*build* script deploys content to the local **./finnoconsult/staticgen/public** subfolder

#### Generate finnoconsult.at
```
yarn finno[dev|build|backup|deploy]
```

Local folder structure:
**./finnoconsult/website**

GitHub repository
git clone https://github.com/finnoconsult/website ./finnoconsult/website

#### Generate blog.finnoconsult.at
```
yarn blog[dev|build|backup|deploy]
```
Local folder structure:
**./finnoconsult/blog**

GitHub repository
git clone https://github.com/finnoconsult/finnoblog ./finnoconsult/blog


#### Generate innovaciostanacsado.com
```
yarn inno[dev|build|backup|deploy]
```
Local folder structure:
**./innovaciostanacsado/website**

GitHub repository
git clone https://github.com/finnoconsult/it-website ./innovaciostanacsado/website

#### Generate blueprint.finnoconsult.at
You can generate our empty design, as a FInno HTML blueprint. For this we need no content, nor any content folder repository.
```
yarn blueprint
```
This generated HTML content must be deployed to http://blueprint.finnoconsult.at website (via FTP), however doesn't have built-in yarn deploy script.


## Configuration
### Localisation

Is controlled in the  *content/locales.json* file of the source content repository.

## Copyright

© 2016-2018.
