# angular-period

[AngularJS](https://angularjs.org/) directive for switching the DOM in the period.

[![npm version](https://badge.fury.io/js/angular-period.svg)](http://badge.fury.io/js/angular-period)
[![Bower version](https://badge.fury.io/bo/angular-period.svg)](http://badge.fury.io/bo/angular-period)
[![Build Status](https://travis-ci.org/rymizuki/angular-period.svg?branch=master)](https://travis-ci.org/rymizuki/angular-period)
[![Codacy Badge](https://www.codacy.com/project/badge/5d397cce7c904909a1e26d69bd7f6a99)](https://www.codacy.com/app/ry-mizuki/angular-period)
[![Code Climate](https://codeclimate.com/github/rymizuki/angular-period/badges/gpa.svg)](https://codeclimate.com/github/rymizuki/angular-period)
[![Test Coverage](https://codeclimate.com/github/rymizuki/angular-period/badges/coverage.svg)](https://codeclimate.com/github/rymizuki/angular-period/coverage)
[![Dependency Status](https://gemnasium.com/rymizuki/angular-period.svg)](https://gemnasium.com/rymizuki/angular-period) 

## Installation

use [bower](http://bower.io/):
```
bower install --save angular-period
```

use [npm](https://www.npmjs.com/):
```
npm install --save angular-period
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
  <div ng-period ng-period-start="'2015-06-22T00:00:00'" ng-period-end="'2015-06-29T23:59:59'">
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

## About date parsing

`ngPeriod` dosen't support date string parsing.

If you seek safety, please specify the `Date Object` or [momentjs](http://momentjs.com/) etc.
Date class that compatible with the library in ngperiod.

## LICENSE

MIT

