// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('anotei', ['ionic', 'mod.utillib', 'ngCordova']).config(function($ionicConfigProvider) {
  if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
})


.run(function($ionicPlatform, factoryDatabase, serviceConfig, serviceConstants) {
  $ionicPlatform.ready(function() {
    if (window.cordova) {
      factoryDatabase.init();
      //TODO: test
      serviceConfig.getConfigNotes().then(
          function(obj){
            serviceConfig.setObjNotes(obj);
          }
      );
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  if (!window.cordova){
    //WHEN ENVIRONMENT IS NOT CORDOVA
    factoryDatabase.init();
    factoryDatabase.setupWEB(serviceConstants.DB_SCHEMA);
    //$rootScope.$broadcast('internal::startedapp');
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
    //controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.subjects', {
    url: "/subjects",
    views: {
      'menuContent': {
        templateUrl: "templates/subjects.html",
        controller: 'SubjectCtrl'
      }
    }
  })

  .state('app.subject-new', {
    url: "/subject-new",
    views: {
      'menuContent': {
        templateUrl: "templates/subject-new.html",
        controller: 'SubjectNewCtrl'
      }
    }
  })

  .state('app.dash-board', {
    url: "/dash-board",
    views: {
      'menuContent': {
        templateUrl: "templates/dash-board.html",
        controller: 'DashBoardCtrl'
      }
    }
  })

  .state('app.homework', {
    url: "/homework",
    views: {
      'menuContent': {
        templateUrl: "templates/homework.html",
        controller: 'HomeworkCtrl'
      }
    }
  })

  .state('app.homework-new', {
    url: "/homework-new",
    views: {
      'menuContent': {
        templateUrl: "templates/homework-new.html",
        controller: 'HomeworkNewCtrl'
      }
    }
  })

  .state('app.exam', {
    url: "/exam",
    views: {
      'menuContent': {
        templateUrl: "templates/exam.html",
        controller: 'ExamCtrl'
      }
    }
  })

  .state('app.exam-new', {
    url: "/exam-new",
    views: {
      'menuContent': {
        templateUrl: "templates/exam-new.html",
        controller: 'ExamNewCtrl'
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
