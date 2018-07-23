app.config(function($stateProvider) {

    $stateProvider.state('root.compare.summary', {
        url: '/summary',
        templateUrl: 'js/main/states/compare/compare.summary.html',
        // resolve: {
        //     summary: function(ImageSvc, $stateParams) {
        //         return ImageSvc.one_postSummary({role: $scope.compareScope.userRole, comparisons: $scope.compareScope.curComparison}).then(function(summary) {
        //              $scope.scores = summary.FeatureScores;
        //             summary.FeatureScores.forEach(function(score) {
        //                 score.Score = + score.Score.toFixed(3);
        //             });
        //             $scope.summaryImgs = summary.images;
        //             return {
        //                 scores: summary.FeatureScores,
        //
        //             }
        //         });
        //     }
        // },
        controller: StateCtrlr
    });

    /*
	 ██████ ████████ ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	██         ██    ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	 ██████    ██    ██   ██ ███████ ██   ██
	*/

    function StateCtrlr($scope, $state, ImageSvc) {
        CORE.log("summary, role + comparison? ", $scope.compareScope.userRole, $scope.compareScope.curComparison);
        $scope.compareScope.showSummary = true;

        if ($scope.compareScope.curComparison) {
            ImageSvc.one_postSummary({role: $scope.compareScope.userRole, comparisons: $scope.compareScope.curComparison}).then(function(summary) {
                $scope.scores = summary.FeatureScores;
                $scope.scores.forEach(function(score) {
                    score.Score = + score.Score.toFixed(3);
                });
                $scope.summaryImgs = summary.images;
            });
        } else {
            $scope.compareScope.showSummary = false;
            $state.go('root.compare.comparisons');
        }

        $scope.scoreSliderOpts = {
            "Symmetry": {
                floor: -1.000,
                ceil: 1.000,
                step: 0.001,
                precision: 2,
                readOnly: true,
                hidePointerLabels: true,
                autoHideLimitLabels: false,
                translate: function(value, sliderId, label) {
                    if (label === "floor") {
                        return "Asymmetric";
                    } else if (label === "ceil") {
                        return "Symmetric";
                    } else {
                        return value;
                    }
                }
            },
            "StructuralEmphasis": {
                floor: -1.000,
                ceil: 1.000,
                step: 0.001,
                precision: 2,
                readOnly: true,
                hidePointerLabels: true,
                autoHideLimitLabels: false,
                translate: function(value, sliderId, label) {
                    if (label === "floor") {
                        return "Subordinate";
                    } else if (label === "ceil") {
                        return "Emphatic";
                    } else {
                        return value;
                    }
                }
            },
            "Slenderness": {
                floor: -1.000,
                ceil: 1.000,
                step: 0.001,
                precision: 2,
                readOnly: true,
                hidePointerLabels: true,
                autoHideLimitLabels: false,
                translate: function(value, sliderId, label) {
                    if (label === "floor") {
                        return "Massive";
                    } else if (label === "ceil") {
                        return "Slender";
                    } else {
                        return value;
                    }
                }
            },
            "Repetition": {
                floor: -1.000,
                ceil: 1.000,
                step: 0.001,
                precision: 2,
                readOnly: true,
                hidePointerLabels: true,
                autoHideLimitLabels: false,
                translate: function(value, sliderId, label) {
                    if (label === "floor") {
                        return "Singular";
                    } else if (label === "ceil") {
                        return "Modular";
                    } else {
                        return value;
                    }
                }
            },
            "Complexity": {
                floor: -1.000,
                ceil: 1.000,
                step: 0.001,
                precision: 2,
                readOnly: true,
                hidePointerLabels: true,
                autoHideLimitLabels: false,
                translate: function(value, sliderId, label) {
                    if (label === "floor") {
                        return "Intricate";
                    } else if (label === "ceil") {
                        return "Simple";
                    } else {
                        return value;
                    }
                }
            }
        }

        // $scope.scoreSlider = function(feature) {
        //     return {
        //         options: {
        //
        //             floor: -1.000,
        //             ceil: 1.000,
        //             step: 0.001,
        //             precision: 2,
        //             readOnly: true,
        //              hideLimitLabels: true,
        //              customValueToPosition:function(val, minVal, maxVal){
        //                  var slope = (1-0)/(maxVal - minVal);
        //                  return slope*(+val-minVal);
        //              },
        //             translate: function(value, sliderId, label) {
        //                 return value;
        //                  if (label === "floor") {
        //                      switch (feature) {
        //                          case "Symmetry":
        //                              return "Asymmetric";
        //                          case "StructuralEmphasis":
        //                              return "Subordinate";
        //                          case "Slenderness":
        //                              return "Massive";
        //                          case "Repetition":
        //                              return "Singular";
        //                          case "Complexity":
        //                              return "Intricate";
        //                          default:
        //                              return value;
        //                      }
        //                  } else if (label === "ceil") {
        //                      switch (feature) {
        //                          case "Symmetry":
        //                              return "Symmetric";
        //                          case "StructuralEmphasis":
        //                              return "Emphatic";
        //                          case "Slenderness":
        //                              return "Slender";
        //                          case "Repetition":
        //                              return "Modular";
        //                          case "Complexity":
        //                              return "Simple";
        //                          default:
        //                              return value;
        //                      }
        //                  } else {
        //                      return value;
        //                  }
        //             }
        //
        //         }
        //     }
        // };
    }
});
