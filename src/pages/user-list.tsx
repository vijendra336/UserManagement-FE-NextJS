import { useEffect, useState } from "react";
import { User, PaginatedUsers } from "../app/users";
import { useRouter } from 'next/router';

const Page_Size = 3;

const UserList: React.FunctionComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setPage] = useState(1);
    const [totalUsers, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);  // Track loading state
    const router = useRouter();  // Use useRouter for navigation

    const fetchUsers = async (page: number) => {
        setLoading(true);  // Start loading when fetching data
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/page/${page}/${Page_Size}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json() as PaginatedUsers;
            if (data && Array.isArray(data.users)) {
                setUsers(data.users);
                setTotal(data.total);
            } else {
                console.error("Invalid data format:", data);
                setUsers([]); // In case of incorrect data format
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);  // Set users to an empty array on error
        } finally {
            setLoading(false);  // Set loading to false once fetch is complete
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalUsers / Page_Size);

    const handleCreateUser = () => {
        router.push('/create-user');  // Navigates to the Create User page
    };

    if (loading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;  // Show loading spinner
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">User List</h2>
            
            {/* Table for displaying users */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.dateOfBirth}</td>
                                    <td>{user.phoneNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* Pagination Controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages).keys()].map((page) => (
                        <li className={`page-item ${page + 1 === currentPage ? "active" : ""}`} key={page}>
                            <button
                                className="page-link"
                                onClick={() => setPage(page + 1)}
                            >
                                {page + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            
            {/* Create User Button */}
            <div className="d-grid gap-2 mb-4">
                <button className="btn btn-success" onClick={handleCreateUser}>
                    Create New User
                </button>
            </div>
        </div>
    );
};

export default UserList;
