import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Icon, Table, Dimmer, Loader, Input, Accordion } from 'semantic-ui-react';
import moment from 'moment'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class ReportLastPrices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isQueryRunning: false,
            localLastPricesData: undefined,
            isPriceDataRetrieved: false
        }
    }


    fetchLastPrices () {
        this.setState({isQueryRunning: true, localLastPricesData: undefined})
        this.props.user.functions.GetLastPrices().then(
            data => {
                let result = data
                this.setState({
                    isQueryRunning: false,
                    localLastPricesData: result,
                    filteredLastPricesData: result,
                    isAccordionOpen: false
                });
            }
        )
    }

    handleFilterInput (val) { 
        //console.log("handled data:" + val)
        const tempFilteredLastPricesData = this.state.localLastPricesData.filter(x=> x.symbol.includes(val))
        this.setState({filteredLastPricesData: tempFilteredLastPricesData})    
    }


    UNSAFE_componentWillMount() { this.fetchLastPrices() }

    render () {

        let indexObject = {"symbol":1, "time": -1}
        let indexObjectStr = JSON.stringify(indexObject, null ,4)

        let aggregationPipelineQuery = [
            {
                "$sort": {
                    "symbol": 1,
                    "time": -1
                }
            }, 
            {
                "$group": {
                    "_id": "$symbol",
                    "lastPrice": {
                        "$first": "$price"
                    },
                    "lastUpdatedTime": {
                        "$first": "$time"
                    }
                }
            },
            {
                "$project" : {
                    "symbol" : "$_id",
                    "lastPrice": 1,
                    "lastUpdatedTime": 1
                }  
            },
            {
                "$sort": {"symbol": 1}
            }
          ]
        let aggregationPipelineQueryStr = JSON.stringify(aggregationPipelineQuery, null ,4)

        return (
            <>
            <Segment>
            <Accordion>
                                    <Accordion.Title
                                        active={this.state.isAccordionOpen}
                                        index={0}
                                        onClick={() => this.setState({isAccordionOpen: !this.state.isAccordionOpen})}>
                                        
                                        <Icon name='dropdown' />
                                        How does it work
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.isAccordionOpen}>
                                        <p>In order to bring the first or the last value of a metadata (symbol) efficiently, query engine uses underlying index on the Time-Series collection and mitigate potential unnecessary record scans.</p>
                                        <p>Following index created on the Time-Series collection:</p>
                                        <SyntaxHighlighter showLineNumbers={true} language="json" style={docco}>
                                            {indexObjectStr}
                                        </SyntaxHighlighter> 
                                        <p>$sort stage is the first aggregation stage to utilize index and we use $first operator in the $group stage to retrieve the first record on the index that is sorted by time, DESCENDING.</p>
                                        <SyntaxHighlighter showLineNumbers={true} language="json" style={docco}>
                                            {aggregationPipelineQueryStr}
                                        </SyntaxHighlighter> 
                                        <p>In the execution plan we see <b>DISTINCT_SCAN</b> step that eliminates unneeded records scan. Therefore it takes a few seconds (depending on the # of distinct metadata) to retrieve the first/last record among billions of records.</p>
                                        <p>For futher information, <a href="https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#-last-point--queries-on-time-series-collections" target="_blank">click here</a> to see documentation.</p>
                                        
                                    </Accordion.Content>
                                </Accordion>
                                </Segment>
            <Segment>
                    <Button icon labelPosition='right' disabled={this.state.isQueryRunning} color='green' onClick={() => this.fetchLastPrices()} ><Icon name='refresh'/>Refresh the Prices</Button>
            </Segment>
            <Segment>
                <Dimmer active={this.state.isQueryRunning}>
                                            <Loader size="small" indeterminate active={this.state.isQueryRunning}>Loading ...</Loader>
                </Dimmer>
                <Input icon='search' placeholder='Search...' onChange={(x, y) => this.handleFilterInput(y.value)} />
                <Table celled striped>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Symbol</Table.HeaderCell>
                            <Table.HeaderCell>Last Price</Table.HeaderCell>
                            <Table.HeaderCell>Updated Time</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                
                {this.state.localLastPricesData !== undefined ?
                
                        <Table.Body>
                            {this.state.filteredLastPricesData !== undefined ?
                                this.state.filteredLastPricesData.map((item, index) => 
                                        <Table.Row key={index}> 
                                            <Table.Cell>{item.symbol}</Table.Cell>
                                            <Table.Cell>{item.lastPrice}</Table.Cell>
                                            <Table.Cell>{moment(item.lastUpdatedTime).local().format()}</Table.Cell>
                                        </Table.Row> 
                                ) 
                            : null

                            }
                        </Table.Body>
                    : <Table.Body></Table.Body>}
                     </Table>
            </Segment>
            </>
        )
    }
}


export default ReportLastPrices