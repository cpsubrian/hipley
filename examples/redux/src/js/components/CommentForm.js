import React from 'react'
import autobind from 'autobind-decorator'

@autobind
class CommentForm extends React.Component {

  static propTypes = {
    addComment: React.PropTypes.func
  }

  state = {
    name: '',
    message: ''
  }

  onChangeName (e) {
    this.setState({name: e.currentTarget.value})
  }

  onChangeMessage (e) {
    this.setState({message: e.currentTarget.value})
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.state.name.length && this.state.message.length) {
      this.props.addComment({name: this.state.name, message: this.state.message})
      this.setState({name: '', message: ''})
    } else {
      window.alert('Name and Message are required')
    }
  }

  render () {
    return (
      <form className='comment-form' onSubmit={this.onSubmit}>
        <input
          type='text'
          className='name'
          placeholder='name'
          onChange={this.onChangeName}
          value={this.state.name}
        />
        <textarea
          type='text'
          className='message'
          placeholder='message'
          onChange={this.onChangeMessage}
          value={this.state.message}
          rows={4}
        />
        <button type='submit'>Submit</button>
      </form>
    )
  }
}

export default CommentForm
