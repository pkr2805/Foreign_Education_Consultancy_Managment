const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./db");

const app = express();
app.use(cors());
//app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});
app.get('/collegeLogin', (req, res) => {
    res.render('collegeL');
});
app.get('/collegeRegister', (req, res) => {
    res.render('collegeR');
});
app.get('/studentLogin', (req, res) => {
    res.render('studentL');
});
app.get('/studentRegister', (req, res) => {
    res.render('studentR');
});
app.get('/adminLogin', (req, res) => {
    res.render('adminL');
});
app.get('/student/:id', (req, res) => {
    const id = req.params.id;
    res.render('studentH', { id });
});
app.get('/college/:id', (req, res) => {
    const id = req.params.id;
    res.render('collegeH', { id });
});
app.get('/admin/:id', (req, res) => {
    res.render('adminH', { id: req.params.id });
});



app.get('/student/:id/applicationstatus', (req, res) => {
    const id = req.params.id;
    db.getApplicationsstatus(id)
        .then((applications) => {
            res.render('studentstatus', { id, applications });
        })
        .catch(error => {
            console.error("Error retrieving application status:", error);
            res.status(500).send("Error retrieving application status");
        });
});

app.get('/college/:id/viewapplication', (req, res) => {
    const id = req.params.id;
    db.getApplicationsFromDatabase(id)
        .then((applications) => {
            console.log(applications);
            res.render('collegeview', { applications, id });
            console.log(applications);
        })
        .catch(error => {
            console.error("Error retrieving application data:", error);
            res.status(500).send("Error retrieving application data");
        });
});

app.get('/college/:id/Admission', (req, res) => {
    const id = req.params.id;
    db.getadmissiondetails(id)
        .then((applications) => {
            console.log(applications);
            res.render('collegeadmissions', { applications, id });
            console.log(applications);
        })
        .catch(error => {
            console.error("Error retrieving application data:", error);
            res.status(500).send("Error retrieving application data");
        });
});


app.get('/college/:id/Help', (req, res) => {
    const id = req.params.id;
    res.render('collegehelp', { id });
});

app.get('/admin/:id/studentaction', (req, res) => {
    const id = req.params.id;
    //console.log(id)
    Promise.all([db.getstudentqueries(id)])
        .then((results) => {
            const [applications] = results;
            console.log(applications,id)
            res.render('adminS', { id, applications });
        })
        .catch(error => {
            res.status(500).send("Error retrieving application data");
        });
});

app.get('/admin/:id/collegeaction', (req, res) => {
    const id = req.params.id;

    Promise.all([db.getcollegequeries(id)])
        .then((results) => {
            const [applications] = results;
            res.render('adminC', { id, applications });
        })
        .catch(error => {
            res.status(500).send("Error retrieving application data");
        });
});

app.get('/student/:id/Help', (req, res) => {
    const id = req.params.id;
    res.render('studenthelp', { id });
});
app.get('/student/:id/applycollege', (req, res) => {
    const id = req.params.id;
    res.render('studentapply', { id })
});

app.post('/studentRegister', (req, res) => {
    const studentData = req.body;
    db.registerStudent(studentData)
        .then(() => {
            res.redirect('/studentLogin')
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
});
app.post('/studentLogin', async (req, res) => {
    const studentData = req.body;
    // Perform registration logic here
    db.loginStudent(studentData)
        .then((user) => {
            console.log(user.Name)
            console.log(user.password)
            console.log(studentData.name)
            console.log(studentData.password)
            if (user.Name == studentData.name &&
                user.password == studentData.password) {
                const id = user.id;
                res.redirect(`/student/${id}`)
            } else {
                console.log("Username or password incorrect");
            }
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
})

app.post('/collegeRegister', (req, res) => {
    const collegeData = req.body;
    const selectedCourses = {};
    if (req.body.cse) selectedCourses.cse = "CSE";
    if (req.body.ise) selectedCourses.ise = "ISE";
    if (req.body.ece) selectedCourses.ece = "ECE";
    if (req.body.me) selectedCourses.me = "ME";
    db.registerCollege(collegeData, selectedCourses)
        .then(() => {
            res.redirect('/collegeLogin')
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
});

app.post('/adminLogin', async (req, res) => {
    const AdminData = req.body;

    db.loginAdmin(AdminData)
        .then((user) => {
            console.log(user.id)
            console.log(user.password)
            console.log(AdminData.id)
            console.log(AdminData.password)
            if (user.id == AdminData.id &&
                user.password == AdminData.password) {
                const id = user.id;
                res.redirect(`/admin/${id}`)
            } else {
                console.log("Username or password incorrect");
            }
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
})
app.post('/collegeLogin', async (req, res) => {
    const collegeData = req.body;
    console.log(collegeData)
    // Perform registration logic here
    db.loginCollege(collegeData)
        .then((user) => {
            console.log(user.Name)
            console.log(user.password)
            console.log(collegeData.name)
            console.log(collegeData.password)
            if (user.Name == collegeData.name &&
                user.password == collegeData.password) {
                const id = user.id;
                res.redirect(`/college/${id}`)
            } else {
                console.log("Username or password incorrect");
            }
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
})
app.post('/student/:id/applycollege', (req, res) => {
    const applicationData = req.body;
    console.log(applicationData)
    const id = req.params.id;
    // Initialize an object to hold the selected courses
    
    const selectedCourses = {};

    // Check if each course checkbox was ticked
    if (req.body.cse) selectedCourses.cse = "CSE";
    if (req.body.ise) selectedCourses.ise = "ISE";
    if (req.body.ece) selectedCourses.ece = "ECE";
    if (req.body.me) selectedCourses.me = "ME";
    db.applyCollege(applicationData, selectedCourses, id)
    
        .then(() => {
            console.log(id)
            res.redirect(`/student/${id}`);
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
});

app.post('/student/:id/Help', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const studentData = req.body;

    db.insertStudentQuery(studentData, id)
        .then(() => {
            res.redirect(`/student/${id}`);

        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
});
app.post('/college/:id/Help', (req, res) => {
    const id = req.params.id;
    const collegeData = req.body;
    console.log(id)

    db.insertcollegeQuery(collegeData, id)
        .then(() => {
            res.redirect(`/college/${id}`);
        })
        .catch(error => {
            res.status(400).json({ success: false, message: error.message });
        });
});

app.post('/college/:id/viewapplication', async (req, res) => {
    const id = req.params.id;
    const application_id = req.body.application_id;
    try {
        await db.changeStatus(application_id);
        res.redirect(`/college/${id}`);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/admin/:id/resolve/:clgid', async (req, res) => {
    const id = req.params.id;
    const id2 = req.params.clgid
    try {
        await db.changeStatusResolve(id2);
        res.redirect(`/admin/${id}`);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/admin/:id/resolve2/:stdid', async (req, res) => {
    const id = req.params.id;
    const id2 = req.params.stdid
     
    console.log(req.params)
    try {
        await db.changeStatusResolve2(id2);
        res.redirect(`/admin/${id2}`);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

});