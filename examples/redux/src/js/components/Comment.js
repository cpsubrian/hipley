import React from 'react'
import autobind from 'autobind-decorator'

@autobind
class Comment extends React.Component {

  static propTypes = {
    index: React.PropTypes.number,
    name: React.PropTypes.string,
    message: React.PropTypes.string,
    likes: React.PropTypes.number,
    likeComment: React.PropTypes.func
  }

  onLike (e) {
    e.preventDefault()
    this.props.likeComment(this.props.index)
  }

  render () {
    return (
      <div className='comment'>
        <h4>{this.props.name}</h4>
        <p>{this.props.message}</p>
        <a href='#' className='likes' onClick={this.onLike}>{this.props.likes} Likes</a>
      </div>
    )
  }
}

export default Comment
