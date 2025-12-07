
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        questionText: {
            type:String,
            required: true
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: function(v) {
                    return v.length >= 2; // At least 2 options
                },
                message: 'Question must have at least 2 options'
            }
        },
        correctAnswer: {
            type:String, 
            required: true
        },
        tags: {
            subject: {
                type:String,
                required: true
            },
            topic: {
                type:String,
                required: true
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
