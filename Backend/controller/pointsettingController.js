import PointSetting from "../model/pointsetting.js";


export const createpointsettings=async(req,res)=>{
    try{
    const pointsettings=await PointSetting.findOneAndUpdate(
        {},
        req.body,
        {
            upsert:true,
            // new:true,
            returnDocument: "after",
            setDefaultsOnInsert:true
        }
    )
      return res.status(200).json({
            success: true,
            message: "Pointsettings updated successfully",
            data: pointsettings
        });}catch(err){
            return res.status(500).json({ success: false, message: err.message });
        }
}

export const getpointsettings=async(req,res)=>{
   try{
 
    const getpoints=await PointSetting.findOne();
   if (!getpoints) {
            return res.status(404).json({
                success: false,
                message: "No point rules have been configured yet by the admin."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Current point rules fetched successfully",
            data: getpoints 
        });
   }catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}