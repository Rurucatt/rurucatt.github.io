define(['questAPI'], function(Quest){
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;

        /*
     * Quest's selectOne control is styled as a Bootstrap toggle button, which
     * normally allows a second click to clear it.  These page-specific DOM
     * enhancements restore native radio behaviour and place the three Other
     * text questions inside their owning options without changing their Quest
     * models (and therefore without changing the explicit-data output).
     */
    function installDemographicsEnhancements(){
        if (typeof document === 'undefined' || document.getElementById('demographics-enhancement-styles')) return;

        let style = document.createElement('style');
        style.id = 'demographics-enhancement-styles';
        style.textContent = [
            '.demographics-inline-other {display:flex; flex-wrap:wrap; align-items:center; gap:8px; max-width:100%;}',
            '.demographics-inline-other input {display:inline-block; flex:1 1 220px; min-width:140px; max-width:360px; width:auto;}',
            '.demographics-inline-other .demographics-validation-error {flex-basis:100%;}',
            '.demographics-validation-error {display:block; margin:5px 0 0; color:#a94442; font-weight:normal;}',
            '.demographics-hidden-question {display:none !important;}',
            '@media (max-width:480px) {',
            ' .demographics-inline-other {align-items:flex-start;}',
            ' .demographics-inline-other input {flex-basis:100%; max-width:100%;}',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        function questionItems(page){
            let list = page.querySelector('ol');
            return list ? Array.prototype.filter.call(list.children, function(item){
                return item.tagName.toLowerCase() === 'li';
            }) : [];
        }

        function selected(input, option){
       //     return !!((input && input.checked) || option.classList.contains('active'));
		      return option.dataset.demographicsSelected === 'true' ||
                !!((input && input.checked) || option.classList.contains('active') || option.getAttribute('aria-pressed') === 'true');	
        }

        function addError(target, message){
            let error = target.querySelector('.demographics-validation-error');
            if (!error){
                error = document.createElement('span');
                error.className = 'demographics-validation-error';
                error.setAttribute('role', 'alert');
                target.appendChild(error);
            }
            error.textContent = message;
        }

        function clearError(target){
            Array.prototype.forEach.call(target.querySelectorAll('.demographics-validation-error'), function(error){
                error.parentNode.removeChild(error);
            });
        }

        function inlineOther(items, ownerIndex, textIndex, message){
            let owner = items[ownerIndex];
            let textQuestion = items[textIndex];
            if (!owner || !textQuestion || owner.dataset.inlineOtherReady) return;

            let options = owner.querySelectorAll('label.btn, .btn-group label, .btn-group-vertical label');
            let option = options[options.length - 1];
            let textInput = textQuestion.querySelector('input:not([type="hidden"]), textarea');
            if (!option || !textInput) return;

            owner.dataset.inlineOtherReady = 'true';
            textQuestion.classList.add('demographics-hidden-question');
            textQuestion.setAttribute('aria-hidden', 'true');

            let wrapper = document.createElement('span');
            wrapper.className = 'demographics-inline-other';
            option.appendChild(document.createTextNode(': '));
            option.appendChild(wrapper);
            wrapper.appendChild(textInput);
            textInput.setAttribute('aria-label', message.replace(/^Please enter |\.$/g, ''));

            let choice = option.querySelector('input[type="radio"], input[type="checkbox"]');
            function updateAvailability(){
                let active = selected(choice, option);
                textInput.disabled = !active;
                if (!active) clearError(wrapper);
            }
            option.addEventListener('click', function(){ setTimeout(updateAvailability, 0); });
            textInput.addEventListener('click', function(event){ event.stopPropagation(); });
            textInput.addEventListener('input', function(){
                if (textInput.value.trim()) clearError(wrapper);
            });
            updateAvailability();

            //owner.inlineOther = {option: option, choice: choice, input: textInput, wrapper: wrapper, message: message};
        	owner.inlineOther = {
                option: option,
                choice: choice,
                input: textInput,
                wrapper: wrapper,
                message: message,
                updateAvailability: updateAvailability
            };
		}

        function enhance(page){
            if (page.dataset.demographicsReady) return;
            let heading = page.querySelector('h3');
            if (!heading || heading.textContent.trim() !== 'Demographics and Screening Form') return;
            let items = questionItems(page);
            if (items.length < 15) return;

            page.dataset.demographicsReady = 'true';
            inlineOther(items, 3, 4, 'Please enter the state in which you study.');
            inlineOther(items, 8, 9, 'Please enter your gender identity.');
            inlineOther(items, 10, 11, 'Please enter your race.');

            Array.prototype.forEach.call(page.querySelectorAll('label.btn, .btn-group label, .btn-group-vertical label'), function(option){
                let input = option.querySelector('input[type="radio"], input[type="checkbox"]');
                option.dataset.demographicsSelected = selected(input, option) ? 'true' : 'false';
            });
			
			page.addEventListener('click', function(event){
                let option = event.target.closest('label.btn, .btn-group label, .btn-group-vertical label');
                if (!option || !page.contains(option)) return;
                if (event.target.closest('.demographics-inline-other')) return;

				let item = option.closest('li');
                let isRace = item === items[10];
				
                let radio = option.querySelector('input[type="radio"]');
                if (!isRace && selected(radio, option)){
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    //let item = option.closest('li');
                    if (isRace){
                        option.dataset.demographicsSelected = selected(option.querySelector('input[type="checkbox"]'), option) ? 'false' : 'true';
                    } else {
                        Array.prototype.forEach.call(item.querySelectorAll('label.btn, .btn-group label, .btn-group-vertical label'), function(sibling){
                            sibling.dataset.demographicsSelected = sibling === option ? 'true' : 'false';
                        });
                    }
                    if (item && item.inlineOther) item.inlineOther.updateAvailability();
					if (item) clearError(item);
                }
            }, true);

            let regularIndexes = [0, 1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14];
            Array.prototype.forEach.call(page.querySelectorAll('input, textarea, select'), function(input){
                let eventName = input.type === 'text' || input.type === 'number' || input.type === 'date' ? 'input' : 'change';
                input.addEventListener(eventName, function(){
                    let item = input.closest('li');
                    if (item) clearError(item);
                });
            });

            let submit = page.querySelector('[ng-click="submit()"]');
            if (!submit) return;
            submit.addEventListener('click', function(event){
                let firstInvalid = null;

                regularIndexes.forEach(function(index){
                    let item = items[index];
                    let controls = item.querySelectorAll('input:not([type="hidden"]), textarea, select');
                    let choices = Array.prototype.filter.call(controls, function(control){
                        return control.type === 'radio' || control.type === 'checkbox';
                    });
                    let hasChoiceControls = choices.length || item.querySelector('.btn-group, .btn-group-vertical');
                    let answered = hasChoiceControls ? !!item.querySelector('[data-demographics-selected="true"], label.active, button.active, .btn.active, [aria-pressed="true"]') ||
                        Array.prototype.some.call(choices, function(control){ return control.checked; }) : Array.prototype.some.call(controls, function(control){
                        return control.value.trim() !== '';
                    });
                    if (index === 6 && answered){
                        let age = Array.prototype.find.call(controls, function(control){ return control.type !== 'hidden'; });
                        answered = !!age && /^\d+$/.test(age.value.trim()) && Number(age.value) >= 1 && Number(age.value) <= 120;
                    }
                    if (!answered){
                        addError(item, 'Please answer this question before submitting.');
                        if (!firstInvalid) firstInvalid = item;
                    }
                });

                [3, 8, 10].forEach(function(index){
                    let other = items[index].inlineOther;
                    if (other && selected(other.choice, other.option) && !other.input.value.trim()){
                        addError(other.wrapper, other.message);
                        if (!firstInvalid) firstInvalid = other.option;
                    }
                });

                if (firstInvalid){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    firstInvalid.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, true);
        }

        let observer = new MutationObserver(function(){
            Array.prototype.forEach.call(document.querySelectorAll('[piq-page]'), enhance);
        });
        observer.observe(document.body, {childList: true, subtree: true});
        Array.prototype.forEach.call(document.querySelectorAll('[piq-page]'), enhance);
    }

    installDemographicsEnhancements();
	
    /**
	* Page prototype
	*/
    API.addPagesSet('basicPage',{
        noSubmit:false, //Change to true if you don't want to show the submit button.
		header: 'Questionnaire',
		decline: false,
        //decline: true,
        //declineText: isTouch ? 'Decline' : 'Decline to Answer', 
        //autoFocus:true, 
        //progressBar:  'Page <%= pagesMeta.number %> out of 2'
	});
	
    API.addPagesSet('demographicsPage',{
        inherit: 'basicPage',
        header: 'Demographics and Screening Form'
    });
	
	API.addPagesSet('mmPage',{
        inherit: 'basicPage',
        autoFocus: false
    });
	
    /**
	* Question prototypes
	*/
    API.addQuestionsSet('basicQ',{
        //decline: 'true',
        decline: false,
		required : true, 		
        errorMsg: {
    //        required: isTouch 
    //            ? 'Please select an answer, or click \'Decline\'' 
    //            : 'Please select an answer, or click \'Decline to Answer\''
        	required: 'Please answer this question before submitting.'
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
	
	    API.addQuestionsSet('demographicsSelect',{
        inherit: 'basicSelect',
        autoSubmit: false,
        required: false
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

	    API.addQuestionsSet('demographicsText',{
        inherit: 'basicText',
        required: false
    });

    API.addQuestionsSet('basicMultiSelect',{
        inherit: 'basicQ',
        type: 'selectMulti',
        autoSubmit: false,
        errorMsg: {
            required: 'Please select at least one answer before submitting.'
        }
    });

    API.addQuestionsSet('demographicsMultiSelect',{
        inherit: 'basicMultiSelect',
        required: false
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

	let mmInstructionsHtml = [
        '<div style="margin: 0 0 18px; padding: 14px 16px; border: 1px solid #d9d9d9; border-left: 5px solid #222; background: #f7f7f7; border-radius: 4px;">',
        '<div style="font-weight: 700; font-size: 1.05em; margin-bottom: 8px;">Instructions: Indicate the extent to which you agree or disagree with each item. Please be open and honest in your responding.</div>',
        '<div style="font-size: 0.98em; line-height: 1.5;"><strong>In comparison to other racial minorities (e.g., African American, Hispanics, Native Americans)…………………</strong></div>',
        '</div>'
    ].join('');
	
    /**
	*Specific questions
	*/	

	//API.addQuestionsSet('age',{
    //    inherit : 'basicText',
       API.addQuestionsSet('educationStudent',{
        inherit: 'demographicsSelect',
        name: 'education_student',
        stem: 'Are you currently a student studying education?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
    });

    API.addQuestionsSet('studentLevel',{
        inherit: 'demographicsSelect',
        name: 'student_level',
        stem: 'Are you an undergraduate or graduate student?',
        answers: [
            {text: 'Undergraduate', value: 'undergraduate'},
            {text: 'Graduate', value: 'graduate'}
        ]
    });

    API.addQuestionsSet('yearOfStudy',{
        inherit: 'demographicsSelect',
        name: 'year_of_study',
        stem: 'Please select your year of study.',
        answers: [
            {text: 'First Year', value: 'first_year'},
            {text: 'Second Year', value: 'second_year'},
            {text: 'Third Year', value: 'third_year'},
            {text: 'Fourth Year', value: 'fourth_year'},
            {text: 'Fifth Year', value: 'fifth_year'}
        ]
    });

    API.addQuestionsSet('studyState',{
        inherit: 'demographicsSelect',
        name: 'study_state',
        stem: 'Please select the state in which you study.',
        answers: [
            {text: 'Connecticut', value: 'CT'},
            {text: 'Maine', value: 'ME'},
            {text: 'Massachusetts', value: 'MA'},
            {text: 'New Hampshire', value: 'NH'},
            {text: 'New Jersey', value: 'NJ'},
            {text: 'New York', value: 'NY'},
            {text: 'Pennsylvania', value: 'PA'},
            {text: 'Rhode Island', value: 'RI'},
            {text: 'Vermont', value: 'VT'},
            {text: 'I study in a state that is not listed above', value: 'other'}
        ]
    });

    API.addQuestionsSet('studyStateOther',{
        inherit: 'demographicsText',
        name: 'study_state_other',
        required: false,
        stem: 'Please enter the state in which you study.'
    });

    API.addQuestionsSet('dateOfBirth',{
        inherit: 'demographicsText',
        name: 'date_of_birth',
        stem: 'Please enter your date of birth.',
        inputType: 'date'
    });

    API.addQuestionsSet('age',{
        inherit: 'demographicsText',
		name: 'age',
    //    stem: 'What is your age?'
	     stem: 'What is your age? (years)',
        inputType: 'number',
        min: 1,
        max: 120,
        step: 1,
        pattern: '^[0-9]+$',
        errorMsg: {
            required: 'Please enter your age as a whole number.',
            pattern: 'Please enter your age as a whole number.'
        }
    });

     API.addQuestionsSet('sexAssignedAtBirth',{
        inherit: 'demographicsSelect',
        name: 'sex_assigned_at_birth',
        stem: 'What is your sex assigned at birth?',
        answers: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
            {text: 'Intersex', value: 'intersex'}
        ]
    });

         API.addQuestionsSet('genderIdentity',{
        inherit: 'demographicsSelect',
        name: 'gender_identity',
        stem: 'What is your gender?',
        answers: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
            {text: 'Trans-male', value: 'trans_male'},
            {text: 'Trans-female', value: 'trans_female'},
            {text: 'Non-binary', value: 'non_binary'},
            {text: 'Gender Identity not listed', value: 'other'}
        ]
    });

    API.addQuestionsSet('genderIdentityOther',{
        inherit: 'demographicsText',
        name: 'gender_identity_other',
        required: false,
        stem: 'Please enter your gender identity.'
    });

    API.addQuestionsSet('race',{
        inherit: 'demographicsMultiSelect',
        name: 'race',
        stem: 'Please select your race. You may select more than one option.',
        answers: [
            {text: 'American Indian or Alaska Native', value: 'american_indian_alaska_native'},
            {text: 'Asian', value: 'asian'},
            {text: 'Black or African American', value: 'black_african_american'},
            {text: 'Native Hawaiian or Other Pacific Islander', value: 'native_hawaiian_pacific_islander'},
            {text: 'White', value: 'white'},
            {text: 'Other', value: 'other'}
        ]
    });

    API.addQuestionsSet('raceOther',{
        inherit: 'demographicsText',
        name: 'race_other',
        required: false,
        stem: 'Please enter your race.'
    });

    API.addQuestionsSet('ethnicity',{
        inherit: 'demographicsSelect',
        name: 'ethnicity',
        stem: 'Please select your ethnicity.',
        answers: [
            {text: 'Hispanic/Latinx', value: 'hispanic_latinx'},
            {text: 'Non-Hispanic/Latinx', value: 'non_hispanic_latinx'}
        ]
    });

    API.addQuestionsSet('englishComprehension',{
        inherit: 'demographicsSelect',
        name: 'english_comprehension',
        stem: 'Are you able to read and understand English?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
    });

    API.addQuestionsSet('keyboardDevice',{
        inherit: 'demographicsSelect',
        name: 'keyboard_device',
        stem: 'Are you able to complete this study on a personal device with a keyboard?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
	}); 

	//let thermOrder = API.shuffle(['thermBlack', 'thermWhite']);

	API.addQuestionsSet('mm18',{
        inherit: 'mmLikert7',
        name: 'mm18_work_ethic',
        stem: mmInstructionsHtml + '1. Asian Americans generally perform better on standardized exams (i.e., SAT) because of their values in academic achievement.'
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
            inherit:'demographicsPage',
            questions: [
                //{inherit:'age'},
                //{inherit:'gender'},
                //{inherit:'major'}
				{inherit: 'educationStudent'},
                {inherit: 'studentLevel'},
                {inherit: 'yearOfStudy'},
                {inherit: 'studyState'},
                {inherit: 'studyStateOther'},
                {inherit: 'dateOfBirth'},
                {inherit: 'age'},
                {inherit: 'sexAssignedAtBirth'},
                {inherit: 'genderIdentity'},
                {inherit: 'genderIdentityOther'},
                {inherit: 'race'},
                {inherit: 'raceOther'},
                {inherit: 'ethnicity'},
                {inherit: 'englishComprehension'},
                {inherit: 'keyboardDevice'}
            ]
        },
        {
			inherit:'mmPage',
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
