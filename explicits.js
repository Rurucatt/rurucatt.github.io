define(['questAPI'], function(Quest){
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;
	
    /**
	* Page prototype
	*/
    API.addPagesSet('basicPage',{
        noSubmit:false, //Change to true if you don't want to show the submit button.
		header: 'Questionnaire',
        decline: true,
        declineText: isTouch ? 'Decline' : 'Decline to Answer', 
        autoFocus:true, 
        //progressBar:  'Page <%= pagesMeta.number %> out of 2'
    });
	
    /**
	* Question prototypes
	*/
    API.addQuestionsSet('basicQ',{
        decline: 'true',
        required : true, 		
        errorMsg: {
            required: isTouch 
                ? 'Please select an answer, or click \'Decline\'' 
                : 'Please select an answer, or click \'Decline to Answer\''
        },
        autoSubmit:'true',
        numericValues:'true',
        help: '<%= pagesMeta.number < 3 %>',
        //helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.'
    });

    API.addQuestionsSet('basicSelect',{
        inherit :'basicQ',
        type: 'selectOne'
    });
	
    API.addQuestionsSet('basicDropdown',{
        inherit :'basicQ',
        type : 'dropdown',
        autoSubmit:false
    });

	API.addQuestionsSet('basicText',{
        inherit :'basicQ',
        type : 'text',
        autoSubmit:false
    });
	
   //API.addQuestionsSet('therm',{
	 API.addQuestionsSet('mmLikert7',{
        inherit: 'basicSelect',
        answers: [
            {text:'Strongly disagree', value:1},
            {text:'Disagree', value:2},
            {text:'Slightly disagree', value:3},
            {text:'Neither agree nor disagree', value:4},
            {text:'Slightly agree', value:5},
            {text:'Agree', value:6},
            {text:'Strongly agree', value:7}
        ]
    });

	
    /**
	*Specific questions
	*/	

	API.addQuestionsSet('age',{
        inherit : 'basicText',
        name: 'age',
        stem: 'What is your age?'
    });

    API.addQuestionsSet('gender',{
        inherit : 'basicDropdown',
        name: 'gender',
        stem: 'Gender',
        answers: [
            {text:'Female', value:'F'},
            {text:'Male', value:'M'},
            {text:'Non-binary', value:'NB'},
            {text:'Prefer not to say', value:'NA'}
        ]
    });

    API.addQuestionsSet('major',{
        inherit : 'basicText',
        name: 'major',
        stem: 'What is your major?'
    });

	//let thermOrder = API.shuffle(['thermBlack', 'thermWhite']);

	API.addQuestionsSet('mm18',{
        inherit: 'mmLikert7',
        name: 'mm18_work_ethic',
        stem: '1. Asian Americans generally perform better on standardized exams (i.e., SAT) because of their values in academic achievement.'
    });

    API.addQuestionsSet('mm13',{
        inherit: 'mmLikert7',
        name: 'mm13_harder_workers',
        stem: '2. Asian Americans are less likely to face barriers at work.'
    });

    API.addQuestionsSet('mm16',{
        inherit: 'mmLikert7',
        name: 'mm16_success_despite_racism',
        stem: '3. Asian Americans make more money because they work harder.'
    });

    API.addQuestionsSet('mm17',{
        inherit: 'mmLikert7',
        name: 'mm17_motivated_success',
        stem: '4. Asian Americans are more likely to persist through tough situations.'
    });

    API.addQuestionsSet('mm29',{
        inherit: 'mmLikert7',
        name: 'mm29_higher_gpa',
        stem: '5. Asian Americans are more likely to be treated as equal to European Americans.'
    });

    API.addQuestionsSet('mm9',{
        inherit: 'mmLikert7',
        name: 'mm9_better_grades',
        stem: '6. Asian Americans are more likely to be good at math and science.'
    });

    API.addQuestionsSet('mm3',{
        inherit: 'mmLikert7',
        name: 'mm3_standardized_exams',
        stem: '7. Asian Americans get better grades in school because they study harder.'
    });

    API.addQuestionsSet('mm5',{
        inherit: 'mmLikert7',
        name: 'mm5_more_money',
        stem: '8. Asian Americans are less likely to experience racism in the United States.'
    });

    API.addQuestionsSet('mm8',{
        inherit: 'mmLikert7',
        name: 'mm8_math_science',
        stem: '9. Asian Americans are harder workers.'
    });

    API.addQuestionsSet('mm7',{
        inherit: 'mmLikert7',
        name: 'mm7_persist_tough',
        stem: '10. Despite experiences with racism, Asian Americans are more likely to achieve academic and economic success.'
    });

    API.addQuestionsSet('mm20',{
        inherit: 'mmLikert7',
        name: 'mm20_less_work_barriers',
        stem: '11. Asian Americans are more motivated to be successful.'
    });

    API.addQuestionsSet('mm32',{
        inherit: 'mmLikert7',
        name: 'mm32_less_prejudice',
        stem: '12. Asian Americans have stronger work ethics.'
    });

    API.addQuestionsSet('mm10',{
        inherit: 'mmLikert7',
        name: 'mm10_less_racism',
        stem: '13. It is easier for Asian Americans to climb the corporate ladder.'
    });

    API.addQuestionsSet('mm11',{
        inherit: 'mmLikert7',
        name: 'mm11_treated_as_equals',
        stem: '14. Asian Americans generally have higher grade point averages in school because academic success is more important.'
    });

    API.addQuestionsSet('mm23',{
        inherit: 'mmLikert7',
        name: 'mm23_easier_ladder',
        stem: '15. Asian Americans are less likely to encounter racial prejudice and discrimination.'
    });


	
    API.addSequence([
        {
            inherit:'basicPage',
            questions: [
                {inherit:'age'},
                {inherit:'gender'},
                {inherit:'major'}
            ]
        },
        {
            inherit:'basicPage',
			questions: [
                {inherit:'mm18'},
                {inherit:'mm13'},
                {inherit:'mm16'},
                {inherit:'mm17'},
                {inherit:'mm29'},
                {inherit:'mm9'},
                {inherit:'mm3'},
                {inherit:'mm5'},
                {inherit:'mm8'},
                {inherit:'mm7'},
                {inherit:'mm20'},
                {inherit:'mm32'},
                {inherit:'mm10'},
                {inherit:'mm11'},
                {inherit:'mm23'}
            ]
        }
    ]);

    return API.script;
});
