app.get("tests", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("tests/:id", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.post("tests/:id/reschedule", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});
