export const  array_move = (arr: any, old_index: number, new_index: number, min_index: number = 0) => {
    if (new_index >= arr.length || new_index < min_index) {
        return arr
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export const  minmax = (min: number, value: number, max: number): number => {
    return Math.max(min, Math.min(max, value))
}; 