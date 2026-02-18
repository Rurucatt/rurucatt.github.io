API.addQuestionsSet('demographics',[
  {
    type: 'text',
    name: 'age',
    stem: 'What is your age?'
  },
  {
    type: 'dropdown',
    name: 'gender',
    stem: 'Gender',
    answers: [
      {text:'Female', value:'F'},
      {text:'Male', value:'M'},
      {text:'Non-binary', value:'NB'},
      {text:'Prefer not to say', value:'NA'}
    ]
  },
  {
    type: 'text',
    name: 'major',
    stem: 'What is your major?'
  }
]);

// ✅ 关键：把 questions set 包装成“任务”，让 sequencer 能 inherit
API.addTasksSet('demographics', [
  {
    type: 'quest',
    name: 'demographics',
    questions: 'demographics'
  }
]);
