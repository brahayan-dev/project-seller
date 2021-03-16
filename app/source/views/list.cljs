(ns views.list
  (:require [ajax.core :as http]
            [reagent.core :as rc]
            [reitit.frontend.easy :as rfe]
            [components.button :as button]))

(def ^:private state (rc/atom {::rows []
                              ::loading? true}))

(defn ^:private load-data
  [{:keys [data]}]
  (swap! state assoc ::rows data))

(defn ^:private fetch-sales
  []
  (http/GET
    "http://localhost:3000/sales"
    {:handler load-data
     :error-handler #(js/console.error %)
     :finally #(swap! state assoc ::loading? false)
     :response-format (http/json-response-format {:keywords? true})}))

(defn ^:private v-table
  []
  (let [columns ["# Orden de venta" "Método de entrega" "Tienda del vendedor" "Fecha de creación"]]
    [:table.table.is-striped.is-fullwidth.has-text-centered
     [:thead [:tr (for [column columns] ^{:key column}
                       [:th column])]]
     [:tbody (for [row (::rows @state)] ^{:key (:id row)}
                  [:tr
                   [:td (:sellOrderNumber row)]
                   [:td (:shippingMethod row)]
                   [:td (:sellerStore row)]
                   [:td (:createdAt row)]])]]))

(defn ^:private v-ready
  []
  [:section.container
   [:div.level
    [:div.level-left
     [:h1.title.has-text-centered.my-6 "Órdenes de venta"]]
    [:div.level-right
     (button/render (-> button/component
                        (assoc button/label "Ir a crear venta")
                        (assoc button/on-click #(rfe/push-state :view.creation))))]]
   (v-table)])

(defn ^:private v-wait
  []
  [:section.container.has-text-centered.mt-6
   [:span.title "Cargando..."]])

(defn ^:private v-main
  []
  (if (::loading? @state) (v-wait) (v-ready)))

(defn view
  []
  [:> (rc/create-class
       {:component-did-mount fetch-sales
        :render v-main})])
