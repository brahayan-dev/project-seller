(ns router
  (:require [reagent.core :as r]
            [reitit.frontend :as rf]
            [reitit.frontend.easy :as rfe]
            [reitit.coercion.spec :as rcs]
            [views.creation :as creation]
            [views.list :as list]))

(defn redirect!
  [to]
  (r/create-class
   {:component-did-mount #(rfe/replace-state to)
    :render (fn [] nil)}))

(def routes
  [["/"
    {:view (redirect! :view.list)}]
   ["/list"
    {:name :view.list
     :view list/view}]
   ["/creation"
    {:name :view.creation
     :view creation/view}]])

(def run (rf/router routes {:data {:coercion rcs/coercion}}))

(def match (r/atom nil))
