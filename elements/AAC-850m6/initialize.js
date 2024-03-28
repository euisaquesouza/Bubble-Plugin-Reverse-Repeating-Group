function(instance, context) {


    instance.data.status = 'ready';

    instance.data.run = function (rgs, cells, scrollSpeedFactor) {


        function makeid(length) {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }


        try {

            if (!rgs) {

                throw new Error('Empty: rgs.')
            }
            if (!cells) {

                throw new Error('Empty: cells.')
            }

            let rgs_id = rgs.split(',');
            let cells_id = cells.split(',');


            function removeEmpty(arr) {

                if (Array.isArray(arr)) {

                    let ar = [];

                    for (let i = 0; i < arr.length; i++) {

                        if (typeof arr[i] === 'string') {

                            if (arr[i].trim() !== '') {

                                ar.push(arr[i].trim())
                            }
                        }
                    }

                    return ar
                }
            }

            rgs_id = removeEmpty(rgs_id);
            cells_id = removeEmpty(cells_id);


            function check(id) {

                return (!!$(`#${id}`)[0])
            }

            function scale(ids, value) {

                let id = makeid(5);

                if (Array.isArray(instance.data.style_ids)) {

                    instance.data.style_ids.push(id)
                } else {

                    instance.data.style_ids = [id]
                }


                instance.canvas.append(`<style id=${id}> ${ids} {
                    transform: scaleY(${value}) !important;
                    -webkit-transform: scaleY(${value}) !important;
                    -moz-transform: scaleY(${value}) !important;
                    -o-transform: scaleY(${value}) !important;
                    -ms-transform: scaleY(${value}) !important;
                    }
                    </style>`)
            }

            function scrollDirectionRevers(arr) {
                for (let i = 0; i < arr.length; i++) {
                    const element = $(arr[i]);
                    if (!element.data('hasScrollListener')) {
                        element.on('wheel', function(event) {
                            // normalizing the delta
                            var delta = event.originalEvent.deltaY;
                            // multiplying the delta with a smaller value to slow down the scrolling
                            this.scrollTop -= (delta * scrollSpeedFactor);
                            event.preventDefault();
                        });
                        element.data('hasScrollListener', true);
                    }
                }
            }

            function apply(arr = [], scale_value, is_rg) {

                let arr_ids = [];
                let rgs_scroll = [];


                for (let i = 0; i < arr.length; i++) {

                    let cell = arr[i].trim();

                    arr_ids.push(`#${cell}`);

                    if (is_rg === true) {

                        let valid = check(cell);

                        if (valid) {

                            rgs_scroll.push(`#${cell}`)
                        }
                    }
                }

                instance.data.arr_ids = arr_ids;

                scale(arr_ids, scale_value);


                if (rgs_scroll.length > 0) {

                    scrollDirectionRevers(rgs_scroll)
                }
            }

            apply(rgs_id, -1, true);
            apply(cells_id, -1, false);

            return {
                rgs: rgs_id,
                cells: cells_id,
            }
        } catch (e) {

            instance.publishState('error', e.message)
        }
    }
}