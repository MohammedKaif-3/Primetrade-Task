import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                status: false,
                message: "User not found"
            })
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        if (!userId) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!name || !email) {
            return res.json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Check if email is used by another account
        const existing = await userModel.findOne({ email });
        if (existing && existing._id.toString() !== userId) {
            return res.json({
                success: false,
                message: "Email already in use"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "Profile updated successfully",
            userData: {
                name: updatedUser.name,
                email: updatedUser.email,
                isAccountVerified: updatedUser.isAccountVerified
            }
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        });
    }
};
