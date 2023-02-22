const Branch =  require('../models/branch');


module.exports.getSubtemplate = async(req, res)=>{
    const branch = await Branch.findById(req.params.id)
    const template = req.params.subtemplate
    
    res.render(`partials/${branch.name}/${template}`, {branch})
}

module.exports.index = async (req, res)=>{
    const branches = await Branch.find();
    ///console.log(branches)
  
    res.render('branches/index', {branches})
}

module.exports.indexTests = async (req, res)=>{
    const branches = await Branch.find()
    .populate({
        path: 'tests'
    });
    res.render('branches/branchIndexTests', {branches})
}

module.exports.createForm = (req, res)=>{                  /// musi znaleźć się przed  app.get '/branches/:id' że aby nie traktowało 'new' jako :id
    res.render('branches/new')
}

module.exports.create = async(req,res)=>{
    let branch = new Branch(req.body.branch);
   // console.dir(req.body)
    //console.log(branch)
    await branch.save();
    req.flash('success', 'Stworzono nowy dział!');
    res.redirect(`/branches/${branch._id}`)
}

module.exports.show = async (req, res)=>{
    const id =  req.params.id;
    var page
    if(req.params.page){
        page = req.params.page
    }
    else{
        page = 1
    }
    
    
    const branch = await Branch.findById( req.params.id).
    populate({
        path: 'exercises',
        populate: {
            path: 'solution',
            path: 'image',
            populate:{
                path: 'name'
            }
        }
    });

    if(!branch){
        req.flash('error', `Nie można znaleźć tego działu!`);
        res.send(404).res.redirect('/branches')
    }
    var start = (page-1)*5;
    var end = start+5-1;
    if(end> branch.exercises.length){
        end = branch.exercises.length
    }
    res.render('branches/show', {branch, start, end, currentPage: page})
    //console.log(req.params.id)
}

module.exports.update = async(req, res)=>{
    const branch =  await Branch.findByIdAndUpdate(req.params.id, {...req.body.branch})
    await branch.save()
    req.flash('success', 'Edytowano dział!');
    res.redirect(`/branches/${branch._id}`)
}

module.exports.delete= async(req, res)=>{
    await Branch.findByIdAndDelete(req.params.id);
    req.flash('success', 'Usunięto dział!');
    res.redirect('/branches');
}



module.exports.updateForm = async(req, res)=>{
    let branch =  await Branch.findById(req.params.id);
    if(branch===null){
        req.flash('error', `Nie można znaleźć tego działu!`);
        res.redirect('/branches')
    }
    res.render('branches/edit', {branch})
}



module.exports.simpleFunc = (name, surname)=>{
    return `Hi, I am ${name} ${surname}`
}