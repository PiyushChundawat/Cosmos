app.post("/questions", async (req, res) => {
    try {
        const {facultyId, questionText, options, correctAnswer, tags} = req.body;
        
        const newQuestion = new Question.create({
            facultyId, 
            questionText,
            options,
            correctAnswer,
            tags: {
                subject,
                topic
            }
        });
        await newQuestion.save();
        res.status(201).json({message: "Question submitted successfully"});
    }
    catch(error) {
        res.status(500).json({message: "Error submitting question", error: error.message});
    }
});

// ============ READ - Get All Questions ============
app.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select('-__v');  // Exclude version key
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
});

// ============ READ - Get Question by ID ============
app.get("/questions/:id", async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: question
        });
    }
    catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error fetching question",
            error: error.message
        });
    }
});

app.get("/questions/faculty/:facultyId", async (req, res) => {
    try {
        const questions = await Question.find({ 
            facultyId: req.params.facultyId,
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
});


// ============ READ - Get Questions by Subject AND Topic ============
app.get("/questions/filter", async (req, res) => {
    try {
        const { subject, topic, difficulty } = req.query;
        
        // Build dynamic filter
        const filter = { isActive: true };
        if (subject) filter['tags.subject'] = subject;
        if (topic) filter['tags.topic'] = topic;
        if (difficulty) filter.difficulty = difficulty;
        
        const questions = await Question.find(filter).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
});

// ============ DELETE - Permanent Delete ============
app.delete("/questions/:id", async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Question deleted permanently",
            data: deletedQuestion
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting question",
            error: error.message
        });
    }
});