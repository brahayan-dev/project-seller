(ns components.select)

(def options ::options)
(def loading? ::loading?)
(def on-change ::on-change)
(def component
  {options [] on-change nil})

(defn render
  [model]
  [:div.select.is-normal.is-fullwidth {:class (when (loading? model) "is-loading")}
   [:select {:on-change (on-change model)}
    (for [option (options model)] ^{:key option}
                 [:option {:value (:id option)} (:name option)])]])
