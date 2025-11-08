const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

let students = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@iti.edu",
    age: 22,
    major: "Computer Science",
  },
  {
    id: "2",
    name: "Fatma Ali",
    email: "fatma@iti.edu",
    age: 21,
    major: "Information Systems",
  },
];

let courses = [
  {
    id: "1",
    title: "Data Structures",
    code: "CS201",
    credits: 3,
    instructor: "Dr. Mohamed",
  },
  {
    id: "2",
    title: "Database Systems",
    code: "CS301",
    credits: 4,
    instructor: "Dr. Sarah",
  },
];

const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
    email: String!
    age: Int!
    major: String
    courses: [Course!]!
  }

  type Course {
    id: ID!
    title: String!
    code: String!
    credits: Int!
    instructor: String!
    students: [Student!]!
  }

  type Query {
    getAllCourses: [Course!]!
    getCourse(id: ID!): Course
    getAllStudent: [Student!]!
    getStudent(id: ID!): Student
    searchStudentsByMajor(major: String!): [Student!]!
  }

  input StudentInput {
    id: ID!
    name: String!
    email: String!
    age: Int!
    major: String
    courses: [ID!]
  }

  input CourseInput {
    id: ID!
    title: String!
    code: String!
    credits: Int!
    instructor: String!
    students: [ID!]
  }

  input StudentInputUpdate {
    id: ID
    name: String
    email: String
    age: Int
    major: String
    courses: [ID!]
  }

  input CourseInputUpdate {
    id: ID
    title: String
    code: String
    credits: Int
    instructor: String
    students: [ID!]
  }

  type Mutation {
    addStudent(input: StudentInput!): Student!
    addCourse(input: CourseInput!): Course!
    updateStudent(input: StudentInputUpdate!, id: ID!): Student!
    deleteStudent(id: ID!): Student!
    updateCourse(input: CourseInputUpdate!, id: ID!): Course!
    deleteCourse(id: ID!): Course!
  }
`;
const resolvers = {
  Query: {
    getAllStudent: () => students,
    getAllCourses: () => courses,
    getCourse: async (_, { id }) => courses.find((e) => e.id === id),
    getStudent: async (_, { id }) => students.find((e) => e.id === id),
    searchStudentsByMajor: (_, { major }) => {
      return students.filter(
        (student) =>
          student.major &&
          student.major.toLowerCase().includes(major.toLowerCase()),
      );
    },
  },
  Mutation: {
    addStudent: (_, { input }) => {
      const student = { ...input };

      students.push(student);
      return student;
    },
    addCourse: (_, { input }) => {
      const course = { ...input };

      courses.push(course);
      return course;
    },

    updateStudent: (_, { input, id }) => {
      const index = students.findIndex((student) => student.id === id);

      students[index] = { ...students[index], ...input };

      return students[index];
    },
    updateCourse: (_, { input, id }) => {
      const index = courses.findIndex((course) => course.id === id);

      courses[index] = { ...courses[index], ...input };

      return courses[index];
    },
    deleteStudent: (_, { id }) => {
      const index = students.findIndex((student) => student.id === id);
      if (index === -1) throw new Error("Student not found");
      const deleted = students.splice(index, 1)[0];
      return deleted;
    },

    deleteCourse: (_, { id }) => {
      const index = courses.findIndex((course) => course.id === id);
      if (index === -1) throw new Error("Course not found");
      const deleted = courses.splice(index, 1)[0];
      console.log(deleted);
      return deleted;
    },
  },
};

async function start() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen("4000", () =>
    console.log("app running on http://localhost:4000/graphql"),
  );
}

start();
