
import React from 'react';

import { Dropdown, Menu } from 'semantic-ui-react';
const styles = {width: "100px"};
const logoStyles = {width: "50px"}

class TopMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = { activeItem: 'home' }
      }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      
      <Menu size='small'>
        <Menu.Item
          name='Currency Analysis'
          active={activeItem === 'currency'}
          href="/currency"
        />
        <Menu.Item
          name='Rules'
          active={activeItem === 'rules'}
          href="/rules"
        />

          <Dropdown item text='Reports'>
            <Dropdown.Menu>
              <Dropdown.Item href="/reportLastPrices">Last Prices</Dropdown.Item>
              <Dropdown.Item href="/reportHourlyWinnersAndLosers">Hourly Winners-Losers</Dropdown.Item>
              <Dropdown.Item href="/reportDailyWinnersAndLosers">Daily Winners-Losers</Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
        

        <Menu.Menu position='right'>
          <Menu.Item>
            <a className="item" href="https://cloud.mongodb.com" target="_blank" rel="noreferrer">
              <img alt="" src="/mdblogo.svg" style={styles}/>          
            </a>
          </Menu.Item>
          <Menu.Item>
            <a className="item" href="https://docs.mongodb.com/manual/core/timeseries-collections/" target="_blank" rel="noreferrer">
              <img alt="" src="/ts.avif" style={logoStyles}></img>
            </a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      
    )
  }
}

export default TopMenu;