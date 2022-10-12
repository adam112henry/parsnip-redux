import React, { Component } from 'react';

class Header extends Component {
    render() {
        const projectOptions = this.props.projects.map(project => 
          <option key={project.id} value={project.id}>
            {project.name}
          </option>,  
        );

        return (
            <div className='project-item'>
                <div>&nbsp;&nbsp;Project:&nbsp;&nbsp;
                    <select onChange={this.props.onCurrentProjectChange} className="project-menu">
                        {projectOptions}
                    </select>
                </div>
                <p/><p/>
            </div>
        );
    }
}

export default Header;