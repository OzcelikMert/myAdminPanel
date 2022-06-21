class Thread {
    static sleep(ms: number): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, 750));
    }
}

export default Thread;