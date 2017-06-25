import React from 'react'
import { bool, string, func, object } from 'prop-types'
import { ucfirst } from 'utils'
import Button from 'Button'

// styles
import { FormStyle } from './styles'

class Form extends React.Component {
  items = []

  static propTypes = {
    showButtons: bool,
    showSave: bool,
    showCancel: bool,
    saveLabel: string,
    cancelLabel: string,
    onSave: func,
    onCancel: func
  }

  static defaultProps = {
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
    showButtons: true,
    showSave: true,
    showCancel: true,
    onSave: () => true,
    onCancel: () => true
  }

  static childContextTypes = {
    form: object
  }

  getChildContext () {
    return { form: this }
  }

  validate () {
    let i = 0

    for (i = 0; i < this.items.length; i++) {
      if (!this.items[i].validate()) return false
    }

    return true
  }

  data () {
    let result = {}
    let item = null
    let i = 0

    for (i = 0; i < this.items.length; i++) {
      item = this.items[i]

      if (item.props.name) {
        result[item.props.name] = item.state.value
      }
    }

    return result
  }

  register (item) {
    this.items.push(item)
  }

  render () {
    let {
      children,
      showButtons,
      showSave,
      showCancel,
      saveLabel,
      cancelLabel
    } = this.props

    return (
      <FormStyle className='Form'>
        {children}
        {showButtons
          ? <div className='Form-buttons'>
            {showSave &&
            <Button primary onClick={() => this.props.onSave(this)}>
              {saveLabel}
            </Button>}
            {showCancel &&
            <Button onClick={() => this.props.onCancel()}>
              {cancelLabel}
            </Button>}
          </div>
          : null}
      </FormStyle>
    )
  }
}

Form.Validators = {
  email: ({ msg } = {}) => value => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (re.test(value)) return null
    return msg || 'Email is required and must be valid.'
  },

  minLength: ({ msg, length = 3 } = {}) => (value, field) => {
    if (value && value.length >= length) return null
    return msg || `${ucfirst(field)} is required. Min. ${length} characters.`
  }
}

export default Form