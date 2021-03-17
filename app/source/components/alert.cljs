(ns components.alert)

(def messages ::messages)
(def component {messages []})

(defn render
  [model]
  [:div.notification.is-danger.is-light
   [:ul (for [message (messages model)] ^{:key (random-uuid)}
             [:li message])]])
