export default defineStore('progress', {
    state: () => ({ progress: 0 }),
    actions: {
        set(number: number) {
            this.progress = number;
        }
    }
});
