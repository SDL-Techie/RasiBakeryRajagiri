import Category from "../model/categoryModel.js"

export const createcategory=async(req,res)=>{
    try{
   const category=await Category.create(req.body)
   res.status(201).json({
    success:true,
    message:"category created successfully",
    data:category,
  })}catch(err){
    res.status(500).json({
        success:false,
      message: "Error creating category",
      error: err.message,
    })
  }
}


export const getallcategory=async(req,res)=>{
    try{
    const category=await Category.find()
    res.status(200).json({
        success:true,
        message:"Sucessfully fetched",
        data:category,
    })
    }catch(err){
      res.status(500).json({
      success:false,
      message: "Error fetching category",
      error: err.message,
    })
    }
}

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedCategory = await Category.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true } // new: true returns the modified document rather than the original
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: err.message,
        });
    }
}

// DELETE CATEGORY (Bonus)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: err.message,
        });
    }
}