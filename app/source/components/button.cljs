(ns components.button)

(def label ::label)
(def loading? ::loading?)
(def on-click ::on-click)
(def component {loading? false})

(defn render 
  [model]
  (let [addon (when (loading? model) "is-loading")]
    [:button.button.is-rounded.is-light
     {:class addon :on-click (on-click model)}
     (label model)]))
