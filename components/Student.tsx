interface StudentProps {
  username: string;
}

function Student(props: StudentProps) {
  return (
    <>
      <div className="flex text-teal-800 font-bold text-lg">
        <div className="">考生姓名: {props.username}</div>
      </div>
    </>
  );
}

export default Student;
