/*
 * @developer: jerome.dymosco@domandtom.com
 * @date: April 2017
 * 
 * Module for Retrospective Summary data.
 * 
 * @TODO: Possibly improve the rendering of PDF data.
 */
var Retrospective = require('../models/retrospective');
var _ = require('underscore');
var Moment = require('moment');

module.exports = {
    
    setupRetroPdf: function(app) {        
        app.get("/pdf/summary/:id", function(req, res){    
            var id = req.params.id;     
            
            Retrospective.findOne({ _id: id }, function(err, retrospective) {
                if (err) return next(err);

                if (!retrospective) {
                  return res.status(404).send({ message: 'Retrospective not found.' });
                }
                
                var pdf = require('pdfkit');
                var bs  = require('blob-stream');    
                var doc = new pdf({ bufferPages: true });
                var stream = doc.pipe( bs() );            
                var filename = '';                 
                var createdAt = retrospective.createdAt;
                var date_created = Moment(createdAt).format('dddd, MMMM Do YYYY');
                var time_created = Moment(createdAt).format('h:mmA z');                
                var thoughts = retrospective.thoughts;
                var members = retrospective.joinedUsers;
                var member_y_spacer = 375;
                var member_x_spacer = 125;
                var member_ctr = 1;
                var member_font_size = 8;
                var thought_y_spacer = 270;                                
                var thought_ctr = 1;
                var thought_child_ctr = 1;
                var admin_check_ctr = 1;
                var sprint_txt_spacer = null;
                var sprint_txt_add = 0;
                var sprint_txt_fontsize = 0;

                thoughts = _.sortBy(thoughts, function(o) { return -o.votes.length; });

                filename = 'RetroSummary-' + retrospective.title + '.pdf';
                res.setHeader('Content-disposition', 'attachment; filename="' + filename +'"');
                res.setHeader('Content-type', 'application/pdf');
                
                //register font types to use.
                doc.registerFont('OpenSans-Regular', './public/fonts/assets/OpenSans-Regular.ttf');
                doc.registerFont('OpenSans-Italic', './public/fonts/assets/OpenSans-Italic.ttf');
                doc.registerFont('OpenSans-Bold', './public/fonts/assets/OpenSans-Bold.ttf');
                
                //add first PDF header title.
                doc.font('OpenSans-Regular').fillColor('black').text('RETROSPECTIVE SUMMARY', {paragraphGap: 20, indent: 0, align: 'center', columns: 1});                  
                
                //let's create a filled color reactangle shapes.
                doc.rect(45, 110, 260, 75).fill('#F2F2F2'); //first filled rectangle.
                doc.rect(310, 110, 260, 75).fill('#F2F2F2'); //second filled rectangle.
                
                //first rectangle block content retrospective title, sprint number, date and time.                
                //let's add dynamic spacer and font-size conditions for specific length of restrospective title.
                //so it will be aligned properly with the size of filled reactangle.
                if(retrospective.title.length >= 24) {
                  sprint_txt_spacer = 190;
                  
                  if(retrospective.title.length > 24) {
                    sprint_txt_add = 10;
                  }
                  
                  sprint_txt_fontsize = 8;
                }else {
                  if(retrospective.title.length < 18) {
                    sprint_txt_spacer = 85 + (retrospective.title.length * 7);
                  }else {
                    sprint_txt_spacer = 85 + (retrospective.title.length * 5.5);
                  }
                                    
                  sprint_txt_fontsize = 11;
                }//end of dynamic spacer and font-size.                
                
                doc.font('OpenSans-Bold').fillColor('black').fontSize(sprint_txt_fontsize).text(retrospective.title, 85, 125, {continued: 'yes', width: 120}).font('OpenSans-Regular').fillColor('black').fontSize(11).text(' // Sprint ' + retrospective.sprintNumber, sprint_txt_spacer, 125);
                doc.fontSize(9).fillColor('black').text(date_created, 85, (140 + sprint_txt_add));                                
                doc.fontSize(9).fillColor('black').text(time_created, 85, (152 + sprint_txt_add));
                
                //second rectangle block content number of attendees and listing of attendees name.
                doc.font('OpenSans-Italic').fillColor('black').text('Attendees', 325, 125);
                doc.font('OpenSans-Bold').fontSize(14).fillColor('black').text(members.length, 336, 145);
                
                //let's do the listing of attendees...                
                if(members.length >= 13){
                  member_font_size = 6;
                  member_x_spacer = 110;
                }//this will make sure the members listing will fit perfectly inside the filled rectangle.
                
                _.map(members, (member) => {                  
                  //give enough space for the horizontal lists display of usernames.
                  if(member_ctr > 1) {
                    member_y_spacer = member_y_spacer + 65;
                  }                  
                  //give enough space for the vertical lists display of usernames.
                  //reset again in default values of variables.
                  if(member_ctr == 4 && member_y_spacer != 375) {
                    member_ctr = 1;
                    member_y_spacer = 375;
                    member_x_spacer = member_x_spacer + 12;
                  }
                  
                  //make sure that the first username always the admin.
                  if(admin_check_ctr == 1){
                    doc.font('OpenSans-Bold').fontSize(6).fillColor('#F55757').text('A', member_y_spacer + ( (member.length <= 4) ? (member.length * 8) : ((member.length > 11) ? 55 : (member.length * 5)) ), member_x_spacer + 2);
                  }
                  
                  doc.font('OpenSans-Regular').fontSize(member_font_size).fillColor('black').text(member, member_y_spacer, member_x_spacer, {width: 60});
                  
                  member_ctr++;
                  admin_check_ctr++;
                });//end of members.
                
                //add second PDF header title for top voted thoughts listing.
                doc.fontSize(12).font('OpenSans-Regular').fillColor('black').text('TOP VOTED THOUGHTS', 240, 220);
                                                
                //start of listing thoughts votes and groups.
                _.map(thoughts, (thought, index) => {
                  let thought_groups = thought.groups;
                  
                  if(thought_ctr > 1) {                    
                    thought_y_spacer = thought_y_spacer + 30;                    
                  }
                  
                  //let's move the displaying of thoughts listing column headers.
                  if(thought_ctr == 1 || thought_ctr == 17){
                    //top voted thoughts column headers.                                        
                    if(thought_ctr >= 17) {
                      doc.addPage().moveTo(55, 80).fontSize(10).font('OpenSans-Italic').fillColor('black').text('# of Votes', 55, 80);
                      doc.fontSize(10).font('OpenSans-Italic').fillColor('black').text('Thought / Group', 130, 80);
                    }
                    
                    if(thought_ctr == 1) {
                      doc.fontSize(10).font('OpenSans-Italic').fillColor('black').text('# of Votes', 55, 250);
                      doc.fontSize(10).font('OpenSans-Italic').fillColor('black').text('Thought / Group', 130, 250);
                    }
                  }
                                    
                  //this determines if we'll add new page document for the rest of thoughts listing and reset spacers
                  if(thought_ctr >= 17) { 
                    thought_ctr = 1;
                    thought_y_spacer = 102;
                  }
                  
                  doc.fontSize(10).font('OpenSans-Bold').fillColor('black').text(thought.votes.length, 75, thought_y_spacer);
                                                      
                  if(thought_groups.length > 0) {
                    doc.image('./public/img/arrow_down.png', 110, thought_y_spacer, {scale: 0.5}).fontSize(10).font('OpenSans-Bold').fillColor('black').text(thought.text.replace(/(<([^>]+)>)/ig,""), 130, thought_y_spacer, {width: 550});
                  }else {
                    doc.fontSize(10).font('OpenSans-Bold').fillColor('black').text(thought.text.replace(/(<([^>]+)>)/ig,""), 130, thought_y_spacer, {width: 550});
                  }
                                    
                    //child thoughts...
                    _.map(thought_groups, (thought) => {                                            
                      thought_y_spacer = thought_y_spacer + 20;                      
                      
                      doc.fontSize(9).font('OpenSans-Regular').text(thought.text.replace(/(<([^>]+)>)/ig,""), 150, thought_y_spacer, {width: 500});
                      
                      thought_ctr++;
                    });                                    
                  
                  thought_ctr++;                  
                });//end of thoughts listing.                                  

                var range = doc.bufferedPageRange();                
                for(var i = 0; i < range.count; i++){
                  doc.switchToPage(i);
                  doc.font('OpenSans-Regular').fontSize(6).text( (i + 1) + " of " + range.count, 500, 20);            
                }
                                
                doc.end();
                doc.pipe(res);
            });    
        });
    } 
    
}