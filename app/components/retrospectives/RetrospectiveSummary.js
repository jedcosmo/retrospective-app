import React from 'react';
import RetrospectiveSummaryStore from '../../stores/RetrospectiveSummaryStore';
import RetrospectiveSummaryActions from '../../actions/RetrospectiveSummaryActions';
import {Link} from 'react-router';
import Moment from 'moment';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';
import classNames from 'classnames';


var _ = require('underscore');

class RetrospectiveSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = RetrospectiveSummaryStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        RetrospectiveSummaryStore.listen(this.onChange);
        RetrospectiveSummaryActions.getRetrospective(this.props.params.roomcode);

        let socket = io.connect();

        socket.on('retrospectiveStageUpdate', (retrospectiveId) => {
            // Fetch new retrospective data when retrospective socket event received
            RetrospectiveSummaryActions.getRetrospective(retrospectiveId);
        });
    }

    componentWillUnmount() {
        RetrospectiveSummaryStore.unlisten(this.onChange);
    }

    componentDidUpdate(prevProps) {
        // Fetch new retrospective data when URL path changes
        if (prevProps.params.roomcode !== this.props.params.roomcode) {
            RetrospectiveSummaryActions.getRetrospective(this.props.params.roomcode);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    handleShowAll(e){
        e.preventDefault();
        let anchor = e.currentTarget;
        let $anchorShowAll = $(anchor).parent().prev().prev().prev().parents();
        console.log($anchorShowAll);
        $anchorShowAll.find('.toggle_show_all').toggle(function(){
            if(!$(this).is(':hidden')) {
                $(anchor).html('Hide showed items...');
            } else {
                $(anchor).html('Show all...');
            }
        });
    }

    showAttendeesNamesFirstCol( users ){
        let attendees_element = _.map(users, (user, index) => {
            if (index <= 4) {
                return (
                    <div>{ user }</div>
                );
            }

        });

        return attendees_element;
    }

    showAttendeesNamesSecondCol( users ){
        let attendees_element = _.map(users, (user, index) => {
            if (index > 4) {
                return (
                    <div>{ user }</div>
                );
            }
        });

        return attendees_element;
    }

    showThoughts( thoughts ){
        let ctr_hide = 0;
        let toggle_showall = '';
        let min = 1;
        let max = 10;
        let pointer_cursor = null;
        
        thoughts = _.sortBy(thoughts, function(o) { return -o.votes.length; });

        let thoughtsLists = _.map(thoughts, (thought, index) => {
            ctr_hide++;

            if(ctr_hide > 5){
                toggle_showall = 'toggle_show_all';
            }else{
                toggle_showall = '';
            }

            var hide = true;

            let groups = _.map(thought.groups, (thought) => {

                hide = false;

              return(
                <p>
                  {thought.text.replace(/(<([^>]+)>)/ig,"")}
                </p>
              );
            });
                        
            if(groups.length > 0){
              pointer_cursor = 'cursor';
            }else{
              pointer_cursor = '';
            }
            
            return(
                <div className={ toggle_showall }>
                    <div className="col-md-4">
                        <div className="col-no-votes-list col-no-votes-list-number">{ thought.votes.length }</div>
                    </div>
                    <div className={ "col-md-8 thought-groups " + pointer_cursor }>
                        <div className="col-no-votes-list">
                          <p data-toggle="collapse" data-target={ '#accordion' + index }>
                              <i className={classNames('fa fa-caret-right retro-fa-caret-right', {hide: hide})} aria-hidden="true"></i>{ thought.text.replace(/(<([^>]+)>)/ig,"") }
                          </p>
                            <div id={'accordion' + index} className="collapse">
                                { groups }
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            );
        });

        return thoughtsLists;
    }

    // Print Summary details as PDF
    showPDFSummary(e){
        e.preventDefault();
        window.location = '/pdf/summary/' + this.state._id;
    }

    // Back to home page
    backToHome(e){
        e.preventDefault();
        window.location = '/';
    }

    render() {

        var createdAt = this.state.createdAt;
        var date_created = Moment(createdAt).format('dddd, MMMM Do YYYY');
        var time_created = Moment(createdAt).format('h:mmA z');
        let users = this.state.joinedUsers;
        let thoughts = this.state.thoughts;
        let thoughts_ctr = _.keys(thoughts).length;
        let showall_hide = 'hide';

        if(thoughts_ctr > 5){
            showall_hide = '';
        }

        return(
            <div>
                <div className="navbar-default-summary">
                    <div className="navbar-summary">
                        <div>
                            <span className="retrospective-title">retrospective</span>
                            &nbsp;
                            <span className="application-title">application</span>
                        </div>
                    </div>
                </div>

                <div className="container summary">
                    <div className="row summary-col">
                        <div className="col-md-12">
                            <h2 className='retro-summary'>retrospective summary</h2>
                        </div>
                        <div className="col-md-12">
                            <div className="row">
                                <div className='col-md-4'>
                                    <div className="row-second">
                                        <div className="row">
                                            <div className="col-md-12 col-project-name">
                                                <span className="retro-project-name">{this.state.title}</span>
                                                <span className="retro-sprint-number">Sprint {this.state.sprintNumber}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 col-project-date">
                                                <div className="retro-date-created">{date_created}</div>
                                                <div className="retro-time-created">{time_created}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 col-project-attendees">
                                                <span className="retro-project-attendees">{_.keys( users ).length} { (_.keys( users ).length) > 1 ? "attendees" : "attendee" }</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 col-list-attendees-1">
                                                { this.showAttendeesNamesFirstCol( users ) }
                                            </div>
                                            <div className="col-md-6 col-list-attendees-2">
                                                { this.showAttendeesNamesSecondCol( users ) }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="row">

                                        <div className="col-md-12">
                                            <div className="retro-top-voted-thoughts">top voted thoughts</div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="col-no-votes">No. of Votes</div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="col-no-votes">Thoughts / Groups</div>
                                        </div>
                                        <div className="clearfix"></div>

                                        { this.showThoughts( thoughts ) }

                                        <div className="col-md-4"></div>
                                        <div className="col-md-8">
                                            <Link onClick={this.handleShowAll.bind(this)} className={ "col-md-12 show_all " + showall_hide } to='#'>Show all...</Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="bottom-button">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="buttons-introduce pull-right">
                                            <button type="submit" className="join-retro-btn" onClick={this.showPDFSummary.bind(this)}>download pdf</button>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="buttons-retro pull-left">
                                            <button type="submit" className="save-close-retro" onClick={this.backToHome.bind(this)}>back home</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

export default RetrospectiveSummary;
