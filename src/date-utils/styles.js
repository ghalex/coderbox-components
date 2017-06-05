import styled from 'styled-components'

export const Icon = styled.i`
  margin: 0px 10px
`

export const DateRangeContainer = styled.div`
  font-size: 14px;
  
  & select {
    border: 1px solid ${p => p.theme.borderColors.base};
    border-radius: 4px;
    padding: 6px 8px;
  }
`
