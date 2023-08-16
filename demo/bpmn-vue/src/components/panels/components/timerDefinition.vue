<!--  -->
<template>
  <strong class="form-label">TIMER DEFINITION</strong>

  <div>
    <P class="form-label">Type</P>
    <select
      name="timerType"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.timerType"
      @change="change"
    >
      <option value="timeCycle">timeCycle</option>
      <option value="timeDuration">timeDuration</option>
      <option value="timeDate">timeDate</option>
    </select>
  </div>
  <p class="form-label">Value</p>
  <input
    autocomplete="off"
    style="margin: 6px 0px"
    :value="target.properties.timerValue"
    id="name-input"
    type="text"
    class="form-control"
    @input="input"
  />
  <div style="width: 250px">
    <div v-if="timerType === 'timeDate'">
      <div>
        <p>
          A specific point in time defined as ISO 8601 combined date and time
          representation.
        </p>
        <ul>
          <li><code>2019-10-01T12:00:00Z</code> - UTC time</li>
          <li>
            <code>2019-10-02T08:09:40+02:00</code> - UTC plus 2 hours zone
            offset
          </li>
        </ul>
        <a
          href="https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-date"
          target="_blank"
          rel="noopener"
          >Documentation: Timer events</a
        >
      </div>
    </div>
    <div v-if="timerType === 'timeCycle'">
      <div>
        <p>
          A cycle defined as ISO 8601 repeating intervals format, or a cron
          expression.
        </p>
        <ul>
          <li><code>R5/PT10S</code> - every 10 seconds, up to 5 times</li>
          <li><code>R/P1D</code> - every day, infinitely</li>
          <li>
            <code>0 0 9-17 * * MON-FRI</code> - every hour on the hour from 9-5
            p.m. UTC Monday-Friday
          </li>
        </ul>
        <a
          href="https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-cycle"
          target="_blank"
          rel="noopener"
          >Documentation: Timer events</a
        >
      </div>
    </div>
    <div v-if="timerType === 'timeDuration'">
      <div>
        <p>A time duration defined as ISO 8601 durations format.</p>
        <ul>
          <li><code>PT15S</code> - 15 seconds</li>
          <li><code>PT1H30M</code> - 1 hour and 30 minutes</li>
          <li><code>P14D</code> - 14 days</li>
        </ul>
        <a
          href="https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-duration"
          target="_blank"
          rel="noopener"
          >Documentation: Timer events</a
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';

const timerType = ref('');
const target: any = inject('target');

function change(e: any) {
  target.value.setProperties({
    timerType: e.target.value,
  });
  timerType.value = e.target.value;
}

function input(e: any) {
  target.value.setProperties({
    timerValue: e.currentTarget.value,
  });
}
</script>
