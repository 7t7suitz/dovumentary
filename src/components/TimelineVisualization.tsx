import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TimelineEvent } from '../types/document';

interface TimelineVisualizationProps {
  events: TimelineEvent[];
  width?: number;
  height?: number;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  events,
  width = 800,
  height = 400
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!events.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(sortedEvents, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(sortedEvents.map((_, i) => i.toString()))
      .range([0, innerHeight])
      .padding(0.1);

    // Color scale for event types
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(['event', 'milestone', 'character', 'theme'])
      .range(['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']);

    // Create timeline line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', innerHeight / 2)
      .attr('y2', innerHeight / 2)
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 2);

    // Create event circles
    const eventGroups = g
      .selectAll('.event-group')
      .data(sortedEvents)
      .enter()
      .append('g')
      .attr('class', 'event-group')
      .attr('transform', (d, i) => `translate(${xScale(d.date)}, ${yScale(i.toString())! + yScale.bandwidth() / 2})`);

    // Add circles
    eventGroups
      .append('circle')
      .attr('r', d => 4 + d.importance * 6)
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Create tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'timeline-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);

        tooltip.html(`
          <strong>${d.title}</strong><br/>
          ${d.date.toLocaleDateString()}<br/>
          ${d.description.substring(0, 100)}...
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.selectAll('.timeline-tooltip').remove();
      });

    // Add event labels
    eventGroups
      .append('text')
      .attr('x', 15)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.title.length > 30 ? d.title.substring(0, 30) + '...' : d.title);

    // Add date labels
    eventGroups
      .append('text')
      .attr('x', 15)
      .attr('y', 15)
      .style('font-size', '10px')
      .style('fill', '#6B7280')
      .text(d => d.date.toLocaleDateString());

    // Add x-axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y-%m-%d'))
      .ticks(5);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    const legendItems = ['event', 'milestone', 'character', 'theme'];
    
    legendItems.forEach((type, i) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem
        .append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(type));

      legendItem
        .append('text')
        .attr('x', 15)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text(type.charAt(0).toUpperCase() + type.slice(1));
    });

  }, [events, width, height]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Visualization</h3>
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Circle size indicates event importance. Hover over events for details.</p>
      </div>
    </div>
  );
};