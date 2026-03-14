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
        progressBar:  'Page <%= pagesMeta.number %> out of 4'
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
            {text:'1 - Strongly disagree', value:1},
            //{text:'2 - Disagree', value:2},
            //{text:'3 - Somewhat disagree', value:3},
            //{text:'4 - Neither agree nor disagree', value:4},
            //{text:'5 - Somewhat agree', value:5},
            //{text:'6 - Agree', value:6},、
			{text:'2', value:2},
            {text:'3', value:3},
            {text:'4', value:4},
            {text:'5', value:5},
            {text:'6', value:6},
            {text:'7 - Strongly agree', value:7}
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
        stem: 'Asian Americans have stronger work ethics.'
    });

    API.addQuestionsSet('mm13',{
        inherit: 'mmLikert7',
        name: 'mm13_harder_workers',
        stem: 'Asian Americans are harder workers.'
    });

    API.addQuestionsSet('mm16',{
        inherit: 'mmLikert7',
        name: 'mm16_success_despite_racism',
        stem: 'Despite experiences with racism, Asian Americans are more likely to achieve academic and economic success.'
    });

    API.addQuestionsSet('mm17',{
        inherit: 'mmLikert7',
        name: 'mm17_motivated_success',
        stem: 'Asian Americans are more motivated to be successful.'
    });

    API.addQuestionsSet('mm29',{
        inherit: 'mmLikert7',
        name: 'mm29_higher_gpa',
        stem: 'Asian Americans generally have higher grade point averages in school because academic success is more important.'
    });

    API.addQuestionsSet('mm9',{
        inherit: 'mmLikert7',
        name: 'mm9_better_grades',
        stem: 'Asian Americans get better grades in school because they study harder.'
    });

    API.addQuestionsSet('mm3',{
        inherit: 'mmLikert7',
        name: 'mm3_standardized_exams',
        stem: 'Asian Americans generally perform better on standardized exams (i.e., SAT) because of their values in academic achievement.'
    });

    API.addQuestionsSet('mm5',{
        inherit: 'mmLikert7',
        name: 'mm5_more_money',
        stem: 'Asian Americans make more money because they work harder.'
    });

    API.addQuestionsSet('mm8',{
        inherit: 'mmLikert7',
        name: 'mm8_math_science',
        stem: 'Asian Americans are more likely to be good at math and science.'
    });

    API.addQuestionsSet('mm7',{
        inherit: 'mmLikert7',
        name: 'mm7_persist_tough',
        stem: 'Asian Americans are more likely to persist through tough situations.'
    });

    API.addQuestionsSet('mm20',{
        inherit: 'mmLikert7',
        name: 'mm20_less_work_barriers',
        stem: 'Asian Americans are less likely to face barriers at work.'
    });

    API.addQuestionsSet('mm32',{
        inherit: 'mmLikert7',
        name: 'mm32_less_prejudice',
        stem: 'Asian Americans are less likely to encounter racial prejudice and discrimination.'
    });

    API.addQuestionsSet('mm10',{
        inherit: 'mmLikert7',
        name: 'mm10_less_racism',
        stem: 'Asian Americans are less likely to experience racism in the United States.'
    });

    API.addQuestionsSet('mm11',{
        inherit: 'mmLikert7',
        name: 'mm11_treated_as_equals',
        stem: 'Asian Americans are more likely to be treated as equals to European Americans.'
    });

    API.addQuestionsSet('mm23',{
        inherit: 'mmLikert7',
        name: 'mm23_easier_ladder',
        stem: 'It is easier for Asian Americans to climb the corporate ladder.'
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
            //questions: {inherit: thermOrder[0]}
			questions: [
                {inherit:'mm18'},
                {inherit:'mm13'},
                {inherit:'mm16'},
                {inherit:'mm17'},
                {inherit:'mm29'}
            ]
        },
        {
            inherit:'basicPage',
            //questions: {inherit: thermOrder[1]}
			questions: [
                {inherit:'mm9'},
                {inherit:'mm3'},
                {inherit:'mm5'},
                {inherit:'mm8'},
                {inherit:'mm7'}
            ]
        },
        {
            inherit:'basicPage',
            //questions: {inherit:'attributes7'}
			questions: [
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
