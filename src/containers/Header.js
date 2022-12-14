import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentProjectId } from '../actions';
import { getProjects } from '../reducers';

class Header extends Component {
    onCurrentProjectChange = e => {
        this.props.setCurrentProjectId(Number(e.target.value));
    };

    render() {
        console.log('rendering Header');

        const projectOptions = this.props.projects.map(project => 
          <option key={project.id} value={project.id}>
            {project.name}
          </option>,  
        );

        return (
            <div className='project-item'>
                <div>&nbsp;&nbsp;Project:&nbsp;&nbsp;
                    <select onChange={this.onCurrentProjectChange} className="project-menu">
                        {projectOptions}
                    </select>
                </div>
                <p/><p/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        // Projects were pushed to this component from App but now that it is a 'connected'
        // component we are getting directly out of the store using a selector.
        projects: getProjects(state),
    };
}

//export default Header;
export default connect(mapStateToProps, { setCurrentProjectId })(Header);