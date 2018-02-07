import { createConnection } from "react-native-tcp";
import EventEmitter from "eventemitter2";
import DataRetriever from "miner-monitor";
import moment from "moment";

export default class MonitorWorker extends EventEmitter {
  _uuid: string = null;
  _host: string = null;
  _port: number = 0;
  _started: boolean = false;

  constructor(uuid: string, host: string, port: number) {
    super();
    this._uuid = uuid;
    this._host = host;
    this._port = port;
    this._started = false;
    this._points = [];

    this.data_retriever = new DataRetriever({
      host: this._host,
      port: this._port
    }, createConnection);

  }

  equals(uuid: string) {
    return this._uuid === uuid;
  }

  start() {
    if(!this._started) {
      this._started = true;
      this._code = Math.random();

      var internalStart = undefined;
      const recall = (code, delta) => {
        if(!delta) delta = 10;

        if(code === this._code) {
          setTimeout(() => internalStart(), delta);
        }
      }

      internalStart = () => {
        const code = this._code;

        this.emit(this.uuid(), {
          last: "waiting"
        });
        this.data_retriever.call()
        .then(data => {
          if(!data) throw "error";
          this.managePoints(data);
          data.points = this._points;

          this.emit(this.uuid(), {
            last: "ok",
            data: data,
            points: this._points
          });
          recall(code, 1000);
        })
        .catch(err => {
          console.log(err);
          this.managePoints();
          this.emit(this.uuid(), {
            last: "error",
            data: undefined,
            points: this._points
          });
          recall(code, 1000);
        })
      };

      recall(this._code);
    }
  }

  update(uuid, host, port) {
    this._uuid = uuid;
    this._host = host;
    this._port = port;

    this.data_retriever = new DataRetriever({
      host: this._host,
      port: this._port
    }, createConnection);
  }

  managePoints(data: any) {
    if(this._points.length > 100) {
      this._points.shift();
    }

    const now = moment();
    this._points = this._points.filter(point => {
      return now.diff(point.date,"minutes") < 5;
    });

    if(!data) return;

    const hashrate = data.total.eth.hashrate;

    if(hashrate) {
      const date = new moment();
      this._points.push({
        date: date,
        x: (new Date()).getTime(),
        y: parseInt(hashrate)
      });

      this._points.sort((a, b) => {
        if(a.x < b.x) return -1;
        if(a.x > b.x) return 1;
        return 0;
      });
    }
  }

  stop() {
    this._started = false;
    this._code = Math.random();
  }

  uuid() {
    return this._uuid;
  }

  host() {
    return this._host;
  }

  port() {
    return this._port;
  }
}
