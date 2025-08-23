export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private collisionCheckTimes: number[] = [];
    private maxSamples = 100;

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    startCollisionCheck(): () => void {
        const startTime = performance.now();
        return () => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            this.collisionCheckTimes.push(duration);
            
            // Keep only the last maxSamples
            if (this.collisionCheckTimes.length > this.maxSamples) {
                this.collisionCheckTimes.shift();
            }
        };
    }

    getAverageCollisionTime(): number {
        if (this.collisionCheckTimes.length === 0) return 0;
        const sum = this.collisionCheckTimes.reduce((a, b) => a + b, 0);
        return sum / this.collisionCheckTimes.length;
    }

    getMaxCollisionTime(): number {
        if (this.collisionCheckTimes.length === 0) return 0;
        return Math.max(...this.collisionCheckTimes);
    }

    getMinCollisionTime(): number {
        if (this.collisionCheckTimes.length === 0) return 0;
        return Math.min(...this.collisionCheckTimes);
    }

    logPerformanceStats(): void {
        console.log('Collision Performance Stats:');
        console.log(`Average: ${this.getAverageCollisionTime().toFixed(2)}ms`);
        console.log(`Min: ${this.getMinCollisionTime().toFixed(2)}ms`);
        console.log(`Max: ${this.getMaxCollisionTime().toFixed(2)}ms`);
        console.log(`Samples: ${this.collisionCheckTimes.length}`);
    }

    reset(): void {
        this.collisionCheckTimes = [];
    }
}
