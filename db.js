const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
function registerStudent(studentData) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO student (student_name, email, contact, sat_score, Ilets_score, password) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(query, [studentData.name, studentData.email, studentData.contact, studentData.score1, studentData.score, studentData.password], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
function loginStudent(studentData) {
    return new Promise((resolve, reject) => {
        const query = "select * from student where student_name = ?";
        db.query(query, [
            studentData.name,
            studentData.password
        ], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const user = {
                    id: results[0].Student_id,
                    Name: results[0].Student_Name,
                    password: results[0].Password
                }
                console.log(user)
                resolve(user);
            }
        });
    });
}
function registerCollege(collegeData, selectedCourses) {
    return new Promise((resolve, reject) => {
        const coursesOffered = Object.values(selectedCourses).join(', ');

        const query = "INSERT INTO colleges (College_name, college_contact, college_email, college_location, courses_offered, college_password) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(query, [collegeData.name, collegeData.contact, collegeData.email, collegeData.address, coursesOffered, collegeData.password], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


function loginCollege(collegeData) {
    return new Promise((resolve, reject) => {
        const query = "select * from colleges where college_name = ?";
        db.query(query, [
            collegeData.name,
            collegeData.password
        ], (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                const user = {
                    id: results[0].college_id,
                    Name: results[0].college_name,
                    password: results[0].college_password
                }
                console.log(user)
                resolve(user);
            }
        });
    });
}

function loginAdmin(AdminData) {
    return new Promise((resolve, reject) => {
        const query = "select * from admin where AminId= ?";
        db.query(query, [
            AdminData.id,
            AdminData.password
        ], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const user = {
                    id: results[0].AminId,

                    password: results[0].Password
                }
                console.log(user)
                resolve(user);
            }
        });
    });
}
function applyCollege(applicationData, selectedCourses, id) {
    return new Promise((resolve, reject) => {
        const coursesOffered = Object.values(selectedCourses).join(', ');
        const query = `
        INSERT INTO application (Student_id,college_name, Student_Name, contact, Email,course, college_id, sat_score, ilets_score, status)
SELECT ?,?, s.Student_Name, s.contact, s.Email, ?,(SELECT college_id FROM colleges WHERE college_name = ?) , s.sat_score, s.ilets_score, 'Pending'
FROM student s
WHERE s.Student_id = ?`;

console.log("SQL Query:", query);
console.log("Parameters:", [id, applicationData.Collegename, coursesOffered, id]);
    
        db.query(query, [id, applicationData.Collegename, coursesOffered,applicationData.Collegename, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log(result);
                resolve();
            }
        });
    });
}





function getApplicationsFromDatabase(id) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT  
            application_id ,
            Student_Name ,
            student_id,
            college_name ,
            sat_score ,
            ilets_score ,
            course ,
            status
        FROM  
            application
        WHERE  
            college_id= ?
        `;
        db.query(query, [id], (error, results) => {
            if (error) {
                console.error("Error retrieving application data:", error);
                reject(error);
            } else {
                console.log(results);
                const applicationData = results.map(row => ({
                    appId: row.application_id,
                    studentName: row.Student_Name,
                    studentId: row.student_id,
                    collegeName: row.college_name,
                    sat: row.sat_score,
                    ielts: row.ilets_score,
                    selectedCourses: row.course,
                    status: row.status
                }));

                resolve(applicationData);
            }
        });
    });
}

function getApplicationsstatus(id) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT  
            application_id ,  
            student_id,
            college_name ,
            course ,
            status
        FROM  
            application
        WHERE  
            student_id= ?
    `;
        db.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                const applicationData = results.map(row => ({
                    appId: row.application_id,
                    collegeName: row.college_name,
                    selectedCourses: row.course,
                    status: row.status
                }));

                resolve(applicationData);
            }
        });
    });
}

function insertStudentQuery(studentData, id) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE student SET queries = ? WHERE student_id = ?";
        db.query(query, [studentData.message, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function insertcollegeQuery(collegeData, id) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE colleges SET queries = ? WHERE college_id = ?";
        db.query(query, [collegeData.message, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
function getstudentqueries(id) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
    student_id,
    student_name,
    queries
FROM
    student
WHERE
    queries IS NOT NULL;

        
    `;
        db.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                const studentData = results.map(row => ({
                    StudentId: row.student_id,
                    StudentName: row.student_name,
                    Queries: row.queries,

                }));

                resolve(studentData);
            }
        });
    });
}


function getcollegequeries(id) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
        college_id,
        college_name,  
        queries

        FROM  
            colleges
        WHERE
            queries  IS NOT NULL
        
    `;
        db.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                const collegeData = results.map(row => ({
                    CollegeId: row.college_id,
                    CollegeName: row.college_name,
                    Queries: row.queries,

                }));

                resolve(collegeData);
            }
        });
    });
}

function changeStatus(application_id) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE application SET status = 'accepted' WHERE application_id = ?";
        db.query(query, [application_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
function getadmissiondetails(id) {
    return new Promise((resolve, reject) => {
        const query = `
    SELECT
    a.admission_id,
    s.student_id,
    s.student_name,  
    s.course

    FROM  
        application s , admission a
    WHERE s.application_id = a.application_id and s.college_id=?

    
`;
        db.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                const collegeData = results.map(row => ({
                    appId: row.admission_id,
                    studentId: row.student_id,
                    studentName: row.student_name,
                    course: row.course,

                }));

                resolve(collegeData);
            }
        });
    });

}

function changeStatusResolve(id) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE colleges SET queries = null WHERE college_id = ?";
        db.query(query, id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function changeStatusResolve2(id) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE student SET queries = null WHERE student_id = ?";
        db.query(query, id, (err, result) => {
            if (err) {
                reject(err);
            } else {

                resolve();
            }
        });
    });
}

module.exports = { registerStudent, loginStudent, registerCollege, loginCollege, loginAdmin, applyCollege, getApplicationsFromDatabase, getApplicationsstatus, insertStudentQuery, insertcollegeQuery, getstudentqueries, getcollegequeries, changeStatus, getadmissiondetails, changeStatusResolve , changeStatusResolve2 };
