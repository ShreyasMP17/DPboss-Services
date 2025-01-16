const Lottery = require('../Model/user.model');

//CREATE
const createLottery = async(req,res)=>{
    try{
        const createData = new Lottery({
            name: req.body.name,
            leftNo: req.body.leftNo,
            midNo:req.body.midNo,
            rightNo:req.body.rightNo,
            timeStart:req.body.timeStart,
            timeEnd:req.body.timeEnd,
        })
        if(createData){
            createData.save()
            res.status(200).send({statusCode: 200, data: createData, MessageChannel: "Data Inserted Successfully."})
        }else{
            res.status(200).send({statusCode: 200, data:createData, MessageChannel: "Failed to insert data."})
        }
    }catch(err){
        res.status(200).send({statusCode: 200, data: err, MessageChannel: "Internal Server Error."})
    }
}

//READ
const getLottery = async(req, res)=>{
    try{
        const getData = await Lottery.find()
    if(getData){                
        return res.status(200).send({status: 200, data: getData, MessageChannel:"Data fetched Successfully"})
    }else{
        return res.status(404).send({status: 404, data: getData, MessageChannel:"Failed to fetch data"})
    }
    }catch(err){
        return res.status(500).send({status: 500, data:err, MessageChannel:"Internal Server Error"})
    }
}

 const getLotteryById = async (req, res) => {
        try {
            const { id } = req.params;
            const lottery = await Lottery.findById(id);

            if (!lottery) {
                return res.status(404).json({ message: 'Lottery not found' });
            }

            res.status(200).json(lottery);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    // Update a lottery entry by ID
    const updateLottery = async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedLottery = await Lottery.findByIdAndUpdate(id, updates, { new: true });

            if (!updatedLottery) {
                return res.status(404).json({ message: 'Lottery not found' });
            }

            res.status(200).json({ message: 'Lottery updated successfully', lottery: updatedLottery });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    // Delete a lottery entry by ID
    const deleteLottery = async (req, res) => {
        try {
            const { id } = req.params;

            const deletedLottery = await Lottery.findByIdAndDelete(id);

            if (!deletedLottery) {
                return res.status(404).json({ message: 'Lottery not found' });
            }

            res.status(200).json({ message: 'Lottery deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }


    const getWeek = async (req, res) => {
        const lottery = await Lottery.findById(req.params.id);
        res.json({ data: lottery });
      }
      
      // const postWeek = async (req, res) => {
      //   const { id } = req.params;
      //   const { week, data } = req.body;
      //   const lottery = await Lottery.findById(id);
      //   lottery.weeklyResults.push({ week, data });
      //   await lottery.save();
      //   res.json({ record: { week, data } });
      // }

      const postWeek = async (req, res) => {
        const { id } = req.params; // Lottery ID
        const { week, data } = req.body; // New weekly data
    
        try {
            const lottery = await Lottery.findById(id);
            if (!lottery) {
                return res.status(404).json({ message: "Lottery not found" });
            }
    
            // Add the new week data
            lottery.weeklyResults.push({ week, data });
            await lottery.save();
    
            res.status(200).json({ message: "Week data added successfully", weeklyResults: lottery.weeklyResults });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    };
      
      const updateWeek = async (req, res) => {
        const { id, recordId } = req.params;
        const updatedData = req.body;
        const lottery = await Lottery.findById(id);
        const record = lottery.weeklyResults.id(recordId);
        Object.assign(record, updatedData);
        await lottery.save();
        res.json({ updatedRecord: record });
      }


const getLiveLottery = async (req, res) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      // Fetch today's results
      const todayResults = await Lottery.find({
        timeStart: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() },
      });
  
      // Fetch yesterday's results
      const yesterday = new Date(startOfDay);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
      const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));
  
      const yesterdayResults = await Lottery.find({
        timeStart: { $gte: yesterdayStart.toISOString(), $lte: yesterdayEnd.toISOString() },
      });
  
      // Map yesterday's data by `name` for comparison
      const yesterdayMap = {};
      yesterdayResults.forEach((entry) => {
        yesterdayMap[entry.name] = entry.midNo; // Use `midNo` for comparison
      });
  
      // Compare today's and yesterday's data to determine status
      const liveResults = todayResults.map((row) => {
        const yesterdayMidNo = yesterdayMap[row.name];
        const isUpdated = yesterdayMidNo ? row.midNo !== yesterdayMidNo : true;
  
        return {
          ...row._doc,
          status: isUpdated ? "UPDATED" : "LOADING",
        };
      });
  
      res.status(200).send({
        status: 200,
        data: liveResults,
        MessageChannel: "Live results fetched successfully",
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        data: err,
        MessageChannel: "Internal Server Error",
      });
    }
  };



  

module.exports = { getLottery, createLottery,updateLottery,getLotteryById, deleteLottery, getLiveLottery,updateWeek, getWeek, postWeek }