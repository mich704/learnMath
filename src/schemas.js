const BaseJoi = require('joi');
const SanitizeHtml = require('sanitize-html');

const extension = (joi) =>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} nie może zawierać tagów HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = SanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean!==value) return helpers.error('string.escapeHTML', {value})
                return clean; 
            }
        }
    }
})

const customJoi = BaseJoi.extend(extension)

module.exports.branchSchema = customJoi.object({
    branch: customJoi.object({
        name: customJoi.string().required().escapeHTML(),
        description: customJoi.string().required().escapeHTML()
    }).required()
})

module.exports.exerciseSchema = customJoi.object({
    exercise: customJoi.object({
        difficulty: customJoi.number().required().min(0).max(5),
        description: customJoi.string().required().escapeHTML(),
        answers: customJoi.array().required(),
        solution: customJoi.string().required().escapeHTML(),
        image: customJoi.any()
    }).required()
})


