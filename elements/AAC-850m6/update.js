function(instance, properties, context) {
       
    try {

        if (Array.isArray(instance.data.style_ids)) {

            for (let i = 0; i < instance.data.style_ids.length; i++) {

                $(`#${instance.data.style_ids[i]}`).remove()
            }

            instance.data.style_ids = []
        }

    } catch (e) {
        
        console.log(e.message)
    }

    typeof instance.data.status === 'string' ? instance.data.status === 'ready' ? instance.data.run(properties.rgs, properties.cells, properties.scroll_speed_factor) : null : null
}