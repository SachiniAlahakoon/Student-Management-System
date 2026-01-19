import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateSubjectReportPdf = (reportData) => {
  const { meta, stats, students } = reportData;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Subject Performance Report", 14, 20);

  // Meta information
  doc.setFontSize(11);
  doc.text(`Class: ${meta.class}`, 14, 30);
  doc.text(`Subject: ${meta.subject}`, 14, 36);
  doc.text(`Term: ${meta.term}`, 14, 42);
  doc.text(`Year: ${meta.year}`, 14, 48);

  // Statistics 
  doc.setFontSize(13);
  doc.text("Summary Statistics", 14, 60);

  doc.setFontSize(11);
  const statsY = 68;

  doc.text(`Total Students: ${stats.totalStudents}`, 14, statsY);
  doc.text(`Attended: ${stats.attended}`, 14, statsY + 6);
  doc.text(`Absent: ${stats.absent}`, 14, statsY + 12);
  doc.text(`Passed: ${stats.passed}`, 14, statsY + 18);
  doc.text(`Failed: ${stats.failed}`, 14, statsY + 24);
  doc.text(`Pass Rate: ${stats.passRate}%`, 14, statsY + 30);
  doc.text(`Average Marks: ${stats.average}`, 14, statsY + 36);

  // Students table
  autoTable(doc, {
    startY: statsY + 45,
    head: [["Reg No", "Student Name", "Marks", "Grade", "Rank"]],
    body: students.map((s) => [
      s.reg_no,
      s.student_name,
      s.marks ?? "N/A",
      s.grade ?? "N/A",
      s.rank ?? "-",
    ]),
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [22, 160, 133],
    },
  });

  // Save 
  doc.save(
    `Subject_Report_${meta.class}_${meta.subject}_${meta.year}_${meta.term}.pdf`
  );
};
