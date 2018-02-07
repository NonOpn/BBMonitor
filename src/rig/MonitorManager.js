import MonitorWorker from "./MonitorWorker.js";
import EventEmitter from "eventemitter2";

class MonitorManager extends EventEmitter {

  workers: MonitorWorker[] = [];

  constructor() {
    super();
    this.workers = [];
    this._started = false;
  }

  addNewWorker(uuid: string, host: string, port: number) {
    const filtered = this.workers.filter(worker => worker.equals(uuid));

    if(filtered.length === 0) {
      const worker = new MonitorWorker(uuid, host, port);
      this.workers.push(worker);

      worker.on(uuid, (data) => this.emit(uuid, data));

      if(this._started) {
        worker.start();
      }
    } else {
      filtered.forEach(worker => {
        worker.update(uuid, host, port);
      })
    }
  }

  start() {
    this._started = true;
    this.workers.forEach(worker => worker.start());
  }

  stop() {
    this._started = false;
    this.workers.forEach(worker => worker.stop());
  }

}

export default new MonitorManager();
