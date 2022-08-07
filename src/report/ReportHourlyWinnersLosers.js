import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Icon, Table, Dimmer, Loader, Input, Accordion } from 'semantic-ui-react';
import moment from 'moment'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class ReportHourlyWinnersAndLosers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isQueryRunning: false,
            localRankData: undefined,
            isPriceDataRetrieved: false,
            isWinnerShowed: true
        }
    }


    fetchHourlyWinnerLoser () {
        this.setState({isQueryRunning: true, localRankData: undefined})
        this.props.user.functions.GetHourlyWinnerLoser().then(
            data => {
                let result = data.result
                this.setState({
                    isQueryRunning: false,
                    localRankData: result,
                    isAccordionOpen: false
                });
                this.setFilteredRankData(this.state.isWinnerShowed)
            }
        )
    }

    setFilteredRankData(isWinnerShowed) {
        let filteredRankData = this.state.localRankData
        if (isWinnerShowed) {
            filteredRankData.forEach( x=> x.showN = x.topN)
        } else {
            filteredRankData.forEach( x=> x.showN = x.bottomN)
        }
        this.setState({filteredRankData: filteredRankData})
    }

    toggleWinnerLoser () {
        let tempIsWinnerShowed = this.state.isWinnerShowed;
        this.setState({
            isWinnerShowed: !tempIsWinnerShowed
        })
        this.setFilteredRankData(!tempIsWinnerShowed)
    }


    UNSAFE_componentWillMount() { this.fetchHourlyWinnerLoser() }

    render () {

        let indexObject = {"symbol":1, "time": -1}
        let indexObjectStr = JSON.stringify(indexObject, null ,4)

        let aggregationPipelineQuery = [
            {
              '$setWindowFields': {
                'partitionBy': '$symbol', 
                'sortBy': {
                  'hour': 1
                }, 
                'output': {
                  'prevClose': {
                    '$shift': {
                      'output': '$price', 
                      'by': -1
                    }
                  }
                }
              }
            }, {
              '$addFields': {
                'percentage': {
                  '$round': [
                    {
                      '$divide': [
                        {
                          '$multiply': [
                            {
                              '$subtract': [
                                '$price', '$prevClose'
                              ]
                            }, 100
                          ]
                        }, '$prevClose'
                      ]
                    }, 4
                  ]
                }
              }
            }, {
              '$group': {
                '_id': '$hour', 
                'topN': {
                  '$topN': {
                    'output': [
                      '$symbol', '$price', '$percentage'
                    ], 
                    'sortBy': {
                      'percentage': -1
                    }, 
                    'n': 3
                  }
                }, 
                'bottomN': {
                  '$bottomN': {
                    'output': [
                      '$symbol', '$price', '$percentage'
                    ], 
                    'sortBy': {
                      'percentage': -1
                    }, 
                    'n': 3
                  }
                }
              }
            }, {
              '$sort': {
                '_id': -1
              }
            }]
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
                                        <p>An Atlas Scheduled Trigger that runs every hour to push last price of every currency in that hour, into a collection.</p>
                                        <p>When this page runs, it calls an Atlas Function that runs the below query to calculate the percentage change of the price of each currency, between current hour and previous hour.</p>
                                        <p>$setWindowFields aggregation stage and $shift, $topN, $bottomN operator have been used to retrieve this complex data.</p>
                                        <SyntaxHighlighter showLineNumbers={true} language="json" style={docco}>
                                            {aggregationPipelineQueryStr}
                                        </SyntaxHighlighter> 
                                    </Accordion.Content>
                                </Accordion>
                                </Segment>
            <Segment>
                    <Button icon labelPosition='right' disabled={this.state.isQueryRunning} color='green' onClick={() => this.toggleWinnerLoser()} ><Icon name={this.state.isWinnerShowed ? "arrow alternate circle down" : "arrow alternate circle up" }/>Show {this.state.isWinnerShowed ? "Losers" : "Winners" }</Button>
                    <Button icon labelPosition='right' disabled={this.state.isQueryRunning} color='green' onClick={() => this.fetchHourlyWinnerLoser()} ><Icon name='refresh'/>Refresh the Prices</Button>
            </Segment>
            <Segment>
                <Dimmer active={this.state.isQueryRunning}>
                                            <Loader size="small" indeterminate active={this.state.isQueryRunning}>Loading ...</Loader>
                </Dimmer>
                <h1>{this.state.isWinnerShowed ? "Winners" : "Losers" }</h1>
                <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan='2'>Time</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>1st</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>2nd</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>3nd</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>+ %</Table.HeaderCell>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>+ %</Table.HeaderCell>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>+ %</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                {this.state.localRankData !== undefined ?
                
                        <Table.Body>
                            {this.state.filteredRankData !== undefined ?
                                this.state.filteredRankData.map((item, index) => 
                                        <Table.Row key={index}> 
                                            <Table.Cell>{moment(item._id).local().format()}</Table.Cell>
                                            <Table.Cell>{item.showN[0][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[0][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[0][2]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][2]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][2]}</Table.Cell>
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


export default ReportHourlyWinnersAndLosers