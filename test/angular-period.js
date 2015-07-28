describe('angularPeriod', function () {
  var $compile,
      $rootScope,
      $timeout,
      clock,
      now;
  beforeEach(module('angularPeriod'));
  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile    = _$compile_;
    $rootScope  = _$rootScope_;
    $timeout    = _$timeout_;
  }));
  beforeEach(function () {
    clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    clock.restore();
  });
  beforeEach(function () {
    now = new Date();
  });

  var dom = '<div ng-period ng-period-start="startAt" ng-period-end="endAt">'+
            '  <div ng-period-when="previous">previous</div>'+
            '  <div ng-period-when="during">during</div>'+
            '  <div ng-period-when="after">after</div>'+
            '</div>';

  describe('period specified previous', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.startAt = now.getTime() + 1000;
      $scope.endAt   = now.getTime() + 2000;
    });
    afterEach(function () {
      $scope.$destroy();
    });
    it('should be activate previous section', function () {
      var element = $compile(dom)($scope); $rootScope.$digest();
      expect(element.html()).to.be.eql(
        '  <!-- ngPeriodWhen: previous --><div ng-period-when="previous" class="ng-scope">previous</div><!-- end ngPeriodWhen: -->'+
        '  <!-- ngPeriodWhen: during -->'+
        '  <!-- ngPeriodWhen: after -->'
      );
    });
    describe('after lapse of time of up to start', function () {
      it('should be activate during', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        clock.tick(1000);
        $timeout.flush(1000);
        $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
          '  <!-- ngPeriodWhen: after -->'
        );
      });
    });
    describe('after lapse of time of up to end', function () {
      it('should be activate after', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        clock.tick(2001);
        $timeout.flush(2001);
        $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during -->'+
          '  <!-- ngPeriodWhen: after --><div ng-period-when="after" class="ng-scope">after</div><!-- end ngPeriodWhen: -->'
        );
      });
    });
  });
  describe('period specified during', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.startAt = now.getTime() - 10000;
      $scope.endAt   = now.getTime() + 10000;
    });
    afterEach(function () {
      $scope.$destroy();
    });
    it('should be activate during', function() {
      var element = $compile(dom)($scope); $rootScope.$digest();
      expect(element.html()).to.be.eql(
        '  <!-- ngPeriodWhen: previous -->'+
        '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
        '  <!-- ngPeriodWhen: after -->'
      );
    });
    describe('after lapse of time of a little', function () {
      it('should not changed from during', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        clock.tick(1000);
        $timeout.flush(1000);
        $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
          '  <!-- ngPeriodWhen: after -->'
        );
      });
    });
    describe('after lapse of time of up to end', function () {
      it('should be activate after', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        clock.tick(10001);
        $timeout.flush(10000);
        $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during -->'+
          '  <!-- ngPeriodWhen: after --><div ng-period-when="after" class="ng-scope">after</div><!-- end ngPeriodWhen: -->'
        );
      });
    });
  });
  describe('period specified during', function () {
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.startAt = now.getTime() - 20000;
      $scope.endAt   = now.getTime() - 10000;
    });
    afterEach(function () {
      $scope.$destroy();
    });
    describe('after lapse of time of up to end', function () {
      it('should be activate after', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during -->'+
          '  <!-- ngPeriodWhen: after --><div ng-period-when="after" class="ng-scope">after</div><!-- end ngPeriodWhen: -->'
        );
      });
    });
  });
  describe('period specified duration int32Max', function () {
    var int32Max = 2147483647;
    var $scope;
    beforeEach(function () {
      $scope = $rootScope.$new();
    });
    afterEach(function () {
      $scope.$destroy();
    });
    describe('within int32Max', function () {
      beforeEach(function () {
        $scope.startAt = now.getTime() - 10000;
        $scope.endAt   = now.getTime() + int32Max;
      });
      it('should be activate during', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
          '  <!-- ngPeriodWhen: after -->'
        );
      });
      describe('after lapse of time of a little', function () {
        it('should not changed from during', function() {
          var element = $compile(dom)($scope); $rootScope.$digest();
          clock.tick(1000);
          $timeout.flush(1000);
          $rootScope.$digest();
          expect(element.html()).to.be.eql(
            '  <!-- ngPeriodWhen: previous -->'+
            '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
            '  <!-- ngPeriodWhen: after -->'
          );
        });
      });
      describe('after lapse of time of up to end', function () {
        it('should be activate after', function() {
          var element = $compile(dom)($scope); $rootScope.$digest();
          clock.tick(int32Max + 1);
          $timeout.flush(int32Max + 1);
          $rootScope.$digest();
          expect(element.html()).to.be.eql(
            '  <!-- ngPeriodWhen: previous -->'+
            '  <!-- ngPeriodWhen: during -->'+
            '  <!-- ngPeriodWhen: after --><div ng-period-when="after" class="ng-scope">after</div><!-- end ngPeriodWhen: -->'
          );
        });
      });
    });
    describe('over the int32Max', function () {
      beforeEach(function () {
        $scope.startAt = now.getTime() - 10000;
        $scope.endAt   = now.getTime() + int32Max + 1;
      });
      it('should be activate during', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        expect(element.html()).to.be.eql(
          '  <!-- ngPeriodWhen: previous -->'+
          '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
          '  <!-- ngPeriodWhen: after -->'
        );
      });
      describe('after lapse of time of a little', function () {
        it('should not changed from during', function() {
          var element = $compile(dom)($scope); $rootScope.$digest();
          clock.tick(1000);
          $timeout.flush(1000);
          $rootScope.$digest();
          expect(element.html()).to.be.eql(
            '  <!-- ngPeriodWhen: previous -->'+
            '  <!-- ngPeriodWhen: during --><div ng-period-when="during" class="ng-scope">during</div><!-- end ngPeriodWhen: -->'+
            '  <!-- ngPeriodWhen: after -->'
          );
        });
      });
      describe('after lapse of time of up to end', function () {
        it('should be activate after', function() {
          var element = $compile(dom)($scope); $rootScope.$digest();
          clock.tick(int32Max + 1);
          $timeout.flush(int32Max + 1);
          $rootScope.$digest();
          expect(element.html()).to.be.eql(
            '  <!-- ngPeriodWhen: previous -->'+
            '  <!-- ngPeriodWhen: during -->'+
            '  <!-- ngPeriodWhen: after --><div ng-period-when="after" class="ng-scope">after</div><!-- end ngPeriodWhen: -->'
          );
        });
      });
    });
  });
});
