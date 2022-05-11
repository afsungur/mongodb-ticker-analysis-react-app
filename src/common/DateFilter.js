import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Popup, Icon } from 'semantic-ui-react';

const dropDownOptionForDateFilterValues = [
    { key: 1, text: 'Last Hour', value: 1 },
    { key: 2, text: 'Last 3 Hours', value: 3 },
    { key: 3, text: 'Last 12 Hours', value: 12 },
    { key: 4, text: 'Last 24 Hours', value: 24 },
    { key: 5, text: 'Last 3 Days', value: 3*24 },
    { key: 6, text: 'Last 7 Days', value: 7*24 },
    { key: 7, text: 'Last 15 Days', value: 15*24 },
    { key: 8, text: 'Last 30 Days', value: 30*24 }    
]

  class DateFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 1
        }
    }

    handleChange (event, data) {
        // update state locally
        this.setState({value: data.value})
        
        // send state to parent
        this.props.sendController(data.value)
    }

    render () {
        return (
                  
                    <Form.Field required>
                        <Form.Group>
                            <Form.Dropdown 
                                selection
                                required
                                width={8}
                                label="Date Filter"
                                options={dropDownOptionForDateFilterValues}
                                name="dropdown_date_filter_value"  
                                onChange={(event, data) => this.handleChange(event,data)}
                                value={this.state.value} 
                            />
                      

                            <Popup hideOnScroll flowing hoverable 
                            trigger={<Form.Button fluid icon labelPosition='left' color='green' size="small" label="&nbsp;"><Icon name='info circle'/>Data Source Info</Form.Button>}>
                                <p><b>Last hour:</b> Run the analysis in only the last hour of data</p>
                                <p><b>Last 3 Hours:</b> Run the analysis in only the last 3 hours of data</p>
                                <p><b>Last 12 Hours:</b> Run the analysis in only the last 12 hours of data</p>
                                <p><b>Last 24 Hours:</b> Run the analysis in only the last 24 hours of data</p>
                                <p><b>Last 3 Days:</b> Run the analysis in only the last 72 hours of data</p>
                                <p><b>Last 7 Days:</b> Run the analysis in only the last 168 hours of data</p>
                                <p><b>Last 15 Days:</b> Run the analysis in only the last 360 hours of data</p>
                                <p><b>Last 30 Days:</b> Run the analysis in only the last 720 hours of data</p>
                            </Popup>
                        </Form.Group>
                    </Form.Field>
        )
    }
}



export default DateFilter