import React from 'react'
import Comment from './Comment'

class Comments extends React.Component {

  static propTypes = {
    comments: React.PropTypes.array,
    likeComment: React.PropTypes.func
  }

  render () {
    return (
      <ul className='comments'>
        {this.props.comments.map((comment, i) => {
          return (
            <li key={i}>
              <Comment index={i} likeComment={this.props.likeComment} {...comment}/>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default Comments
