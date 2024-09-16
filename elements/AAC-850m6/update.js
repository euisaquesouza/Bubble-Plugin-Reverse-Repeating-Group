function(instance, properties, context) {
    // Function to run the process
    function runProcess() {
        instance.data.run(properties.rgs, properties.cells, properties.scroll_speed_factor);
    }

    // Trim and split the IDs
    const ids = properties.rgs.split(',').map(id => id.trim());
    const cellIds = properties.cells.split(',').map(id => id.trim());

    // Function to check if an element or its children contain any of the target IDs
    function checkForTargetIds(element) {
        if (ids.includes(element.id)) return true;
        if (cellIds.includes(element.id)) return true;
        for (let child of element.getElementsByTagName('*')) {
            if (ids.includes(child.id)) return true;
        }
        for (let child of element.getElementsByTagName('*')) {
            if (cellIds.includes(child.id)) return true;
        }
        return false;
    }

    // Create a MutationObserver if it doesn't exist
    if (!instance.data.observer) {
        instance.data.observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && checkForTargetIds(node)) {
                            runProcess();
                            return;
                        }
                    }
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                    if (ids.includes(mutation.target.id)) {
                        runProcess();
                        return;
                    }
                    if (cellIds.includes(mutation.target.id)) {
                        runProcess();
                        return;
                    }
                }
            }
        });

        // Start observing the entire document
        instance.data.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id']
        });
    }
    
    // Check if any of the target elements already exist
    ids.forEach(id => {
        if (document.getElementById(id)) {
            runProcess();
            return;
        }
    });
    
    // Check if any of the target elements already exist
    cellIds.forEach(id => {
        if (document.getElementById(id)) {
            runProcess();
            return;
        }
    });

    // Always run
    runProcess();
}