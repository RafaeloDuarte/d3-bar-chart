import { 
  select,
  csv, 
  scaleLinear, 
  scaleBand, 
  max, 
  axisLeft,
  axisBottom,
  format
} from 'd3'

const svg = select('svg')

const height = +svg.attr('height')
const width = +svg.attr('width')

const render = data => {
  
  const xValue = d => d.population
  const yValue = d => d.country
  const margin = { top:40, left:100, botton:20, right:40 }
  const innerWidth = width - margin.left - margin.top
  const innerHeight = height - margin.top - margin.botton
  const xScale = scaleLinear()
  	.domain([0,max(data, xValue)])
  	.range([0, innerWidth])
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0, innerHeight])
  	.padding(0.2)
  
  console.log(yScale.domain())
  
  const g = svg.append('g')
  	.attr('transform',`translate(${margin.left},       ${margin.top})`)
  const xAxisTickFormat = number => 
  	format('.3s')(number).replace('G','B')
  
  const xAxis = axisBottom(xScale).tickFormat(xAxisTickFormat)

  g.append('g')
    .call(axisLeft(yScale))
  	.selectAll('.domain, .tick line')
  		.remove()
  g.append('g').call(xAxis)
  	.attr('transform',`translate(0, ${innerHeight})`)
    	.select('.domain')
  		.remove()
  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
  		.attr('y', d => yScale(yValue(d)))
	    .attr('fill', 'black')
  		.attr('width', d => xScale(xValue(d)))
  		.attr('height', yScale.bandwidth())
  g.append('text')
  	.text('The 10 Most Populous Countries')
}

csv('data.csv').then(data => {
  data.forEach(d => {
    d.population = +d.population * 1000
  })
	render(data)
})