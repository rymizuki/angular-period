describe('angularPeriod', function () {
  var $compile,
      $rootScope,
      $timeout,
      now,
      clock;
  beforeEach(module('angularPeriod'));
  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile    = _$compile_;
    $rootScope  = _$rootScope_;
    $timeout    = _$timeout_;
  }));
  beforeEach(function () {
    now   = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });
  afterEach(function () {
    clock.restore();
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
      $scope.startAt = now.getTime() + 10000;
      $scope.endAt   = now.getTime() + 20000;
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
        clock.tick(10000 + 10);
        $timeout.flush();
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
        clock.tick(20000 + 10);
        $timeout.flush();
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
    describe('after lapse of time of up to end', function () {
      it('should be activate after', function() {
        var element = $compile(dom)($scope); $rootScope.$digest();
        clock.tick(20000 + 10);
        $timeout.flush();
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
});
