import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addComment, likeComment} from '../actions/commentsActions'
import Comments from './Comments'
import CommentForm from './CommentForm'

@connect((state) => ({comments: state.comments}), {addComment, likeComment})
export default class App extends Component {

  static propTypes = {
    comments: React.PropTypes.array,
    addComment: React.PropTypes.func,
    likeComment: React.PropTypes.func
  }

  render () {
    return (
      <div className='app'>
        <Comments comments={this.props.comments} likeComment={this.props.likeComment}/>
        <CommentForm addComment={this.props.addComment}/>
      </div>
    )
  }
}
