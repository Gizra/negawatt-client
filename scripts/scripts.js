"use strict";angular.module("negawattClientApp",["angularMoment","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","leaflet-directive","config","LocalStorageModule","ui.router","googlechart","angular-md5","angular-loading-bar","ui.bootstrap.tabs","template/tabs/tab.html","template/tabs/tabset.html","angularMoment","angular-nw-weather"]).config(["$stateProvider","$urlRouterProvider","$httpProvider","cfpLoadingBarProvider",function(a,b,c,d){b.when("/",["$injector","$location","$state","Profile",function(a,b,c,d){d.get().then(function(a){a&&c.go("dashboard.withAccount",{accountId:a.account[0].id})})}]),b.otherwise(""),a.state("login",{url:"/login",templateUrl:"views/login.html"}).state("logout",{url:"/logout",template:"<ui-view/>",controller:["Auth","$state",function(a,b){a.logout(),b.go("login")}]}).state("dashboard",{"abstract":!0,url:"/",templateUrl:"views/dashboard/main.html",resolve:{profile:["Profile",function(a){return a.get()}]},controller:"DashboardCtrl"}).state("dashboard.withAccount",{url:"dashboard/{accountId:int}?{chartFreq:int}&{chartNextPeriod:int}&{chartPreviousPeriod:int}",reloadOnSearch:!1,params:{chartFreq:{value:2}},resolve:{account:["$stateParams","Profile","profile",function(a,b,c){return b.selectAccount(a.accountId,c)}],meters:["Meter","account","$stateParams","Category","MeterFilter",function(a,b){return a.get(b.id)}],categories:["Category","account",function(a,b){return a.get(b.id)}],messages:["Message",function(a){return a.get()}],limits:["meters",function(a){return a.total.electricity_time_interval}]},views:{"menu@dashboard":{templateUrl:"views/dashboard/main.menu.html",controller:"MenuCtrl"},"map@dashboard":{templateUrl:"views/dashboard/main.map.html",controller:"MapCtrl"},"categories@dashboard":{templateUrl:"views/dashboard/main.categories.html",controller:"CategoryCtrl"},"messages@dashboard":{templateUrl:"views/dashboard/main.messages.html",controller:"MessageCtrl"},"details@dashboard":{templateUrl:"views/dashboard/main.details.html",resolve:{categoriesChart:["ChartCategories","account","categories","$stateParams",function(a,b,c,d){return a.get(b.id,d.categoryId,c.collection)}]},controller:"DetailsCtrl"},"usage@dashboard":{templateUrl:"views/dashboard/main.usage.html",resolve:{usage:["ChartUsage","$state","$stateParams","account","meters",function(a,b,c,d,e){return"dashboard.withAccount"==b.current.name?a.get(d.id,c,e.list):{}}]},controller:"UsageCtrl"}}}).state("dashboard.withAccount.categories",{url:"/category/{categoryId:int}",reloadOnSearch:!1,resolve:{meters:["Meter","$stateParams","account","MeterFilter",function(a,b,c,d){return d.filters.category=+b.categoryId,a.get(c.id,b.categoryId)}]},views:{"map@dashboard":{templateUrl:"views/dashboard/main.map.html",controller:"MapCtrl"},"usage@dashboard":{templateUrl:"views/dashboard/main.usage.html",resolve:{limits:["categories","$stateParams",function(a,b){var c=a.collection[b.categoryId].electricity_time_interval;return{max:c.max,min:c.min}}],usage:["ChartUsage","$stateParams","account","meters","UsagePeriod","limits",function(a,b,c,d,e,f){return e.setLimits(f),a.get(c.id,b,d.list,e.getPeriod())}]},controller:"UsageCtrl"},"categories@dashboard":{templateUrl:"views/dashboard/main.categories.html",controller:"CategoryCtrl"},"details@dashboard":{templateUrl:"views/dashboard/main.details.html",resolve:{categoriesChart:["ChartCategories","$stateParams","account","categories",function(a,b,c,d){return a.get(c.id,b.categoryId,d.collection)}]},controller:"DetailsCtrl"}}}).state("dashboard.withAccount.markers",{url:"/marker/:markerId?categoryId",reloadOnSearch:!1,resolve:{meters:["Meter","$stateParams","account","MeterFilter",function(a,b,c,d){return d.filters.category=+b.categoryId,d.filters.meter=+b.markerId,a.get(c.id,b.categoryId)}]},views:{"map@dashboard":{templateUrl:"views/dashboard/main.map.html",controller:"MapCtrl"},"categories@dashboard":{templateUrl:"views/dashboard/main.categories.html",controller:"CategoryCtrl"},"details@dashboard":{templateUrl:"views/dashboard/main.details.html",resolve:{categoriesChart:angular.noop},controller:"DetailsCtrl"},"usage@dashboard":{templateUrl:"views/dashboard/main.usage.html",resolve:{limits:["meters","$stateParams",function(a,b){var c=a.list[b.markerId]&&a.list[b.markerId].electricity_time_interval;return{max:c&&c.max||{},min:c&&c.min||{}}}],usage:["ChartUsage","$stateParams","account","meters","UsagePeriod","limits",function(a,b,c,d,e,f){return e.setLimits(f),a.get(c.id,b,d.list,e.getPeriod())}]},controller:"UsageCtrl"}}}),c.interceptors.push(["$q","Auth","$location","localStorageService",function(a,b,c,d){return{request:function(a){return a.withoutToken||a.url.match(/.html/)||angular.extend(a.headers,{"access-token":d.get("access_token")}),a},response:function(a){return a.data.access_token&&d.set("access_token",a.data.access_token),a},responseError:function(c){return 401===c.status&&b.authFailed(),a.reject(c)}}}]),d.includeSpinner=!1,d.latencyThreshold=1e3}]).run(["$rootScope","$state","$stateParams","$log","Config","amMoment",function(a,b,c,d,e,f){f.changeLocale("he"),a.$state=b,a.$stateParams=c,e.debugUiRouter&&(a.$on("$stateChangeStart",function(a,b,c){d.log("$stateChangeStart to "+b.to+"- fired when the transition begins. toState,toParams : \n",b,c)}),a.$on("$stateChangeError",function(){d.log("$stateChangeError - fired when an error occurs during transition."),d.log(arguments)}),a.$on("$stateChangeSuccess",function(a,b){d.log("$stateChangeSuccess to "+b.name+"- fired once the state transition is complete.")}),a.$on("$viewContentLoaded",function(a){d.log("$viewContentLoaded - fired after dom rendered",a)}),a.$on("$stateNotFound",function(a,b,c,e){d.log("$stateNotFound "+b.to+"  - fired when a state cannot be found by its name."),d.log(b,c,e)}))}]),angular.module("negawattClientApp").controller("AccessCtrl",["$window","$scope","$state","Auth","Profile",function(a,b,c,d){b.loginButtonEnabled=!0,b.loginFailed=!1,b.login=function(e){b.loginButtonEnabled=!1,d.login(e).then(function(){a.location="#/"},function(){c.go("login"),b.loginButtonEnabled=!0,b.loginFailed=!0})},b.logout=function(){d.logout(),c.go("login")}}]),angular.module("negawattClientApp").controller("DashboardCtrl",["$state","$stateParams","profile",function(a,b,c){var d;c?!Object.keys(b).length&&a.is("dashboard")&&(d=c.account[0].id,a.go("dashboard.withAccount",{accountId:d})):a.go("login")}]),angular.module("negawattClientApp").controller("UsageCtrl",["$scope","$q","$location","$state","$stateParams","$urlRouter","ChartUsage","UsagePeriod","limits","account","usage","meters",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(a){a.active=!0}function n(a){c.search(a),f.update(!0),p=!0}function o(b,c){angular.isUndefined(c)&&!d.transition&&(angular.isDefined(e.chartNextPeriod)||angular.isDefined(e.chartNextPeriod))&&(c={next:e.chartNextPeriod,previous:e.chartPreviousPeriod},angular.extend(b,{chartNextPeriod:e.chartNextPeriod,chartPreviousPeriod:e.chartPreviousPeriod})),a.isLoading=!0,angular.isDefined(e.markerId)&&(c=angular.extend(c||{},l.list[e.markerId]&&l.list[e.markerId].electricity_time_interval)),g.get(j.id,e,l.list,c).then(function(b){a.usageChartData=b,a.isLoading=!1}),n(b)}var p;a.usageChartData={},a.frequencies=g.getFrequencies(),h.setLimits(i);var q=g.get(j.id,e,l.list,h.getPeriod());q.then(function(b){a.usageChartData=a.usageChartData||b,q=void 0}),angular.isDefined(e.chartFreq)&&m(a.frequencies[e.chartFreq-1]),angular.isDefined(e.markerId)&&(a.meterSelected=l.list[e.markerId],g.meterSelected(l.list[e.markerId])),a.changeFrequency=function(){var a={};this.frequencies&&e.chartFreq!==this.frequencies[this.$index].type&&(e.chartFreq=this.frequencies[this.$index].type,p&&(delete e.chartNextPeriod,delete e.chartPreviousPeriod)),angular.extend(a,c.search(),{chartFreq:e.chartFreq}),o(a)},a.changePeriod=function(a){var b={};angular.extend(b,{chartFreq:e.chartFreq,chartNextPeriod:a.next,chartPreviousPeriod:a.previous}),o(b,a)},a.$on("nwElectricityChanged",function(b,c){c==g.getActiveRequestHash()&&g.getByFiltersHash(c).then(function(b){a.usageChartData=b})})}]),angular.module("negawattClientApp").controller("MapCtrl",["$scope","$state","$stateParams","Category","ChartUsage","Map","leafletData","$timeout","account","meters","MeterFilter",function(a,b,c,d,e,f,g,h,i,j,k){function l(b){h(function(){var c=f.getMarkerSelected();angular.isDefined(c)&&angular.isDefined(a.meters[c])&&a.meters[f.getMarkerSelected()].unselect(),angular.isDefined(a.meters[b])&&(a.meters[b].select(),f.setMarkerSelected(b),m=!0)})}var m=!1;a.defaults=f.getConfig(),a.center=f.getCenter(i),a.meters=j.list,a.$on("leafletDirectiveMarker.mouseover",function(a,b){var d=b.markerName;if(c.openedPopup!==d){c.openedPopup=d;var e=b.leafletEvent.target;e.openPopup()}}),a.$on("leafletDirectiveMarker.mouseout",function(a,b){var d=b.leafletEvent.target;d.closePopup(),c.openedPopup=null}),a.$on("leafletDirectiveMap.dragend",function(){g.getMap().then(function(a){f.setCenter(a.getCenter())})}),a.$on("leafletDirectiveMap.zoomend",function(){g.getMap().then(function(a){f.updateCenterZoom(a.getZoom())})}),a.$on("nwMetersChanged",function(b,c){a.meters=c.list,k.filters.meter&&a.meters[k.filters.meter]&&!m&&l(k.filters.meter)}),a.$on("leafletDirectiveMarker.click",function(a,c){b.forceGo("dashboard.withAccount.markers",{markerId:c.markerName,categoryId:d.getSelectedCategory()})}),c.markerId&&(m=l(c.markerId))}]),angular.module("negawattClientApp").controller("CategoryCtrl",["$scope","$state","$stateParams","$filter","Category","Meter","categories","meters",function(a,b,c,d,e,f,g,h){function i(){var b=[];return angular.forEach(a.categoriesChecked,function(a,b){a||this.push(b)},b),b}function j(a){e.setSelectedCategory(a)}a.categoriesChecked={},a.categories=g,a.accountId=c.accountId,a.chartFreq=c.chartFreq,b.is("dashboard.withAccount")&&(a.filterMeters=!0),a.hasMeters=function(a){return!!a.meters},a.toggleMetersByCategory=function(){a.$parent.$broadcast("nwMetersChanged",{list:d("filterMeterByCategories")(h.list,i())})},a.select=function(a){b.forceGo("dashboard.withAccount.categories",{categoryId:a})},c.categoryId&&j(c.categoryId)}]),angular.module("negawattClientApp").controller("DetailsCtrl",["$scope","$state","$stateParams","ChartCategories","categoriesChart","meters",function(a,b,c,d,e,f){function g(b){a.meterSelected=f.list[b]}var h;a.categoriesChart=e,a.onSelect=function(a,e){h=d.getCategoryIdSelected(a,e),angular.isDefined(h)&&b.go("dashboard.withAccount.categories",{accountId:c.accountId,categoryId:h})},c.markerId&&g(c.markerId)}]),angular.module("negawattClientApp").controller("MenuCtrl",["$scope","$state","$stateParams","$location","$window","amMoment","Timedate","Category","account","profile","MeterFilter","Meter",function(a,b,c,d,e,f,g,h,i,j,k,l){a.account=i,a.user=j.user,a.timedate=g,a.accountId=c.accountId,a.reloadDashboard=function(){h.clearSelectedCategory(),k.clear(),l.refresh(),e.location=b.href("dashboard.withAccount")}}]),angular.module("negawattClientApp").controller("MessageCtrl",["$scope","$state","messages",function(a,b,c){a.messages=c}]),angular.module("negawattClientApp").service("Auth",["$injector","$rootScope","Utils","localStorageService","Config",function(a,b,c,d,e){this.login=function(b){return a.get("$http")({method:"GET",url:e.backend+"/api/login-token",headers:{Authorization:"Basic "+c.Base64.encode(b.username+":"+b.password)},withoutToken:!0})},this.logout=function(){d.remove("access_token"),b.$broadcast("nwClearCache")},this.isAuthenticated=function(){return!!d.get("access_token")},this.authFailed=function(){a.get("$state").go("login"),this.logout()}}]),angular.module("negawattClientApp").service("Category",["$q","$http","$timeout","$state","$rootScope","$filter","Config","Utils","Meter",function(a,b,c,d,e,f,g,h,i){function j(c){var d=a.defer(),e=g.backend+"/api/meter_categories",f={account:c};return b({method:"GET",url:e,params:f,cache:!0}).success(function(a){d.resolve(a.data)}),d.promise}function k(b,c){var d=a.defer();return b.then(function(a){a=angular.copy(a),a.collection=f("filter")(h.toArray(a.collection),{id:parseInt(c)},!0).pop().children,d.resolve(a)}),d.promise}function l(a){u={data:a,timestamp:new Date},c(function(){u.data=void 0},6e4),e.$broadcast(v)}function m(b,c){var d=a.defer();return i.get(c).then(function(a){t.meters=h.toArray(a.listAll),b.then(n).then(o).then(function(a){l(a),d.resolve(u.data)})}),d.promise}function n(b){var c,d=a.defer(),e=angular.isArray(b)?b:b.list;return angular.forEach(e,function(a){a.meters=0},e),t.indexed=h.indexById(e),c=t.meters.map(function(a){return a.meter_categories?a.meter_categories:[]}),angular.forEach(c,function(a){angular.forEach(a,function(a){var b=[+a.id];angular.forEach(b,function(a){t.indexed[a].meters++})})}),e=h.toArray(t.indexed),d.resolve(e),d.promise}function o(b){var c=a.defer(),d={};return d.list=b,d.collection=p(b),d.tree=q(b),c.resolve(d),c.promise}function p(a){return h.indexById(a)}function q(a){var b;return a=r(a),b=f("filter")(a,{depth:0})}function r(a){var b=h.indexById(a),c=[];return angular.forEach(a,function(a){angular.forEach(a.children,function(c,d){angular.isString(c)&&(a.children[d]=b[c])}),this.push(a)},c),a}var s,t=this,u={},v="nwCategoriesChanged";this.getSelectedCategory=function(){return u.selected},this.setSelectedCategory=function(a){u.selected=a},this.clearSelectedCategory=function(){u.selected=void 0},this.get=function(b,c){return s=a.when(s||angular.copy(u.data)||j(b)),s=m(s,b),angular.isDefined(c)&&(s=k(s,c)),s["finally"](function(){s=void 0}),s},e.$on("nwClearCache",function(){u={}})}]),angular.module("negawattClientApp").factory("Chart",function(){return{messages:{empty:"אין מספיק נתונים כדי להציג את התרשים."}}}),angular.module("negawattClientApp").service("ChartUsage",["$q","Electricity","UsagePeriod","Chart","moment",function(a,b,c,d,e){var f=this,g=[{frequency:"year",label:"שנה",type:"1"},{frequency:"month",label:"חודש",type:"2"},{frequency:"day",label:"יום",type:"3"},{frequency:"hour",label:"שעה",type:"4"},{frequency:"minute",label:"דקות",type:"5"}];this.usageGoogleChartParams={},this.meters,this.multipleGraphs,this.usageChartParams={frequency:2},this.frequencyParams={1:{frequency:"year",label:"שנה",type:"1",unit_num_seconds:31536e3,chart_default_time_frame:10,chart_type:"ColumnChart",axis_v_title:'קוט"ש בחודש',axis_h_format:"YYYY",axis_h_title:"שנה"},2:{frequency:"month",label:"חודש",type:"2",unit_num_seconds:2678400,chart_default_time_frame:24,chart_type:"ColumnChart",axis_v_title:'קוט"ש בשנה',axis_h_format:"MM-YYYY",axis_h_title:"חודש"},3:{frequency:"day",label:"יום",type:"3",unit_num_seconds:86400,chart_default_time_frame:14,chart_type:"ColumnChart",axis_v_title:'קוט"ש ביום',axis_h_format:"DD-MM",axis_h_title:"תאריך"},4:{frequency:"hour",label:"שעה",type:"4",unit_num_seconds:3600,chart_default_time_frame:168,chart_type:"LineChart",axis_v_title:"KW",axis_h_format:"HH",axis_h_title:"שעה"},5:{frequency:"minute",label:"דקות",type:"5",unit_num_seconds:60,chart_default_time_frame:1440,chart_type:"LineChart",axis_v_title:"KW",axis_h_format:"HH",axis_h_title:"שעה"}},this.activeRequestHash,this.filtersHashToFreq={},this.getActiveRequestHash=function(){return this.activeRequestHash},this.filtersFromSelector=function(a,b,c,d,e){var f={"filter[meter_account]":a,"filter[type]":b||this.usageChartParams.frequency,"filter[timestamp][operator]":"BETWEEN","filter[timestamp][value][0]":e.previous,"filter[timestamp][value][1]":e.next};if(c)if(this.multipleGraphs){f["filter["+c+"][operator]"]="IN";var g=0;angular.forEach(d,function(a){f["filter["+c+"][value]["+g++ +"]"]=a})}else f["filter["+c+"]"]=d;return f},this.get=function(d,e,g,h){var i=a.defer(),j=e.chartFreq,k=this.frequencyParams[j];this.meters=g;var l,m;e.markerId?(l="meter",m=e.markerId.split(","),this.multipleGraphs=m.length>1):e.categoryId&&(l="meter_category",m=e.categoryId,this.multipleGraphs=!1),c.setPeriod(k,h),h=c.getPeriod();var n=this.filtersFromSelector(d,j,l,m,h),o=b.hashFromFilters(n);return this.activeRequestHash=o,this.filtersHashToFreq[o]=j,b.get(n).then(function(a){angular.extend(f.usageGoogleChartParams,c),i.resolve(f.electricityToChartData(j,a))}),i.promise},this.getByFiltersHash=function(c){var d=a.defer(),e=this.filtersHashToFreq[c];return b.getByFiltersHash(c).then(function(a){d.resolve(f.electricityToChartData(e,a))}),d.promise},this.electricityToChartData=function(a,b){var c=a||this.usageChartParams.frequency,d=this.frequencyParams[c];return angular.extend(f.usageGoogleChartParams,f.transformDataToDatasets(b,d)),f.usageGoogleChartParams},this.meterSelected=function(a){var b="צריכת חשמל";this.usageGoogleChartParams&&angular.isDefined(a)&&(b=a.place_description+", "+a.place_address+", "+a.place_locality,this.usageGoogleChartParams.options.title=b)},this.transformDataToDatasets=function(a,b){var c=[],g=[],h={};if(this.multipleGraphs){var i={},j=0;angular.forEach(a,function(a){a.timestamp in h||(h[a.timestamp]=[]),a.meter in i||(i[a.meter]=j++);var b=h[a.timestamp][i[a.meter]]||0;h[a.timestamp][i[a.meter]]=b+ +a.kwh}),c=[{id:"month",label:"חודש",type:"string",p:{}}],angular.forEach(i,function(a,b){var d=f.meters[b].label;c.push({id:b,label:d,type:"number",p:{}})}),angular.forEach(h,function(a,c){for(var d=e.unix(c).format(b.axis_h_format),f=[{v:d}],h=0;j>h;h++)f.push({v:a[h]});g.push({c:f})})}else{var k,l="LineChart"==b.chart_type;angular.forEach(a,function(a){a.timestamp in h||(h[a.timestamp]={}),h[a.timestamp][a.rate_type]=+a.kwh,l&&k&&k!=a.rate_type&&(h[a.timestamp][k]=+a.kwh),k=a.rate_type}),c=[{id:"month",label:"Month",type:"string",p:{}},{id:"flat",label:"אחיד",type:"number",p:{}},{id:"peak",label:"פסגה",type:"number",p:{}},{id:"mid",label:"גבע",type:"number",p:{}},{id:"low",label:"שפל",type:"number",p:{}}],angular.forEach(h,function(a,c){var d=e.unix(c).format(b.axis_h_format),f=[{v:d},{v:a.flat},{v:a.peak},{v:a.mid},{v:a.low}];g.push({c:f})})}var m={type:b.chart_type,data:{cols:c,rows:g},options:{isStacked:"true",bar:{groupWidth:"75%"},fill:20,displayExactValues:!0,vAxis:{title:b.axis_v_title,gridlines:{count:6}},hAxis:{title:b.axis_h_title}}};return angular.extend(m,d),m},this.getFrequencies=function(){return g}}]),angular.module("negawattClientApp").factory("UsagePeriod",["moment",function(a){function b(a){f.max=+a.max,f.min=+a.min}function c(a,b){f.setConfig(a),angular.isDefined(b)&&f.setPeriod(b)}function d(b){var c;if(c={next:f.next,previous:f.previous},"next"!==b||f.isLast())c={next:f.subtract(f.next).unix(),previous:f.subtract(f.previous).unix()};else{var d=f.add(f.next).unix();c={next:a.unix(d).isAfter(a.unix(f.max),f.config.frequency)?null:d,previous:f.add(f.previous).unix()}}return c}function e(a){return"next"===a?!f.isLast():"previous"===a?!f.isFirst():void 0}{var f;angular.extend}return f={max:null,min:null,next:null,previous:null,frequency:0,config:null,setConfig:function(b){this.frequency=+b.type,this.config=b,this.next=a().isAfter(a.unix(this.max))?this.max:a().unix(),this.previous=f.getPrevious()},setPeriod:function(b){angular.isDefined(b.max)&&angular.isDefined(b.min)&&(f.next=a.unix(f.next).isAfter(a.unix(b.max))?f.next:b.max,f.previous=a.unix(f.previous).isAfter(a.unix(b.min))?f.previous:b.min),angular.isDefined(b.next)&&angular.isDefined(b.previous)&&(f.next=b.next,f.previous=b.previous)},getPrevious:function(){return a.unix(this.next).subtract(this.config.chart_default_time_frame,this.config.frequency).unix()},isLast:function(){return a.unix(this.next).isAfter(a.unix(this.max),this.config.frequency)||a.unix(this.next).isSame(a.unix(this.max),this.config.frequency)},isFirst:function(){return a.unix(this.previous).isBefore(a.unix(this.min),this.config.frequency)||a.unix(this.previous).isSame(a.unix(this.min),this.config.frequency)},add:function(b){return a.unix(b).add(this.config.chart_default_time_frame,this.config.frequency)},subtract:function(b){return a.unix(b).subtract(this.config.chart_default_time_frame,this.config.frequency)}},{setLimits:b,setPeriod:c,showControl:e,period:d,getPeriod:function(){return f}}}]),angular.module("negawattClientApp").service("ChartCategories",["$q","$filter","Utils","Chart",function(a,b,c,d){function e(a,b){var c=g(a,b);return a.type="PieChart",a.data={cols:[{id:"t",label:"Categories",type:"string"},{id:"s",label:"Slices",type:"number"}],rows:f(a,c)},a}function f(a,d){var e=[];return a=b("filter")(c.toArray(a),function(a){return a.meters>0&&a.depth===d?a:void 0}),angular.forEach(a,function(a){this.push({c:[{v:a.label},{v:a.meters},{id:a.id}]})},e),e}function g(a,b){var c=0;return angular.isDefined(b)&&a&&(c=a[0].depth),c}this.get=function(f,g,h){var i=a.defer();return angular.isDefined(g)&&(h=b("filter")(c.toArray(h),{id:parseInt(g)},!0).pop().children),i.resolve(h?e(angular.copy(h),g):d),i.promise},this.getCategoryIdSelected=function(a,b){return b.rows[a.row].c[2].id}}]),angular.module("negawattClientApp").service("Electricity",["$q","$http","$timeout","$rootScope","Config","md5","Utils",function(a,b,c,d,e,f){function g(c,d,f,j){var k=a.defer(),l=e.backend+"/api/electricity",m=angular.copy(c);return f&&(m.page=f),b({method:"GET",url:l,params:m}).success(function(a){h(a.data,c,d,j),k.resolve(i[d].data);var b=void 0!=a.next;b&&g(c,d,f+1,!0)}),k.promise}function h(a,b,e,f){i[e]={data:(i[e]?i[e].data:[]).concat(a),timestamp:new Date,filters:b},d.$broadcast(l,e),f||j.push(c(function(){angular.isDefined(i[e])&&(i[e]=void 0)},6e4))}var i={},j=[],k={},l="nwElectricityChanged";this.hashFromFilters=function(a){return f.createHash(JSON.stringify(a))},this.getByFiltersHash=function(a){var b=i[a].filters;return this.get(b)},this.get=function(b){var c=this.hashFromFilters(b);return k[c]=a.when(k[c]||i[c]&&angular.copy(i[c].data)||g(b,c,1,!1)),k[c]["finally"](function(){k[c]=void 0}),k[c]},d.$on("nwClearCache",function(){i={},angular.forEach(j,function(a){c.cancel(a)}),j=[]})}]),angular.module("negawattClientApp").factory("IconFactory",["$injector","$q",function(a,b){function c(a){return{iconUrl:"../images/markers/"+a,shadowUrl:"../images/shadow.png",iconSize:[40,40],shadowSize:[26,26],iconAnchor:[32,30],shadowAnchor:[25,7],popupAnchor:[-10,-25]}}var d={"default":{unselect:c("marker-blue.png"),select:c("marker-red.png")},createIcons:function(a){angular.forEach(a.list,function(a){angular.isDefined(this[a.icon])||(this[a.icon]={unselect:c(a.icon+"-blue.png"),select:c(a.icon+"-red.png")})},this)},getIcon:function(c,d){var e=this,f=b.defer(),g=a.get("Category");return g.get().then(function(a){e.createIcons(a),f.resolve(e[c][d])}),f.promise}};return d}]),angular.module("negawattClientApp").service("Map",["$rootScope","leafletData",function(a,b){var c=this,d={},e="nwMapChanged";this.getConfig=function(){return{tileLayer:"https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png",zoomControlPosition:"bottomleft",minZoom:8,maxZoom:16}},this.setCenter=function(b){d.center=angular.extend(d.center||{},b),a.$broadcast(e)},this.updateCenterZoom=function(a){angular.isDefined(d.center)&&(d.center.zoom=a)},this.getCenter=function(a){return angular.isUndefined(d.center)&&angular.isDefined(a.center)&&c.setCenter(a.center),angular.copy(d.center)},this.centerMapByMarker=function(a){b.getMap().then(function(b){c.setCenter(a.getPosition()),b.setView(c.getCenter())})},this.setMarkerSelected=function(a){d.markerSelected=a},this.getMarkerSelected=function(){return d.markerSelected},a.$on("nwClearCache",function(){d={}})}]),angular.module("negawattClientApp").factory("Marker",["$injector","$state","$q","$timeout","Map","IconFactory",function(a,b,c,d,e,f){function g(a,b){var d=f[a]&&f[a][b]||f.getIcon(a,b);return c.when(d)}var h;return{icon:{},getCategory:function(){var a=Object.keys(this.meter_categories)[0];return a&&this.meter_categories[a].name||"default"},getSelected:function(){return h},unselect:function(){var a=this;g(this.getCategory(),"unselect").then(function(b){a.icon=b})},select:function(){var a=this;angular.isDefined(h)&&h.unselect(),h=this,g(this.getCategory(),"select").then(function(b){a.icon=b}),e.centerMapByMarker(this)},getPosition:function(){return{lat:this.lat,lng:this.lng}}}}]),angular.module("negawattClientApp").service("Meter",["$q","$http","$timeout","$rootScope","Config","Marker","Utils","MeterFilter",function(a,b,c,d,e,f,g,h){function i(c,d){var f,g=a.defer();return d=d||1,f=e.backend+"/api/meters?filter[has_electricity]=1&filter[account]="+c+"&page="+d,b({method:"GET",url:f,transformResponse:l}).success(function(a){j(a.data),g.resolve(m()),a.hasNextPage&&(q=!0,i(c,n(a.hasNextPage.href))),k()}),g.promise}function j(a){angular.isUndefined(p.data)&&(p.data={listAll:{},list:{},total:{}}),angular.extend(p.data.listAll,a.list),angular.extend(p.data.total,a.total),p.timestamp=new Date,d.$broadcast(r,m()),q=!1}function k(){q||c(function(){p.data=void 0},6e5)}function l(a){var b={};return a=angular.fromJson(a),b={data:{list:g.indexById(a.data)},hasNextPage:a.next||!1},angular.forEach(b.data.list,function(a){b.data.list[a.id]=a,a.location&&(b.data.list[a.id].lat=parseFloat(a.location.lat),b.data.list[a.id].lng=parseFloat(a.location.lng),delete a.location),b.data.list[a.id].message=a.place_description+"<br>"+a.place_address+"<br>"+a.place_locality,angular.extend(b.data.list[a.id],f),b.data.list[a.id].unselect()}),b.data.total=a.total,b}function m(){return angular.isDefined(p.data)&&(p.data.list=h.byCategory(p.data)),p.data}function n(a){var b=/.*page=([0-9]*)/;return b.exec(a).pop()}var o,p={},q=!1,r="nwMetersChanged";this.get=function(b,c){return o=a.when(o||m()||i(b)),angular.isDefined(c)&&(h.filters.category=c),o["finally"](function(){o=void 0}),o},this.refresh=function(){d.$broadcast(r,m())},d.$on("nwClearCache",function(){p={}})}]),angular.module("negawattClientApp").factory("MeterFilter",["$filter","Utils",function(a,b){return{filters:{},byCategory:function(c){return c=b.toArray(c.listAll),b.indexById(a("filter")(c,function(a){return!this.filters.category||a.meter_categories&&a.meter_categories[this.filters.category]?a:void 0}.bind(this),!0))},clear:function(){this.filters={}}}}]),angular.module("negawattClientApp").service("Message",["$q","$http","$rootScope","$state","$timeout","$sce","Config",function(a,b,c,d,e,f,g){function h(){var c=a.defer(),d=g.backend+"/api/anomalous_consumption";return b({method:"GET",url:d,transformResponse:i,cache:!0}).success(function(a){j(a),c.resolve(k.data)}),c.promise}function i(a){var b=angular.fromJson(a).data;return angular.forEach(b,function(a){angular.isDefined(a["long-text"])&&(a["long-text"]=a["long-text"].replace("%23","#"),a["long-text"]=a["long-text"].replace("90","50")),angular.isDefined(a.text)&&(a.text=a.text.replace("90","50"),a.text=a.text.replace("%23","#"))}),b}function j(a){k={data:a,timestamp:new Date},e(function(){k.data=void 0},6e4),c.$broadcast(l)}var k={},l="nwMessagesChanged";this.get=function(){return a.when(k.data||h())},c.$on("nwClearCache",function(){k={}})}]),angular.module("negawattClientApp").service("Profile",["$q","$http","$timeout","$filter","$state","$rootScope","Config",function(a,b,c,d,e,f,g){function h(){var b,c=a.defer();return b=a.all([i(),j()]),b.then(function(a){k(a),c.resolve(n.data)}),c.promise}function i(){var a=g.backend+"/api/me";return b({method:"GET",url:a,transformResponse:l})}function j(){var a=g.backend+"/api/accounts";return b({method:"GET",url:a,transformResponse:m})}function k(a){n={data:{user:a[0].data,account:a[1].data},timestamp:new Date},c(function(){n.data=void 0},6e4),f.$broadcast(o)}function l(a){return angular.fromJson(a).data}function m(a){if(a){var b=angular.fromJson(a);if(b)return angular.forEach(b.data,function(a){a.center={lat:parseFloat(a.location.lat),lng:parseFloat(a.location.lng),zoom:parseInt(a.zoom)},delete a.location,delete a.zoom}),b.data}}var n={},o="nwProfileChanged";this.get=function(){return a.when(n.data||h())},this.selectAccount=function(a,b){return a=+a,(angular.isUndefined(b.active)||b.active.id!==a)&&(b.active=d("filter")(b.account,{id:a}).pop(),f.$broadcast("nwClearCache")),b.active},f.$on("nwClearCache",function(){n={}})}]),angular.module("negawattClientApp").service("Utils",function(){var a=this;this.Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(b){var c,d,e,f,g,h,i,j="",k=0;for(b=a.Base64._utf8_encode(b);k<b.length;)c=b.charCodeAt(k++),d=b.charCodeAt(k++),e=b.charCodeAt(k++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),j=j+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return j},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}},this.indexById=function(a){var b={};return angular.forEach(a,function(a){this[a.id]=a},b),b},this.toArray=function(a){var b=[];return angular.forEach(a,function(a){this.push(a)},b),b}}),angular.module("negawattClientApp").factory("Timedate",["$interval",function(a){var b={today:new Date,now:null,startClock:function(){var b=this;a(function(){b.now=new Date},1e3)}};return b.startClock(),b}]),angular.module("negawattClientApp").filter("filterMeterByCategories",["Utils","$filter",function(a,b){return function(c,d){var e=[];return d.length&&(angular.isObject(c)&&(c=a.toArray(c)),angular.forEach(d,function(a){e=e.concat(b("filter")(c,{meter_categories:{$:{id:a}}},!0))}),c=a.indexById(e)),c}}]),angular.module("negawattClientApp").filter("includedByParams",["$state","$stateParams",function(a,b){var c=function(a,c){return angular.isDefined(b[a])&&b[a]&&+b[a]===c};return c}]),angular.module("negawattClientApp").directive("loadingBarText",function(){return{restrict:"EA",template:'<div class="splash-screen" ng-show="isLoading">{{text}}</div>',controller:["$scope",function(a){function b(b){a.isLoading=b}a.text="טוען...",a.isLoading=!1,a.$on("cfpLoadingBar:started",function(){b(!0)}),a.$on("cfpLoadingBar:completed",function(){b(!1)})}],scope:{}}}),angular.module("angular-nw-weather",["config"]).constant("openweatherEndpoint","http://api.openweathermap.org/data/2.5/weather").directive("nwWeatherTemperature",function(){return{restrict:"EA",template:'<div> {{ctrlWeather.data.temperature | number:0 }}&deg; <i class="wi {{ctrlWeather.data.iconClass}}"></i></div>',controller:["nwWeather","nwWeatherIcons",function(a,b){var c=this;a.get(this.account).then(function(a){c.data=a,c.data.iconClass=b[a.icon]})}],controllerAs:"ctrlWeather",bindToController:!0,scope:{account:"="}}}).service("nwWeather",["$q","$http","$timeout","$state","$rootScope","Config","openweatherEndpoint","nwWeatherIcons",function(a,b,c,d,e,f,g,h){function i(c){var d=a.defer(),e=g,h={lat:c.center.lat,lon:c.center.lng,units:"metric",APPID:f.openweather.apikey||""};return b({method:"GET",url:e,params:h,withoutToken:!0,cache:!0}).success(function(a){var b=k(a);j(b),d.resolve(b)}),d.promise}function j(a){m={data:a,timestamp:new Date},c(function(){m.data=void 0},6e5),e.$broadcast(n)}function k(a){return{temperature:a.main.temp,icon:angular.isDefined(h[a.weather[0].icon])?a.weather[0].icon:a.weather[0].id,description:a.weather[0].description}}var l,m={},n="nwWeatherChanged";this.get=function(b){return l=a.when(l||angular.copy(m.data)||i(b)),l["finally"](function(){l=void 0}),l},e.$on("nwClearCache",function(){m={}})}]).factory("nwWeatherIcons",function(){return{200:"wi-storm-showers ",201:"wi-storm-showers ",202:"wi-storm-showers ",210:"wi-thunderstorm ",211:"wi-thunderstorm ",212:"wi-thunderstorm ",221:"wi-lightning",230:"wi-storm-showers",231:"wi-storm-showers",232:"wi-storm-showers",300:"wi-sprinkle",301:"wi-sprinkle",302:"wi-rain-mix",310:"wi-rain-mix",311:"wi-rain",312:"wi-rain",321:"wi-rain-wind",500:"wi-sprinkle",501:"wi-showers",502:"wi-rain-mix",503:"wi-rain",504:"wi-rain-wind",511:"wi-snow",
520:"wi-rain-mix",521:"wi-rain",522:"wi-rain-wind",600:"wi-snow",601:"wi-snow",602:"wi-snow",611:"wi-hail",621:"wi-snow",701:"wi-fog",711:"wi-fog",721:"wi-fog",731:"wi-fog",741:"wi-fog","01d":"wi-day-sunny","01n":"wi-night-clear","02d":"wi-day-cloudy","02n":"wi-night-cloudy","03d":"wi-cloudy","04d":"wi-cloudy",900:"wi-tornado",901:"wi-thunderstorm",902:"wi-lightning",903:"wi-thermometer-exterior",904:"wi-thermometer",905:"wi-strong-wind",906:"wi-hail"}}),angular.module("negawattClientApp").config(["$provide",function(a){a.decorator("$state",["$delegate",function(a){var b=angular.extend,c=(angular.isDefined,angular.isUndefined),d={};return a.go=function(e,f,g){return c(d[e])&&(d[e]={reloadOnSearch:a.$current.reloadOnSearch}),a.$current.reloadOnSearch=d[e].reloadOnSearch,a.transitionTo(e,f,b({inherit:!0,relative:a.$current},g))},a.forceGo=function(c,d,e){return a.current.reloadOnSearch=!0,a.transitionTo(c,d,b({inherit:!0,relative:a.$current},e))},a}])}]);