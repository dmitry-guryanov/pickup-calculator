import React, { Component } from 'react';
import './App.css';
import { DropdownButton, MenuItem, Modal, Table, Form, Grid, Row, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import { Line } from "react-chartjs-2";

class App extends Component {
	constructor(props) {
		super(props)
		this.defaultSetup = {
			Rp: "17400",
			L: "8",
			Cp: "80",
			Ct: "22000",
			Rt: "500000",
			Rv: "500000",
			Cc: "100",
			Len: "3",
			Rl1: "1000000",
			Rl2: "",
			Color: "#993955"
		}

		this.colors = [
			"#81ad75",
			"#a3c3d9",
			"#828996",
			"#8d91f4"
		]

		let current = "Hi-Output Humbucker with 3m cable"
		let setups = {
			[current]: Object.assign({}, this.defaultSetup)
		}
		this.state = {
			value: "",
			setups: setups,
			current: current,
			data: {},
			newSetup: "",
			title: "Guitar pickup response",
			showAddDialog: false
		}

		let arr = this.calcData(setups[current])
		this.state.data = {
			[current]: arr
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleChangeNew = this.handleChangeNew.bind(this)
		this.handleChangeTitle = this.handleChangeTitle.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
		this.handleAddButton = this.handleAddButton.bind(this)
		this.handleCloseAddDialog = this.handleCloseAddDialog.bind(this)
		this.addSetup = this.addSetup.bind(this)
		this.handleUpdateButton = this.handleUpdateButton.bind(this)
		this.handleDeleteButton = this.handleDeleteButton.bind(this)
	}

	calcData(s) {
		var arr = []
		var x = 0

		let Rp = parseFloat(s.Rp)
		let L = parseFloat(s.L)
		let Cp = parseFloat(s.Cp)
		let Cc = parseFloat(s.Cc)
		let Len = parseFloat(s.Len)
		let Rl1 = parseFloat(s.Rl1)
		let Ct = parseFloat(s.Ct)
		let Rt = parseFloat(s.Rt)
		let Rv = parseFloat(s.Rv)

		let r = 1 / Rl1 + 1 / Rv
		if (s.Rl2) {
			r += 1 / parseFloat(s.Rl2)
		}

		let R = 1 / r

		for (x = 0; x < 10000; x += 500) {
			let y = this.calcU(Rp, L, (Cp + Cc * Len) * 1e-12, Ct * 1e-12, Rt, R, x )
			arr.push({x: x, y: y})
		}

		return arr
	}

	handleChange(e) {
		let setups = this.state.setups
		setups[this.state.current][e.target.id] = e.target.value
		this.setState({setups: setups})
	}

	handleChangeNew(e) {
		this.setState({newSetup: e.target.value})
	}

	handleChangeTitle(e) {
		this.setState({title: e.target.value})
	}

	handleSelect(selectedKey) {
		this.setState({current: selectedKey})
	}

	handleUpdateButton() {
		let arr = this.calcData(this.state.setups[this.state.current])
		let data = this.state.data
		data[this.state.current] = arr
		this.setState({data: data})
	}

	handleAddButton() {
		this.setState({showAddDialog: true})
	}

	handleCloseAddDialog() {
		this.setState({showAddDialog: false})
	}

	addSetup() {
		let setups = this.state.setups

		setups[this.state.newSetup] = Object.assign({}, setups[this.state.current])
		setups[this.state.newSetup].Color = this.colors.pop()
		let arr = this.calcData(setups[this.state.newSetup])
		let data = this.state.data
		data[this.state.newSetup] = arr
		this.setState({setups: setups, current: this.state.newSetup, data: data, newSetup: "", showAddDialog: false})
	}

	handleDeleteButton() {
		let setups = this.state.setups
		let color = setups[this.state.current].Color
		let data = this.state.data
		let current = this.state.current

		delete setups[current]
		delete data[current]
		current = Object.keys(setups)[0]

		this.setState({setups: setups, data: data, current: current})
		this.colors.push(color)
	}

	calcU(Rp, L, C, Ct, Rt, Rl, f) {
		let w = 2 * Math.PI * f
		
		let k = 1 + w * w * Rt * Rt * Ct * Ct
		let y = Rl / Math.pow(Math.pow(Rp + Rl - w * w * Rl * (L * C + Ct * (L - Ct * Rt * Rp) / k), 2) + w * w * Math.pow(L + C * Rl * Rp + Ct * Rl * (Rp + w * w * L * Rt * Ct) / k, 2), 0.5)
		return 20 * Math.log10(y)
	}

	render() {

		let datasets = []
		for (let k of Object.keys(this.state.data)) {
			datasets.push({
					xAxisID: 'x-axis',
					yAxisID: 'y-axis',
					'label': k,
					'data': this.state.data[k],
					pointRadius: 0,
					fill: false,
					steppedLine: false,
					borderColor: this.state.setups[k].Color,
					backgroundColor: this.state.setups[k].Color
			})
		}

		let data = {
			datasets: datasets
		}

		let options = {
			title: {
				display: true,
				position: "bottom",
				text: this.state.title
			},
			scales: {
				yAxes: [{
					id: 'y-axis',
					type: 'linear',
					display: true,
					ticks: {
					},
					scaleLabel: {
						labelString: "Output signal ratio, Db",
						display: true
					}
				}],
				xAxes: [{
					id: 'x-axis',
					type: 'logarithmic',
					display: true,
					ticks: {
						max: 12000,
						min: 100,
						fontSize: 10,
						callback: (	value, index, values) => { return String(value) }
					},
					scaleLabel: {
						labelString: "Frequecy, Hz",
						display: true
					}
				}]
			},
			responsive: false
		}

 	return (
		<div className="App" style={{"text-align": "left"}}>
			<Modal show={this.state.showAddDialog} onHide={this.handleCloseAddDialog}>
				<Modal.Header>
					<h4>Add setup</h4>
				</Modal.Header>
				<Modal.Body>
					<ControlLabel>Name</ControlLabel>
					<FormControl type="text" value={this.state.newSetup} bsSize="small" placeholder="enter text" onChange={this.handleChangeNew}></FormControl>&nbsp;
				</Modal.Body>
				<Modal.Footer>
					<Button disabled={this.state.newSetup === ""} onClick={this.addSetup}>Add</Button>
				</Modal.Footer>
			</Modal>
			<Grid>
				<Row>
					<Col sm={6} style={{padding: "10px"}}>

			<div>
			<Form>
				<div style={{"text-align": "right", "margin-bottom": "5px"}}>
				<DropdownButton bsSize="small" title={this.state.current}>
					{
						Object.keys(this.state.setups).map((k) =>
							<MenuItem bsSize="small" eventKey={k} key={k} onSelect={this.handleSelect}>{k}</MenuItem>
						)
					}
				</DropdownButton>&nbsp;
				<Button bsSize="small" href="#" bsStyle="primary" onClick={this.handleUpdateButton}>Update</Button>&nbsp;
				<Button bsSize="small" href="#" bsStyle="danger" onClick={this.handleDeleteButton} disabled={Object.keys(this.state.setups).length <= 1}>Delete</Button>&nbsp;
				<Button bsSize="small" href="#" bsStyle="success" onClick={this.handleAddButton}>New</Button>
				</div>
				<Table responsive bordered={false} condensed={true}><tbody>
					<tr>
						<td>Pickup Resistance (DCR), Ohms</td>
						<td><FormControl id="Rp" bsSize="small" type="text" value={this.state.setups[this.state.current].Rp} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Pickup Inductance, Henri</td>
						<td><FormControl id="L" bsSize="small" type="text" value={this.state.setups[this.state.current].L} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Pickup Capacitance, pF</td>
						<td><FormControl id="Cp" bsSize="small" type="text" value={this.state.setups[this.state.current].Cp} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Tone control Capacitance, pF</td>
						<td><FormControl id="Ct" bsSize="small" type="text" value={this.state.setups[this.state.current].Ct} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Tone control Resistance, Ohms</td>
						<td><FormControl id="Rt" bsSize="small" type="text" value={this.state.setups[this.state.current].Rt} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Volume control Resistance, Ohms</td>
						<td><FormControl id="Rv" bsSize="small" type="text" value={this.state.setups[this.state.current].Rv} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Cable Capacitance per metre, pF/m</td>
						<td><FormControl id="Cc" bsSize="small" type="text" value={this.state.setups[this.state.current].Cc} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Cable Length</td>
						<td><FormControl id="Len" bsSize="small" type="text" value={this.state.setups[this.state.current].Len} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Load 1 resistance, Ohms</td>
						<td><FormControl id="Rl1" bsSize="small" type="text" value={this.state.setups[this.state.current].Rl1} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>
					<tr>
						<td>Load 2 resistance, Ohms</td>
						<td><FormControl id="Rl2" bsSize="small" type="text" value={this.state.setups[this.state.current].Rl2} placeholder="enter text" onChange={this.handleChange}></FormControl></td>
					</tr>

				</tbody></Table>
			</Form>
			</div>
			<Form inline>
				Title &nbsp;
					<FormControl bsSize="small" type="text" value={this.state.title} placeholder="enter text" onChange={this.handleChangeTitle}></FormControl>&nbsp;

			</Form>
					</Col>
					<Col sm={6}>
		<Line data={data} options={options} width={500} height={500}/>
					</Col>
				</Row>
			</Grid>
		</div>
 		);
	}
}

export default App;
