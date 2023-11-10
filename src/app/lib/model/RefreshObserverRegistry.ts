import {RefreshObserver} from "@/app/lib/model/RefreshObserver";

export class RefreshObserverRegistry {
    public constructor(private observers: RefreshObserver[]) {
    }

    public addObserver(observer: RefreshObserver) {
        this.observers.push(observer);
    }

    public refreshAll() {
        this.observers.forEach(observer => observer.onRefresh());
    }
}