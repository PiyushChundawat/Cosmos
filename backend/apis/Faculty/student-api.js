app.get("students?classId=&testId=", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("students/:id", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.post("students/:id/feedback", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("students/:id/feedback", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

