(ns views.creation
  (:require [ajax.core :as http]
            [reagent.core :as rc]
            [reitit.frontend.easy :as rfe]
            [components.button :as button]
            [components.select :as select]
            [components.label :as label]
            [components.input :as input]
            [components.alert :as alert]
            [settings.api :as api]))

(defn ^:private init-state
  []
  {::methods []
   ::error-messages []
   ::creation-success? false
   ::sending-requiest? false
   ::loading-methods? true
   ::form {:buyerPhone ""
           :buyerEmail ""
           :buyerFullName ""
           :shippingAddress ""
           :shippingCountry ""
           :shippingRegion ""
           :shippingMethodId "1"
           :shippingCity ""
           :sellerStore ""
           :externalOrderNumber ""
           :products []}})

(def ^:private state
  (rc/atom (init-state)))

(def ^:private products
  [{:id 1 :name "Silla de madera" :weight "20 Kg" :quantity 2}
   {:id 2 :name "Mouse vertical" :weight "20 gr" :quantity 92}
   {:id 3 :name "Tambor xt2-reme" :weight "5 Kg" :quantity 7}
   {:id 4 :name "Cuaderno norma" :weight "100 gr" :quantity 2000}
   {:id 5 :name "Barco de PMMA" :weight "140 gr" :quantity 61}
   {:id 6 :name "Cámara genius" :weight "35 gr" :quantity 31}
   {:id 7 :name "Resma de papel" :weight "276 gr" :quantity 55}
   {:id 8 :name "Escritorio madera" :weight "60 Kg" :quantity 8}
   {:id 9 :name "Tomate verde" :weight "90 gr/u" :quantity 200}])

(defn ^:private load-data
  [{:keys [data]}]
  (swap! state assoc ::methods data))

(defn ^:private fetch-methods
  []
  (http/GET (api/base-url "/shipments")
    {:handler load-data
     :error-handler #(js/console.error %)
     :finally #(swap! state assoc ::loading-methods? false)
     :response-format (http/json-response-format {:keywords? true})}))

(defn ^:private send-data
  [data]
  (swap! state assoc ::sending-requiest? true)
  (http/POST (api/base-url "/sales")
    {:params data
     :format :json
     :handler #(swap! state assoc ::creation-success? true)
     :finally #(swap! state assoc ::sending-requiest? false)
     :error-handler #(swap! state assoc ::error-messages (-> % :response :errors))
     :response-format (http/json-response-format {:keywords? true})}))

(defn ^:private update-field!
  [a]
  (fn [evt]
    (reset! state
            (assoc-in @state [::form a] (-> evt .-target .-value)))))

(defn ^:private v-form
  [fields]
  (let [input' #(input/render (-> input/component
                                  (assoc input/on-change (update-field! %))
                                  (assoc input/value (get-in @state [::form %]))))
        select' #(select/render (-> select/component
                                    (assoc select/loading? (get @state ::loading-methods?))
                                    (assoc select/on-change (update-field! :shippingMethodId))
                                    (assoc select/options (get @state %))))
        switch #(cond
                  (:options %) (select' (:options %))
                  :else (input' (:is %)))]
    [:form.box
     (doall (for [field fields] ^{:key (:text field)}
                 [:div.mt-3
                  (label/render (-> label/component
                                    (assoc label/text (:text field))
                                    (assoc label/slot (switch field))))]))]))

(defn ^:private v-table
  []
  (let [columns ["" "Producto" "Cantidad" "Peso"]]
    [:div.box
     [:table.table.is-striped.is-fullwidth.has-text-centered.mt-2
      [:thead [:tr (for [column columns] ^{:key column}
                        [:th column])]]
      [:tbody (for [product products] ^{:key (:id product)}
                   [:tr
                    [:td [:input {:type "checkbox"}]]
                    [:td (:name product)]
                    [:td (:quantity product)]
                    [:td (:weight product)]])]]]))

(defn ^:private v-errors
  []
  (alert/render (-> alert/component
                    (assoc alert/messages (->> @state ::error-messages (map :msg))))))

(defn ^:private v-ready
  []
  [:section.container
   [:div.level
    [:div.level-left
     [:h1.title.has-text-centered.my-6 "Crear orden de venta"]]
    [:div.level-right
     (button/render (-> button/component
                        (assoc button/label "Crear orden")
                        (assoc button/loading? (get @state ::sending-requiest?))
                        (assoc button/on-click #(-> @state ::form send-data))))]]
   (when (-> @state ::error-messages seq) (v-errors))
   [:div.columns
    [:div.column (v-form [{:text "Tienda del vendedor" :is :sellerStore}
                          {:text "Número de orden externo" :is :externalOrderNumber}
                          {:text "Nombre completo del comprador" :is :buyerFullName}
                          {:text "Teléfono del comprador" :is :buyerPhone}
                          {:text "Correo del comprador" :is :buyerEmail}])]
    [:div.column (v-form [{:text "Dirección de envío" :is :shippingAddress}
                          {:text "Ciudad de envío" :is :shippingCity}
                          {:text "Región de envío" :is :shippingRegion}
                          {:text "País de envío" :is :shippingCountry}
                          {:text "Método de envío" :is :shippingMethodId :options ::methods}])]
    [:div.column (v-table)]]])

(defn ^:private v-ok
  []
  [:section.container.has-text-centered.mt-6
   [:div.title.is-success "Orden creada con éxito"]
   (button/render (-> button/component
                      (assoc button/on-click (fn []
                                               (reset! state (init-state))
                                               (rfe/push-state :view.list)))
                      (assoc button/label "Regresar a órdenes de venta")))])

(defn ^:private v-main
  []
  (if (::creation-success? @state) (v-ok) (v-ready)))

(defn view
  []
  [:> (rc/create-class
       {:component-did-mount fetch-methods
        :render v-main})])
