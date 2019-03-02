let exampleInstance = {
    "id": "brunswick-8Nq9JsYFUtFzdReih3P8s2YMQiRQHDRMkWNkASN5A8xMGa4yzq5njUv4hFEEaBbZ",
    "location": {
        "x": 9,
        "y": 9
    },
    "direction": "N",
    "finished": false,
    "timeSpent": 4,
    "itemsLocated": [
        {
            "id": 15,
            "x": 9,
            "y": 8,
            "type": "GARBAGE"
        },
        {
            "id": 18,
            "x": 8,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 19,
            "x": 8,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 22,
            "x": 9,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 23,
            "x": 9,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 24,
            "x": 10,
            "y": 9,
            "type": "GARBAGE"
        },
        {
            "id": 25,
            "x": 10,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 26,
            "x": 10,
            "y": 9,
            "type": "ORGANIC"
        },
        {
            "id": 29,
            "x": 9,
            "y": 10,
            "type": "GARBAGE"
        },
        {
            "id": 30,
            "x": 9,
            "y": 10,
            "type": "ORGANIC"
        },
        {
            "id": 31,
            "x": 9,
            "y": 10,
            "type": "ORGANIC"
        },
        {
            "id": 32,
            "x": 10,
            "y": 10,
            "type": "RECYCLE"
        },
        {
            "id": 33,
            "x": 10,
            "y": 10,
            "type": "RECYCLE"
        },
        {
            "id": 34,
            "x": 11,
            "y": 10,
            "type": "GARBAGE"
        },
        {
            "id": 35,
            "x": 11,
            "y": 10,
            "type": "RECYCLE"
        },
        {
            "id": 36,
            "x": 11,
            "y": 10,
            "type": "ORGANIC"
        },
        {
            "id": 37,
            "x": 11,
            "y": 10,
            "type": "ORGANIC"
        },
        {
            "id": 38,
            "x": 10,
            "y": 11,
            "type": "GARBAGE"
        },
        {
            "id": 39,
            "x": 10,
            "y": 11,
            "type": "ORGANIC"
        },
        {
            "id": 40,
            "x": 10,
            "y": 11,
            "type": "ORGANIC"
        }
    ],
    "itemsHeld": [],
    "itemsBin": [],
    "itemsCollected": [],
    "constants": {
        "ROOM_DIMENSIONS": {
            "X_MIN": 0,
            "X_MAX": 19,
            "Y_MIN": 0,
            "Y_MAX": 19
        },
        "BIN_LOCATION": {
            "ORGANIC": {
                "X": 19,
                "Y": 6
            },
            "RECYCLE": {
                "X": 19,
                "Y": 7
            },
            "GARBAGE": {
                "X": 19,
                "Y": 8
            }
        },
        "TIME": {
            "TURN": 1,
            "MOVE": 1,
            "SCAN_AREA": 4,
            "COLLECT_ITEM": 2,
            "UNLOAD_ITEM": 2
        },
        "TOTAL_COUNT": {
            "ORGANIC": 70,
            "RECYCLE": 60,
            "GARBAGE": 60
        },
        "BIN_CAPACITY": {
            "ORGANIC": 25,
            "RECYCLE": 15,
            "GARBAGE": 20
        },
        "BIN_COLLECTION_CYCLE": 150,
        "SCAN_RADIUS": 3
    }
};

(() => {
    const ROBOT_COLOUR = '#2BA1FF';
    const RECYCLE_COLOUR = '#2BA1FF';
    const GARBAGE_COLOUR = '#8f5700';
    const ORGANIC_COLOUR = '#14ff00';
    const RENDER_SIZE = 8;

    window.onload = () => {
        let canvas = document.getElementById("map-canvas");
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let ctx = canvas.getContext("2d");
        ctx.translate(0.5, 0.5);

        let serverEventSource = new EventSource('/stream', { withCredentials: true } );
        serverEventSource.addEventListener("update", function(e) {
            let instanceDetails = JSON.parse(e.data).payload;
            drawMap(instanceDetails, ctx);
        }, false);

        serverEventSource.addEventListener("close", function(e) {
            serverEventSource.close();
        }, false);

        serverEventSource.onerror = function(e) {
            serverEventSource.close();
        };
    };

    function drawMap(instanceData, mapContext) {
        let roomDimensions = instanceData.constants.ROOM_DIMENSIONS;
        clearMap(mapContext);

        // Draw Grid
        drawGrid(mapContext, roomDimensions.X_MAX, roomDimensions.Y_MAX);

        // Draw Bins
        let scaledBinCoords = {
            recycling: {
                x: Math.floor((instanceData.constants.BIN_LOCATION.RECYCLE.X / roomDimensions.X_MAX) * mapContext.canvas.width),
                y: Math.floor((instanceData.constants.BIN_LOCATION.RECYCLE.Y / roomDimensions.Y_MAX) * mapContext.canvas.height),
            },
            garbage: {
                x: Math.floor((instanceData.constants.BIN_LOCATION.GARBAGE.X / roomDimensions.X_MAX) * mapContext.canvas.width),
                y: Math.floor((instanceData.constants.BIN_LOCATION.GARBAGE.Y / roomDimensions.Y_MAX) * mapContext.canvas.height),
            },
            organic: {
                x: Math.floor((instanceData.constants.BIN_LOCATION.ORGANIC.X / roomDimensions.X_MAX) * mapContext.canvas.width),
                y: Math.floor((instanceData.constants.BIN_LOCATION.ORGANIC.Y / roomDimensions.Y_MAX) * mapContext.canvas.height),
            }
        };
        renderRecycleBin(mapContext, scaledBinCoords.recycling.x, scaledBinCoords.recycling.y);
        renderGarbageBin(mapContext, scaledBinCoords.garbage.x, scaledBinCoords.garbage.y);
        renderOrganicBin(mapContext, scaledBinCoords.organic.x, scaledBinCoords.organic.y);

        // Draw Rubbish
        for(let i = 0; i < instanceData.itemsLocated.length; i++) {
            let item = instanceData.itemsLocated[i];
            let scaledItemCoords = {
                x: Math.floor((item.x / roomDimensions.X_MAX) * mapContext.canvas.width),
                y: Math.floor((item.y / roomDimensions.Y_MAX) * mapContext.canvas.height),
            };

            switch(item.type) {
                case 'RECYCLE':
                    renderRecycle(mapContext, scaledItemCoords.x, scaledItemCoords.y);
                    break;
                case 'GARBAGE':
                    renderGarbage(mapContext, scaledItemCoords.x, scaledItemCoords.y);
                    break;
                case 'ORGANIC':
                    renderOrganic(mapContext, scaledItemCoords.x, scaledItemCoords.y);
                    break;
            }
        }

        // Draw robot
        let scaledRobotCoords = {
            x: Math.floor((instanceData.location.x / roomDimensions.X_MAX) * mapContext.canvas.width),
            y: Math.floor((instanceData.location.y / roomDimensions.Y_MAX) * mapContext.canvas.height),
        };
        renderBot(mapContext, scaledRobotCoords.x, scaledRobotCoords.y, instanceData.direction);
    }

    function updateStatusPane(instanceDetails) {
        // Update Instance Details
        document.getElementById('room-dim-field').innerText =
            `X: ${instanceDetails.constants.ROOM_DIMENSIONS.X_MAX}, Y: ${instanceDetails.constants.ROOM_DIMENSIONS.Y_MAX}`;
        document.getElementById('org-bin-location-field').innerText =
            `X: ${instanceDetails.constants.BIN_LOCATION.ORGANIC.X}, Y: ${instanceDetails.constants.BIN_LOCATION.ORGANIC.Y}`;
        document.getElementById('rec-bin-location-field').innerText =
            `X: ${instanceDetails.constants.BIN_LOCATION.RECYCLE.X}, Y: ${instanceDetails.constants.BIN_LOCATION.RECYCLE.Y}`;
        document.getElementById('gar-bin-location-field').innerText =
            `X: ${instanceDetails.constants.BIN_LOCATION.GARBAGE.X}, Y: ${instanceDetails.constants.BIN_LOCATION.GARBAGE.Y}`;
        document.getElementById('scan-radius-field').innerText = `${instanceDetails.constants.SCAN_RADIUS}`;

        // Update Robot Details
        document.getElementById('robot-pos-field').innerText =
            `X: ${instanceDetails.location.x}, Y: ${instanceDetails.location.y}`;
        document.getElementById('robot-dir-field').innerText = `${instanceDetails.direction}`;
        document.getElementById('robot-items-held-field').innerText = `${instanceDetails.itemsHeld.length}`;

        // Update Status Details
        let totalItemCount = instanceDetails.constants.TOTAL_COUNT;
        totalItemCount = totalItemCount.ORGANIC + totalItemCount.GARBAGE + totalItemCount.RECYCLE;
        document.getElementById('time-spent-field').innerText = `${instanceDetails.timeSpent}`;
        document.getElementById('items-collected-field').innerText = `${instanceDetails.itemsCollected.length}`;
        document.getElementById('completion-field').innerText =
            `${Math.round(instanceDetails.itemsCollected.length / totalItemCount * 100 * 100) / 100}%`;
    }

    function renderBot(ctx, xPos, yPos, direction) {
        ctx.fillStyle = ROBOT_COLOUR;
        ctx.beginPath();

        switch(direction) {
            case 'N':
                ctx.moveTo(xPos, yPos - RENDER_SIZE);
                ctx.lineTo(xPos - RENDER_SIZE, yPos + RENDER_SIZE);
                ctx.lineTo(xPos + RENDER_SIZE, yPos + RENDER_SIZE);
                ctx.moveTo(xPos, yPos - 5);
                ctx.closePath();
                break;
            case 'S':
                ctx.moveTo(xPos, yPos + RENDER_SIZE);
                ctx.lineTo(xPos - RENDER_SIZE, yPos - RENDER_SIZE);
                ctx.lineTo(xPos + RENDER_SIZE, yPos - RENDER_SIZE);
                ctx.moveTo(xPos, yPos + RENDER_SIZE);
                ctx.closePath();
                break;
            case 'E':
                ctx.moveTo(xPos + RENDER_SIZE, yPos);
                ctx.lineTo(xPos - RENDER_SIZE, yPos + RENDER_SIZE);
                ctx.lineTo(xPos - RENDER_SIZE, yPos - RENDER_SIZE);
                ctx.moveTo(xPos + RENDER_SIZE, yPos);
                ctx.closePath();
                break;
            case 'W':
                ctx.moveTo(xPos - RENDER_SIZE, yPos);
                ctx.lineTo(xPos + RENDER_SIZE, yPos + RENDER_SIZE);
                ctx.lineTo(xPos + RENDER_SIZE, yPos - RENDER_SIZE);
                ctx.moveTo(xPos - RENDER_SIZE, yPos);
                ctx.closePath();
                break;
        }

        ctx.fill();
    }

    function renderRecycle(ctx, xPos, yPos) {
        renderCircle(ctx, RENDER_SIZE, xPos, yPos, RECYCLE_COLOUR);
    }

    function renderGarbage(ctx, xPos, yPos) {
        renderCircle(ctx, RENDER_SIZE, xPos, yPos, GARBAGE_COLOUR);
    }

    function renderOrganic(ctx, xPos, yPos) {
        renderCircle(ctx, RENDER_SIZE, xPos, yPos, ORGANIC_COLOUR);
    }

    function renderRecycleBin(ctx, xPos, yPos) {
        renderSquare(ctx, RENDER_SIZE * 2, xPos, yPos, RECYCLE_COLOUR);
    }

    function renderGarbageBin(ctx, xPos, yPos) {
        renderSquare(ctx, RENDER_SIZE * 2, xPos, yPos, GARBAGE_COLOUR);
    }

    function renderOrganicBin(ctx, xPos, yPos) {
        renderSquare(ctx, RENDER_SIZE * 2, xPos, yPos, ORGANIC_COLOUR);
    }

    function renderCircle(ctx, radius, xPos, yPos, colour) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = colour;
        ctx.fill();
    }

    function renderSquare(ctx, dimension, xPos, yPos, colour) {
        ctx.beginPath();
        ctx.rect(xPos - Math.floor(dimension / 2), yPos - Math.floor(dimension / 2), dimension, dimension);
        ctx.fillStyle = colour;
        ctx.fill();
    }

    function drawGrid(ctx, xDim, yDim) {
        // Draw horizontal lines
        for(let i = 0; i < xDim; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (i / yDim) * ctx.canvas.height);
            ctx.lineTo(ctx.canvas.width, (i / yDim) * ctx.canvas.height);
            ctx.strokeStyle = '#999';
            ctx.stroke();
        }

        // Draw vertical lines
        for(let i = 0; i < yDim; i++) {
            ctx.beginPath();
            ctx.moveTo((i / xDim) * ctx.canvas.width, 0);
            ctx.lineTo((i / xDim) * ctx.canvas.width, ctx.canvas.height);
            ctx.strokeStyle = '#999';
            ctx.stroke();
        }
    }

    function clearMap(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    }
})();