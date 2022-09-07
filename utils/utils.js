const submissionCleaner = (submissionElement) => {
  let element = {}
  const questionTitle = submissionElement['questionTitle']

  switch (submissionElement['type']) {
    case "single":      
      element[questionTitle] = submissionElement.choices[0];
      break;
    case "multiple":
      const options = submissionElement.choices.reduce((prev, current, i) => {
        if (i < submissionElement.choices.length - 1 ) {
          return prev+current+', '
        } else {
          return prev+current
        }
      },"")
      element[questionTitle] = options;
      break;
    case "rating":
      element[questionTitle] = submissionElement.rating;
      break;
    case "open":
      element[questionTitle] = submissionElement.text;
      break;
    case "ranking":
      element[questionTitle] = submissionElement.ranking;
      break;
    case "list":
      element[questionTitle] = submissionElement.list;
      break;
    case "line":
      element[questionTitle] = submissionElement.text;
      break;
    case "paragraph":
      element[questionTitle] = submissionElement.text;
      break;
    case "number":
      element[questionTitle] = submissionElement.number;
      break;
    case "date":
      element[questionTitle] = submissionElement.date;
      break;
    case "email":
      element[questionTitle] = submissionElement.email;
      break;
    case "phone":
      element[questionTitle] = submissionElement.phone;
      break;
  }
  return element
}

module.exports = submissionCleaner;