(ns core
  (:require [reagent.dom :refer [render]]
            [reitit.frontend.easy :as rfe]
            [router :as router]))

(defn app
  []
  (when @router/match
    (let [view (get-in @router/match [:data :view])]
      [view @router/match])))

(defn ^:export ^:dev/after-load main
  []
  (rfe/start! router/run
              #(reset! router/match %)
              {:use-fragment false})
  (render [app] (js/document.getElementById "app")))
