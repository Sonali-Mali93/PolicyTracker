const { isMainThread, parentPort, workerData } = require("worker_threads");
const os = require("os");
const csv = require("csvtojson");

if (!isMainThread) {
  const processCSV = async () => {
    try {
      const jsonObj = await csv().fromFile(workerData.path);
      const agents = [],
        users = [],
        userAccounts = [],
        policyCategory = [],
        carriers = [],
        policy = [];

      for (let i = 0; i < jsonObj.length; i++) {
        let agentsObj = {
          agentname: jsonObj[i]["agent"],
        };
        agents.push(agentsObj);

        let userObj = {
          firstname: jsonObj[i]["firstname"],
          dob: jsonObj[i]["dob"],
          address: jsonObj[i]["address"],
          phone: jsonObj[i]["phone"],
          state: jsonObj[i]["state"],
          zipCode: jsonObj[i]["zip"],
          email: jsonObj[i]["email"],
          gender: jsonObj[i]["gender"],
          userType: jsonObj[i]["userType"],
        };
        users.push(userObj);

        let userAccountObj = {
          accountName: jsonObj[i]["account_name"],
        };
        userAccounts.push(userAccountObj);

        let policyCatgoryObj = {
          categoryName: jsonObj[i]["category_name"],
        };
        policyCategory.push(policyCatgoryObj);

        let CarrierObj = {
          companyName: jsonObj[i]["company_name"],
        };
        carriers.push(CarrierObj);

        let policyObj = {
          policyNumber: jsonObj[i]["policy_number"],
          policyStartDate: jsonObj[i]["policy_start_date"],
          policyEndDate: jsonObj[i]["policy_end_date"],
          policyCategory: jsonObj[i]["policy_type"],
          collectionId: null,
          userId: null,
          companyCollectionId: null,
        };
        policy.push(policyObj);
      }

      parentPort.postMessage({
        agents,
        users,
        userAccounts,
        policyCategory,
        carriers,
        policy,
      });

      // CPU Utilization tracking for the worker thread
      setInterval(() => {
        const cpuUsage = os.loadavg()[0]; // Get 1-minute average CPU usage
        console.log(`Worker Thread - Current CPU Usage: ${cpuUsage}%`);
        if (cpuUsage > 70) {
          console.log(
            "Worker Thread - CPU usage exceeds 70%. Restarting worker thread..."
          );
          process.exit(); // This will restart the worker thread
        }
      }, 5000); // Check every 5 seconds
      
    } catch (error) {
      parentPort.postMessage({ error });
    }
  };

  processCSV();
}
