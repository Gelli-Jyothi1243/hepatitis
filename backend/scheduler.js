const cron = require("node-cron");
const Medicine = require("./models/Medicine");
const User = require("./models/User");
const sendWhatsApp = require("./utils/whatsappService");

cron.schedule("* * * * *", async () => {

  const now = new Date();

  // ✅ Convert to IST
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const currentHour = istNow.getHours();
  const currentMinute = istNow.getMinutes();

  console.log("Checking reminders at:", currentHour + ":" + currentMinute);

  try {

    const medicines = await Medicine.find();

    for (let med of medicines) {

      // 🔥 AUTO DELETE BASED ON END DATE + TIME
      if (med.endDate && med.time) {

        const [medHour, medMinute] = med.time.split(":").map(Number);

        const fullEndDateTime = new Date(
          med.endDate.getFullYear(),
          med.endDate.getMonth(),
          med.endDate.getDate(),
          medHour,
          medMinute
        );

        if (istNow > fullEndDateTime) {
          await Medicine.findByIdAndDelete(med._id);
          console.log("Deleted expired medicine:", med.name);
          continue;
        }
      }

      // 🔔 SEND REMINDER AT EXACT TIME
      if (med.time) {

        const [medHour, medMinute] = med.time.split(":").map(Number);

        if (
          medHour === currentHour &&
          medMinute === currentMinute
        ) {

          const user = await User.findById(med.userId);

          if (user && user.phone) {
            await sendWhatsApp(
              user.phone,
              `⏰ Medicine Reminder\n\nTake ${med.name} now 💊`
            );

            console.log("Reminder sent:", med.name);
          }
        }
      }
    }

  } catch (error) {
    console.log("Scheduler Error:", error.message);
  }

});