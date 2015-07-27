(function () {
  var PERIOD_STATE_PREV   = 'previous',
      PERIOD_STATE_DURING = 'during',
      PERIOD_STATE_AFTER  = 'after'
  ;

  // copy from angularjs v1.3.15
  function getBlockNodes(nodes) {
    var node        = nodes[0],
        blockNodes  = [node]
    ;
    var endNode = nodes[nodes.length - 1];

    do {
      node = node.nextSibling;
      if (!node) break;
      blockNodes.push(node);
    } while (node !== endNode);

    return angular.element(blockNodes);
  }

  // @inject
  function ngPeriodDirective ($animate, $timeout) {
    return {
      restrict: 'A',
      // @inject
      controller: function ($scope) {
        this.cases = {};
      },
      link: function (scope, element, attr, ngPeriodController) {
        var previousTimers          = [],
            previousLeaveAnimations = [],
            selectedScopes          = [],
            selectedElements        = []
        ;

        function ngPeriodWatchAction () {
          var startAtStr = scope.$eval(attr.ngPeriodStart),
              endAtStr   = scope.$eval(attr.ngPeriodEnd)
          ;
          if (!startAtStr || !endAtStr) return;

          var startAt = new Date(startAtStr).getTime(),
              endAt   = new Date(endAtStr).getTime(),
              now     = new Date().getTime()
          ;
          var periodState = null;

          for (var index=0; index<previousTimers.length; index++)
            $timeout.cancel(previousTimers[index]);

          if ((now < startAt) && (now < endAt)) { // previous: it is a future start time and future end time.
            previousTimers.push($timeout(function () {
              updatePeriodView(PERIOD_STATE_DURING);
              previousTimers.push($timeout(function () {
                updatePeriodView(PERIOD_STATE_AFTER);
              }, (endAt - new Date().getTime())));
            }, (startAt - now)));
            periodState = PERIOD_STATE_PREV;
          } else if ((startAt <= now) && (now <= endAt)) { // during: It is a past start time and future end time.
            previousTimers.push($timeout(function () {
              updatePeriodView(PERIOD_STATE_AFTER);
            }, (endAt - now)));
            periodState = PERIOD_STATE_DURING;
          } else if ((endAt < now) && (startAt < now)) { // after: It is a past start time and past end time.
            periodState = PERIOD_STATE_AFTER;
          }
          updatePeriodView(periodState);
        }

        function updatePeriodView (periodState) {
          function __splicePreviousLeaveAnimations (index) {
            return function () {
              previousLeaveAnimations.splice(index, 1);
            };
          }
          for (var index = 0; index < previousLeaveAnimations.length; index++)
            $animate.cancel(previousLeaveAnimations[index]);
          for (var index = 0; index < selectedScopes.length; index++) {
            var selectedElement = getBlockNodes(selectedElements[index].clone);
            selectedScopes[index].$destroy();
            var promise = previousLeaveAnimations[index] = $animate.leave(selectedElement);
            promise.then(__splicePreviousLeaveAnimations(index));
          }
          selectedScopes.length   = 0;
          selectedElements.length = 0;

          var selectedTranscludes = ngPeriodController.cases['!' + periodState];
          if (selectedTranscludes) {
            selectedTranscludes.forEach(function (selectedTransclude) {
              selectedTransclude.transclude(function (caseElement, selectedScope) {
                selectedScopes.push(selectedScope);
                var anchor = selectedTransclude.element;
                caseElement[caseElement.length++] = document.createComment(' end ngPeriodWhen: ');
                var block = { clone: caseElement };
                selectedElements.push(block);
                $animate.enter(caseElement, anchor.parent(), anchor);
              });
            });
          }
        }

        scope.$watch(attr.ngPeriodStart, ngPeriodWatchAction);
        scope.$watch(attr.ngPeriodEnd,   ngPeriodWatchAction);
      }
    };
  }

  function ngPeriodWhenDirective() {
    return {
      transclude:   'element',
      require:      '^ngPeriod',
      restrict:     'A',
      multiElement: true,
      link: function link (scope, element, attr, ctrl, $transclude) {
        ctrl.cases['!' + attr.ngPeriodWhen] = (ctrl.cases['!' + attr.ngPeriodWhen] || []);
        ctrl.cases['!' + attr.ngPeriodWhen].push({
          transclude: $transclude,
          element:    element
        });
      }
    };
  }

  angular.module('angularPeriod', [])
    .directive('ngPeriod', ngPeriodDirective)
    .directive('ngPeriodWhen', ngPeriodWhenDirective)
  ;
}());

