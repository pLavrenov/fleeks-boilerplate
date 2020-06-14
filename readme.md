# Fleeks - Html Boilerplate (Sass, Ejs, Gulp 4)

A simple set of tools for front-end development


# Getting Started

#### 1) Clone Fleeks Boilerplate:

    $ git clone git@github.com:pLavrenov/fleeks-boilerplate.git fleeks-boilerplate
    $ cd fleeks-boilerplate
    $ npm install

#### 3) Run gulp:

    $ gulp

# Templates

Rin supports [EJS](http://www.embeddedjs.com/) template. When you edit and save `.ejs` files under `src/templates/pages`, they will output as `.html` to `build/` directory.

# Local Server

Rin runs local server by using [BrowserSync](https://www.browsersync.io/). Its default URL is <http://localhost:3000/>. It reloads your browser automatically when you update a file.

# Deploy to gh-pages branch

Run `git subtree` command.

```
git subtree push --prefix build/ origin gh-pages
```

# Author

### Pavel Lavrenov (pLavrenov) - [Fleeks](https://fleeks.ru) company
