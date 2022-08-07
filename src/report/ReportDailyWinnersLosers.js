import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Icon, Table, Dimmer, Loader, Accordion } from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class ReportDailyWinnersAndLosers extends React.Component {
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
        this.props.user.functions.GetDailyWinnerLoser().then(
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


        let aggregationPipelineQuery = [
          {
            '$addFields': {
              'extractedHour': {
                '$hour': '$hour'
              }
            }
          }, {
            '$match': {
              'extractedHour': 23
            }
          }, {
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
                  }, 2
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
          }, {
            '$addFields': {
              'day': {
                '$dateToString': {
                  'date': '$_id', 
                  'format': '%Y-%m-%d'
                }
              }
            }
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
                                        <p>An Atlas Scheduled Trigger that runs every hour to push last price of every currency in that hour, into a collection.</p>
                                        <p>When this page runs, it calls an Atlas Function that runs the below query to calculate the percentage change of the price of each currency, between 2 days.</p>
                                        <p>It gets the price at 23:00:00 for each days and compare the days.</p>
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
                        <Table.HeaderCell rowSpan='2'>Day</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>1st</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>2nd</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>3nd</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>%</Table.HeaderCell>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>%</Table.HeaderCell>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Close</Table.HeaderCell>
                        <Table.HeaderCell>%</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                {this.state.localRankData !== undefined ?
                
                        <Table.Body>
                            {this.state.filteredRankData !== undefined ?
                                this.state.filteredRankData.map((item, index) => 
                                        <Table.Row key={index}> 
                                            <Table.Cell>{item.day}</Table.Cell>
                                            <Table.Cell>{item.showN[0][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[0][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[0][2] > 0 ? "+"+item.showN[0][2] : item.showN[0][2]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[1][2] > 0 ? "+"+item.showN[1][2] : item.showN[1][2]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][0]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][1]}</Table.Cell>
                                            <Table.Cell>{item.showN[2][2] > 0 ? "+"+item.showN[2][2] : item.showN[2][2]}</Table.Cell>
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


export default ReportDailyWinnersAndLosers