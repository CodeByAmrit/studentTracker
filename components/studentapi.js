// fake data
const data = {
  students: [
    {
      id: 1,
      name: 'Amrit',
      srn: 7654321,
      admission: 1234567
    },
    {
      id: 2,
      name: 'Gagan',
      srn: 7654321,
      admission: 1234567
    },
    {
      id: 3,
      name: 'Radhika',
      srn: 7654321,
      admission: 1234567
    },
    {
      id: 4,
      name: 'Vaibhav',
      srn: 7654321,
      admission: 1234567
    }
  ]
}

function getAllStudent (req, res) {
  const id = req.params.id

  const searched = []

  data.students.forEach(student => {
    if (student.id === id) {
      searched.push(student)
    }
  })
  console.log(searched)
}

getAllStudent({ params: [{ id: 1 }] })
