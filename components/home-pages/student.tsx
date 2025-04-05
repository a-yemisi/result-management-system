interface StudentInformationProps {
  studentFirstName: string;
  studentLastName: string;
}

export default function StudentInformation({
  studentFirstName,
  studentLastName,
}: StudentInformationProps) {
  return (
    <div className="bg-white p-5 w-full rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Student Information
      </h2>

      {/* Student Profile Section */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 border-2 border-gray-300 rounded-full overflow-hidden">
          <img
            src="#"
            alt="Student Image"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-800">
            {studentFirstName} {studentLastName}
          </p>
          <div className="flex items-center gap-3 text-gray-600">
            <p className="px-3 py-1 bg-gray-100 rounded-lg text-sm">SS2</p>
            <p className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Science</p>
          </div>
          {/* <p className="text-sm text-gray-500 mt-1">LIN-202545553333</p> */}
        </div>
      </div>

      {/* Subjects Offering */}
      <div className="mt-6">
        <p className="text-gray-700 font-medium">Subjects Offering:</p>
        <p className="text-gray-600 text-sm">
          Mathematics, English, Physics, Chemistry...
        </p>
      </div>

      {/* Quick Links Section */}
      <div className="mt-6">
        <h2 className="text-gray-700 font-medium text-lg">Quick Links</h2>
        <div className="flex flex-col gap-2 mt-2">
          <a href="#" className="text-green-700 hover:text-green-900 text-sm">
            View CA / Result &gt;
          </a>
          <a href="#" className="text-green-700 hover:text-green-900 text-sm">
            Student Subjects &gt;
          </a>
        </div>
      </div>
    </div>
  );
}
