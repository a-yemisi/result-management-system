import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type {
  Classes,
  StaffDetails,
  StaffRoles,
  StudentDetails,
} from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Helper function to retrieve user details based on student or staff role
async function getUserDetails(user: any) {
  let moreDetails: StudentDetails | StaffDetails | null = null;
  let studentCurrentClass: Classes | null = null;
  let importantStaffRole: StaffRoles | null = null;

  if (user.is_student) {
    moreDetails = await prisma.studentDetails.findUnique({
      where: { student_id: user.user_id },
    });
    studentCurrentClass = await prisma.classes.findUnique({
      where: { class_id: moreDetails?.class_id },
    });
  } else {
    moreDetails = await prisma.staffDetails.findUnique({
      where: { staff_id: user.user_id },
    });
    const staffRoleAggregate = await prisma.staffUserRoles.aggregate({
      where: { staff_id: user.user_id },
      _max: { role_id: true },
    });
    importantStaffRole = await prisma.staffRoles.findUnique({
      where: { role_id: staffRoleAggregate._max?.role_id },
    });
  }

  return { moreDetails, studentCurrentClass, importantStaffRole };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.users.findUnique({
          where: {
            username: credentials?.username,
            OR: [
              { StaffDetails: { is_active: true } },
              { StudentDetails: { is_active: true } },
            ],
          },
        });

        if (!user) return null;

        try {
          const {
            moreDetails,
            studentCurrentClass,
            importantStaffRole,
            roleNames,
          } = await getUserDetails(user);

          if (moreDetails?.is_active === false) {
            return null; // Inactive users are not allowed
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password,
            user.password_hash
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user info if authentication is successful
          return {
            id: user.user_id,
            name: user.username,
            firstName: user.first_name,
            isStudent: user.is_student,
            studentClass: studentCurrentClass?.class_name,
            staffRole: importantStaffRole?.role_name,
            staffRolesNames: roleNames,
          };
        } catch (error) {
          console.error("Authorization Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 20 * 60, // 20 minutes
    updateAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.isStudent = user.isStudent;
        token.studentClass = user.studentClass;
        token.staffRole = user.staffRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.isStudent = token.isStudent;
        session.user.studentClass = token.studentClass;
        session.user.staffRole = token.staffRole;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
