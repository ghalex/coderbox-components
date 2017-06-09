// @flow
import React from 'react'
import Autosuggest from 'react-autosuggest'
import { trim } from 'lodash'
import styles from './styles'
import type { Tag } from 'coderbox-components'

type Props = {
  value?: Tag,
  suggestions: Tag[],
  onChange: (suggestion: Tag) => void,
  onKeyDown: (event: KeyboardEvent) => void,
  placeholder: string,
  renderSuggestion: Function
}

type State = {
  searchText: string,
  suggestion: ?Tag,
  suggestions: Tag[]
}

class AutoComplete extends React.Component<any, Props, State> {
  state = {
    searchText: '',
    suggestion: null,
    suggestions: []
  }

  componentWillMount () {
    if (this.props.value) {
      this.setState({ searchText: this.props.value.name || '' })
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.value === null) {
      this.setState({ searchText: '' })
    }

    if (nextProps.value) {
      this.setState({ searchText: nextProps.value.name || '' })
    }
  }

  renderSuggestion (suggestion: Tag) {
    return (
      <div>
        {suggestion.name}
      </div>
    )
  }

  fetchSuggestions (value: string) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : this.props.suggestions
          .filter(c => {
            var m = c.name.toLowerCase().match(inputValue)
            return m && m.length > 0
          })
          .slice(0, 4)
  }

  firstSuggestion (value: string) {
    const inputValue = value.trim()
    const inputLength = inputValue.length

    return (inputLength === 0
      ? []
      : this.props.suggestions.filter(s => {
        return s.name === inputValue
      })).shift()
  }

  onSuggestion (event: any, props: { suggestion: Tag}) {
    this.setState({ suggestion: props.suggestion })
  }

  onChange (event :any, props: { newValue: string }) {
    this.setState({ searchText: trim(props.newValue) })
    if (this.props.onChange) {
      this.props.onChange(this.firstSuggestion(props.newValue) || { name: trim(props.newValue) })
    }
  }

  onKeyDown (event: KeyboardEvent) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event)
    }
  }

  onSuggestionsFetchRequested (props: { value: string }) {
    this.setState({ suggestions: this.fetchSuggestions(props.value) })
  }

  onSuggestionsClearRequested () {
    this.setState({ suggestions: [] })
  }

  render () {
    const { suggestions } = this.state
    const inputProps = {
      placeholder: this.props.placeholder,
      value: this.state.searchText,
      onChange: (e, data) => this.onChange(e, data),
      onKeyDown: e => this.onKeyDown(e)
    }

    return (
      <Autosuggest
        theme={styles}
        suggestions={suggestions}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={this.props.renderSuggestion || this.renderSuggestion}
        onSuggestionSelected={(e, data) => this.onSuggestion(e, data)}
        onSuggestionsFetchRequested={data => this.onSuggestionsFetchRequested(data)}
        onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
        shouldRenderSuggestions={value => value.trim().length > 1}
        inputProps={inputProps}
      />
    )
  }
}

export default AutoComplete
