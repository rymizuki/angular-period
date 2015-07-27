# angular-period

[AngularJS](https://angularjs.org/) directive for switching the DOM in the period.

[![Build Status](https://travis-ci.org/rymizuki/node-hariko.svg?branch=master)](https://travis-ci.org/rymizuki/node-hariko)
[![Code Climate](https://codeclimate.com/github/rymizuki/node-hariko/badges/gpa.svg)](https://codeclimate.com/github/rymizuki/node-hariko)
[![Test Coverage](https://codeclimate.com/github/rymizuki/node-hariko/badges/coverage.svg)](https://codeclimate.com/github/rymizuki/node-hariko/coverage)

## Installation

use [bower](http://bower.io/):
```
bower install --save 'git://github.com/rymiuzki/angular-period.git#vX.Y.Z'
```

use [npm](https://www.npmjs.com/):
```
npm install --save 'git://github.com/rymizuki/angular-period.git#vX.Y.Z'
```

## Usage

Include `angular-period` with `angular` in your application.

```html
<script src="/js/angular.min.js"></script>
<script src="/js/angular-period.min.js"></script>
```

Add the module `angularPeriod` as a dependency to your app module.

```javascript
angular.module('app', ['angularPeriod']);
```

Add the directive in your module.

```html
<body>
  <div ng-period ng-period-start="'2015-06-22 00:00:00'" ng-period-end="'2015-06-29 23:59:59'">
    <div ng-period-when="previous">
      <p>The previous period when this section is displayed.</p>
    </div>
    <div ng-period-when="during">
      <p>The duration when this section is displayed.</p>
    </div>
    <div ng-period-when="after">
      <p>The after period when this section is displayed.</p>
    </div>
  </div>
</body>
```

## LICENSE

MIT

