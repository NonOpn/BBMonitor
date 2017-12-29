import Store from "react-native-store";

const DB = {
  monitor: Store.model("monitor")
}

export default class Database {
  async getMonitors() {
    return DB.monitor.find();
  }

  addMonitor(infos) {
    return DB.monitor.add(infos);
  }

  clearMonitors() {
    return DB.monitor.remove()
  }
}
