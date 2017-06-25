// @flow
import React, { createElement } from 'react'
import { assign } from 'lodash'
import Spinner from 'Spinner'

import ListItem from './ListItem'
import ListItemForm from './ListItemForm'

// styles
import { ToolbarStyle, EditableItemStyle, SpinnerStyle } from '../styles'

// types
import type { Item } from 'coderbox-components'

type Props = {
  item: Object,
  itemComponent: any,
  formComponent: any,
  formSettings: Object,
  loading: boolean,
  className: string,
  transform: (data: Object) => Item,
  onSave: (data: any) => void,
  onDelete: () => void,
}

type State = {
  editMode: boolean,
}

class EditableListItem extends React.Component<any, Props, State> {
  state = { editMode: false }
  static defaultProps = {
    className: ''
  }

  handleFormSave = (form: any) => {
    let { item, onSave } = this.props

    if (form.validate()) {
      let data = form.data()
      onSave(assign({}, item, data))
      this.setState({ editMode: false })
    }
  }

  handleFormCancel = () => {
    this.setState({ editMode: false })
  }

  handleEdit = () => {
    this.setState({ editMode: true })
  }

  renderToolbar () {
    let { onDelete, loading } = this.props
    let { editMode } = this.state

    return (
      <ToolbarStyle className='ListItem-toolbar'>
        {(() => {
          if (loading) {
            return (
              <SpinnerStyle>
                <Spinner
                  color='primary'
                  align='flex-end'
                  size={32}
                  hideLabel
                  hideOverlay
                />
              </SpinnerStyle>
            )
          } else {
            if (!editMode) {
              return (
                <div>
                  <i
                    className='material-icons'
                    onClick={() => this.handleEdit()}
                  >
                    edit
                  </i>
                  <i className='material-icons' onClick={() => onDelete()}>
                    delete
                  </i>
                </div>
              )
            }
          }
        })()}
      </ToolbarStyle>
    )
  }

  render () {
    let {
      item,
      transform,
      itemComponent,
      formComponent,
      formSettings,
      className
    } = this.props
    let { editMode } = this.state

    let ItemElement = createElement(itemComponent || ListItem, {
      item,
      transform
    })

    let FormElement = createElement(formComponent || ListItemForm, {
      onSave: this.handleFormSave,
      onCancel: this.handleFormCancel,
      item,
      settings: formSettings
    })

    return (
      <EditableItemStyle className={className}>
        {editMode ? FormElement : ItemElement}
        {this.renderToolbar()}
      </EditableItemStyle>
    )
  }
}

export default EditableListItem