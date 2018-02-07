import Store from "react-native-store";

const DB = {
  monitor: Store.model("monitor")
}

export default class Database {
  async getMonitors() {
    return DB.monitor.find();
  }

  update(infos) {
    return new Promise((resolve, reject) => {
      const id = infos._id;
      DB.monitor.update(infos, {
        where: {
          _id: id
        }
      })
      .then(all_infos => {
        var found = undefined;
        all_infos.forEach(from_db => {
          if(from_db._id == id) found = from_db;
        });

        if(found) {
          resolve(found);
        } else {
          reject("invalid !");
        }
      })
      .catch(err => reject(err));
    });
  }

  addMonitor(infos) {
    return DB.monitor.add(infos);
  }

  clearMonitors() {
    return DB.monitor.remove()
  }
}
