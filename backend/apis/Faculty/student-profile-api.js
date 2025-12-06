app.get("students/:id/details", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("students/:id/performance-timeline", async (req, res) => {
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