(function () {
  var PERIOD_STATE_PREV   = 'previous',
      PERIOD_STATE_DURING = 'during',
      PERIOD_STATE_AFTER  = 'after'
  ;
  var INT32MAX          = 2147483647,
      INVALID_DATE_STR  = 'Invalid Date';

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

  function getTimeToUpdate (from, to) {
    var time = to - from;
    if (INT32MAX < time) {
      return INT32MAX;
    } else {
      return time;
    }
  }

  function parseDate(stuff) {
    var result = new Date(stuff);
    if (result.toString() === INVALID_DATE_STR) {
      throw new Error('InvalidDate! ng-period can\'t parse "'+stuff+'"');
    }
    console.debug('parse to', result, stuff);
    return result;
  }

  function checkState (from, to) {
    var now = new Date().getTime();
    var state;
    switch (false) {
      // previous: it is a future start time and future end time.
      case !((now < from) && (now < to)):
        state = PERIOD_STATE_PREV;
        break;
      // during: It is a past start time and future end time.
      case !((from <= now) && (now <= to)):
        state = PERIOD_STATE_DURING;
        break;
      // after: It is a past start time and past end time.
      case !((to < now) && (from < now)):
        state = PERIOD_STATE_AFTER;
        break;
    }
    console.debug('[ngPeriod] check state', state, from, to, now);
    return state;
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
          var startAtStuff = scope.$eval(attr.ngPeriodStart),
              endAtStuff   = scope.$eval(attr.ngPeriodEnd)
          ;
          if (!startAtStuff || !endAtStuff) return;

          var startAt = parseDate(startAtStuff).getTime(),
              endAt   = parseDate(endAtStuff).getTime()
          ;

          updatePeriodView(startAt, endAt);
        }

        function __splicePreviousLeaveAnimations (index) {
          return function () {
            previousLeaveAnimations.splice(index, 1);
          };
        }

        function updatePeriodView (from, to) {
          for (var index=0; index<previousTimers.length; index++)
            $timeout.cancel(previousTimers[index]);

          var periodState = checkState(from, to);
          console.debug('[ngPeriod] current state is "%s"', periodState);
          var now = new Date().getTime();
          // set timer for state change to 'during'
          if (periodState === PERIOD_STATE_PREV) {
            console.debug('[ngPeriod] set timer for stage change to "during"', getTimeToUpdate(now, from));
            previousTimers.push($timeout(updatePeriodView, getTimeToUpdate(now, from), true, from, to));
          }
          // set timer for state change to 'after'
          if (periodState === PERIOD_STATE_DURING) {
            console.debug('[ngPeriod] set timer for stage change to "after"', getTimeToUpdate(now, to));
            previousTimers.push($timeout(updatePeriodView, getTimeToUpdate(now, to), true, from, to));
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

