function(instance, context) {
    instance.data.scrolling = false

    // this is a test

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

            let rgs_id = rgs.split(',').map(id => id.trim());
            let cells_id = cells.split(',').map(id => id.trim());

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

            function isScrollable(element) {
                const style = window.getComputedStyle(element);
                const overflowY = style.getPropertyValue('overflow-y');
                const overflowX = style.getPropertyValue('overflow-x');

                const isVerticalScrollable = (overflowY === 'scroll' || overflowY === 'auto') && 
                      element.scrollHeight > element.clientHeight;

                const isHorizontalScrollable = (overflowX === 'scroll' || overflowX === 'auto') && 
                      element.scrollWidth > element.clientWidth;

                return isVerticalScrollable || isHorizontalScrollable;
            }

            function findScrollableParent(element, topLevelContainer) {
                while (element && element !== topLevelContainer && element !== document.body) {
                    if (isScrollable(element)) {
                        return element;
                    }
                    element = element.parentElement;
                }
                return null;
            }

            function isElementHorizontallyScrollable(element) {
                // First, check if the element is not null
                if (!element) {
                    return false;
                }
                return element.scrollWidth > element.clientWidth;
            }

            function scrollDirectionRevers(arr) {
                for (let i = 0; i < arr.length; i++) {
                    const element = $(arr[i]);
                    if (!element.data('hasScrollListener')) {
                        element.on('wheel', function(event) {     

                            var delta = event.originalEvent.deltaY;
                            let scrollableElement = findScrollableParent(event.target, this);
                            let scrollableElementHorizontal = isElementHorizontallyScrollable(scrollableElement);
                            
                            if (scrollableElement && scrollableElement !== this && !instance.data.scrolling && !scrollableElementHorizontal) {
                                // Normal scrolling for inner containers
                                scrollableElement.scrollTop += (delta * scrollSpeedFactor);

                            } else {
                                // Reversed scrolling for the main repeating group
                                clearTimeout(instance.data.scrollTimeout);

                                instance.data.scrolling = true
                                this.scrollTop -= (delta * scrollSpeedFactor);
                            }
                            event.preventDefault();
                            event.stopPropagation();
                            
                            // Set a timeout to set scrolling to false after 300ms
                            instance.data.scrollTimeout = setTimeout(function() {
                                instance.data.scrolling = false;
                            }, 100);

                        });
                        
                        element.data('hasScrollListener', true);

                        // Find and apply to all scrollable children
                        element.find('*').each(function() {
                            if (isScrollable(this) && !$(this).data('hasScrollListener')) {
                                $(this).on('wheel', function(event) {
                                    if ($(event.target).closest('iframe').length > 0) {
                                        return;
                                    }
                                    var delta = event.originalEvent.deltaY;
                                    // Normal scrolling for inner containers
                                    this.scrollTop += (delta * scrollSpeedFactor);
                                    event.preventDefault();
                                    event.stopPropagation();
                                });
                                $(this).data('hasScrollListener', true);
                            }
                        });
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
