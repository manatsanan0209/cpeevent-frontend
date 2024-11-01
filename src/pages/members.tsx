
import DefaultLayout from "@/layouts/default";

export default function MembersPage() {

    const members = [
        {
            studentID: "65070501038",
            Name: "COMCAMP 34",
            Role: "Member",
            Tel: "0812345678",
        },
        {
            studentID: "65070501055",
            Name: "ufylukn;f 34",
            Role: "Member",
            Tel: "0812345678",
        },
        {
            studentID: "65070501058",
            Name: "htkhopdh 34",
            Role: "Admin",
            Tel: "0812345678",
        },
        {
            studentID: "65070501055",
            Name: "ufylukn;f 34",
            Role: "Member",
            Tel: "0812345678",
        },
        {
            studentID: "65070501058",
            Name: "htkhopdh 34",
            Role: "Admin",
            Tel: "0812345678",
        },
        {
            studentID: "65070501058",
            Name: "htkhopdh 34",
            Role: "Admin",
            Tel: "0812345678",
        },
    ];

    return (
        <DefaultLayout>
            <div className="font-bold text-4xl m-10 text-gray-700">Members</div>
            <title>Members</title>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full">
                    <thead>
                        <tr className="bg-purple-200 w-fit ">
                            <th className="px-4 py-2 rounded-l-lg text-gray-700 w-1/4 ">Student ID</th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">Name</th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">Role</th>
                            <th className="px-4 py-2 rounded-r-lg text-gray-700 w-1/4">Tel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                             <tr
                             key={index}
                             className={
                                 index === 0 || (index > 0 && member.Role === members[index - 1].Role)
                                     ? "border-t-0"
                                     : "border-t border-gray-300"
                             }
                         >
                                <td className="px-4 py-3 text-center text-gray-700">{member.studentID}</td>
                                <td className="px-4 py-3 text-center text-gray-700">{member.Name}</td>
                                <td className="px-4 py-3 text-center text-gray-700">{member.Role}</td>
                                <td className="px-4 py-3 text-center text-gray-700">{member.Tel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </DefaultLayout>
    );
}
