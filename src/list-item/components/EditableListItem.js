// @flow
import React, { createElement } from 'react'
import { assign } from 'lodash'
import Spinner from '../../spinner'

import ListItem from './ListItem'
import ListItemForm from './ListItemForm'

// styles
import { ToolbarStyle, EditableItemStyle, SpinnerStyle } from '../styles'

type Props = {
  item: Object,
  itemProps: Object,
  formProps: Object,
  className: string,
  onSave: (data: any) => void,
  onDelete: () => void,
}

type State = {
  editMode: boolean,
  isSaving: boolean,
}

class EditableListItem extends React.Component<any, Props, State> {
  state = { editMode: false }
  static defaultProps = {
    itemProps: {},
    formProps: {},
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
    let { item, onDelete } = this.props
    let { editMode } = this.state

    return (
      <ToolbarStyle className='ListItem-toolbar'>
        {(() => {
          if (item.isFetching) {
            return (
              <SpinnerStyle>
                <Spinner color='primary' size={30} hideLabel hideOverlay />
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
    let { item, itemProps, formProps, className } = this.props
    let { editMode } = this.state

    let ItemElement = createElement(ListItem, {
      ...itemProps,
      item
    })

    let FormElement = createElement(ListItemForm, {
      onSave: this.handleFormSave,
      onCancel: this.handleFormCancel,
      ...formProps,
      item
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
