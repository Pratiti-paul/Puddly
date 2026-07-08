function getInitialWindowBounds(screen, preferences, size) {
    const display = screen.getPrimaryDisplay();
    const defaultBounds = {
        width: size.width,
        height: size.height,
        x: display.workArea.x + display.workArea.width - size.width,
        y: display.workArea.y + display.workArea.height - size.height
    };

    if (!preferences.windowPosition) {
        return clampWindowBounds(screen, defaultBounds);
    }

    return clampWindowBounds(screen, {
        ...defaultBounds,
        x: preferences.windowPosition.x,
        y: preferences.windowPosition.y
    });
}

function clampWindowBounds(screen, bounds, point) {
    const display = point
        ? screen.getDisplayNearestPoint(point)
        : screen.getDisplayMatching(bounds);
    const workArea = display.workArea;
    const maxX = workArea.x + workArea.width - bounds.width;
    const maxY = workArea.y + workArea.height - bounds.height;

    return {
        ...bounds,
        x: clamp(bounds.x, workArea.x, maxX),
        y: clamp(bounds.y, workArea.y, maxY)
    };
}

function clamp(value, min, max) {
    if (max < min) {
        return min;
    }

    return Math.min(Math.max(Math.round(value), min), max);
}

module.exports = {
    getInitialWindowBounds,
    clampWindowBounds
};
