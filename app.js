

function log_event(event) {
  console.log(event);
  logTextarea = document.getElementById('log-textarea')
  logTextarea.value += performance.now() + " : " + event + "\n";
  logTextarea.scrollTop = logTextarea.scrollHeight
}


function configure_text_log() {
  // Show a text log of the events
  const logButton = document.getElementById("log-button");
  const statusBarLog = document.getElementById("status-bar-log");
  logButton.addEventListener("click", () => {
    statusBarLog.classList.toggle("show");
  });

  const saveLogBtn = document.getElementById("save-log-btn");
  // Save the log in a text file
  saveLogBtn.addEventListener("click", () => {
    const text = document.getElementById("log-textarea").value;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "visual-time-synch-log.txt";
    link.click();
  });

  const shareLogBtn = document.getElementById("share-log-btn");
  // Share the log text with other apps using the web share API
  shareLogBtn.addEventListener("click", async () => {
    const text = document.getElementById("log-textarea").value;
    let share_obj = {
      title: "Visual time synchronization event log",
      text: text,
    }
    if (!navigator.canShare) {
      log_event("navigator.canShare() not supported.");
    } else if (navigator.canShare(share_obj)) {
      try {
        await navigator.share(share_obj);
        log_event("Low was shared successfully");
      } catch (err) {
        log_event(`Share failed: ${err.message}`);
      }
    } else {
      log_event("Log cannot be shared.");
    }
  });
}



function generate_time_table() {
  // JavaScript code to generate the time table with nested 3x3 grids for the milliseconds
  const timeTable = document.getElementById("time-table");
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("ds-cell");
    const innerGrid = document.createElement("div");
    innerGrid.classList.add("inner-grid");
    for (let j = 0; j < 9; j++) {
      const innerCell = document.createElement("div");
      innerCell.classList.add("grid-item");
      innerGrid.appendChild(innerCell);
    }
    cell.appendChild(innerGrid);
    timeTable.appendChild(cell);
  }
}


function configure_fullscreen() {
  // Function to toggle fullscreen mode.
  // Activated when clicking in the time table or in the fullscreen button.
  fullscreenToggler = () => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      log_event("Fullscreen enabled.");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      } else {
        log_event("Fullscreen not supported.");
      }
    } else {
      log_event("Fullscreen disabled.");
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else {
        log_event("Fullscreen not supported.");
      }
    }
  }

  const timeTable = document.getElementById("time-table");
  timeTable.addEventListener("click", fullscreenToggler);
  const fullScreenBtn = document.getElementById('full-screen-btn');
  fullScreenBtn.addEventListener("click", fullscreenToggler);
}


function configure_grid_shape() {
  // Checkbox to set the grid to square or rectangular
  const checkbox = document.getElementById('square-grid');
  const timeTable = document.getElementById("time-table");

  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      log_event("Grid shape changed to square")
      timeTable.classList.add("square");
    } else {
      log_event("Grid shape changed to rectangular")
      timeTable.classList.remove("square");
    }
  });
}


function configure_time_source() {
  const usePerfNowChBox = document.getElementById('use-performance-time');

  usePerfNowChBox.addEventListener('change', (event) => {
    if (event.target.checked) {
      tmp_time = new Date(performance.timeOrigin + performance.now());
      log_event(`Time source changed to performance.now(): ${tmp_time.toISOString()}`);
    } else {
      tmp_time = new Date();
      log_event(`Time source changed to Date(): ${tmp_time.toISOString()}`);
    }
  }
  );
}

function configure_nosleep() {
  var noSleep = new NoSleep();

  var toggleEl = document.querySelector("#NoSleep");
  var noSleepStatus = document.querySelector("#nosleep-status");
  toggleEl.addEventListener('click', function () {
    if (toggleEl.checked) {
      noSleep.enable(); // keep the screen on!
      //toggleEl.value = "Wake Lock is enabled";
      noSleepStatus.textContent = "Wake Lock enabled";
      noSleepStatus.style.backgroundColor = "green";
      log_event("Wake Lock enabled");
    } else {
      noSleep.disable(); // let the screen turn off.
      noSleepStatus.textContent = "Wake Lock disabled";
      noSleepStatus.style.backgroundColor = "red";
      log_event("Wake Lock disabled");
      //toggleEl.value = "Wake Lock is disabled";
      //document.body.style.backgroundColor = "";
    }
  }, false);
}


function setup_status_bar() {
  //  -----------------------------------------------
  // Event listeners for displaying the configuration menu

  const statusbar = document.getElementById('status-bar');
  const configButton = document.getElementById("config-button");
  const statusBarConfig = document.getElementById("status-bar-config");
  configButton.addEventListener("click", () => {
    statusBarConfig.classList.toggle("show");
  });
  /*statusbar.addEventListener('click', function (event) {
    if (!statusBarConfig.contains(event.target) && !configButton.contains(event.target)
        && !logButton.contains(event.target)) {
      statusBarConfig.classList.toggle("show");
    }
  });*/

  window.addEventListener('click', (event) => {
    if (!statusBarConfig.contains(event.target) && !configButton.contains(event.target)
      && !statusbar.contains(event.target)) {
      statusBarConfig.classList.remove('show');
    }
  });
}


// Global variables for the FPS control
let fps = 20;   // Desired FPS
let minFrameTime = 1000 / fps;   // Min. interval between frames
let meanTimeDelta = 1000 / fps;   // Statistics

function configure_fps() {
  // Configure the FPS using a slider
  const fpsSlider = document.querySelector('#fps-slider');
  const fpsValue = document.querySelector('#fps-slider-value');
  /*
      fpsSlider.addEventListener('input', () => {
        fpsValue.textContent = fpsSlider.value;
      });
  */
  fps = parseInt(fpsSlider.value);
  minFrameTime = 1000 / fps;
  meanTimeDelta = 1000 / fps;

  fpsSlider.addEventListener('input', (event) => {
    fps = parseInt(event.target.value);
    minFrameTime = 1000 / fps;
    fpsValue.textContent = fpsSlider.value;
    meanTimeDelta = minFrameTime;
    log_event(`FPS changed to ${fps}`);
  });
}


//  -----------------------------------------------
// Configure the page
configure_text_log();
generate_time_table();
configure_fullscreen();
configure_grid_shape();
configure_time_source();
configure_nosleep();
setup_status_bar();
configure_fps();


//  -----------------------------------------------
// Code to control the animation and to check the time status.


// Save the performance.timeOrigin value and check if it is modified.
lastTimeOrigin = performance.timeOrigin;

log_event(`First performance.timeOrigin: ${lastTimeOrigin}  (${new Date(lastTimeOrigin).toISOString()})`);

firstNow = performance.now();
log_event(`First performance.now: ${firstNow} (${new Date(lastTimeOrigin + firstNow).toISOString()})`);

let lastUpdateTime = firstNow;
let lastUpdateTimeOffset = 0.0;

let last_milli = 0
let mean_timeDrift = null;

function updateTime(currentTime) {

  const timeDelta = currentTime - lastUpdateTime;
  if (timeDelta + lastUpdateTimeOffset >= minFrameTime) {

    var dateNow = new Date();
    // Get the current time in milliseconds from the performance timer
    var performanceNow = performance.timeOrigin + performance.now();
    const usePerfNowChBox = document.querySelector('#use-performance-time');
    if (usePerfNowChBox.checked) {
      now = new Date(performanceNow);
    } else {
      now = dateNow;
    }

    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var milliseconds = now.getMilliseconds();

    var timeString = hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0') + '.' +
      milliseconds.toString().padStart(3, '0');

    document.getElementById('clock').innerHTML = timeString;


    const cells = document.querySelectorAll(".ds-cell");

    // Deactivate the old cells
    cell = cells[Math.floor(last_milli / 10)];
    cell.classList.remove("active");
    inner_grid = cell.children[0]
    if (last_milli % 10 === 0) {
    } else {
      const gridItem = inner_grid.children[last_milli % 10 - 1];
      gridItem.classList.remove("active");
    }


    const centisecond = Math.floor(milliseconds / 10);
    const milli_0_9 = milliseconds % 10;

    // Activate the new cells
    cell = cells[centisecond];
    cell.classList.add("active");
    inner_grid = cell.children[0]
    if (milli_0_9 === 0) {
    } else {
      const gridItem = inner_grid.children[milli_0_9 - 1];
      gridItem.classList.add("active");
    }


    mean_factor = Math.max(Math.ceil(1000 / minFrameTime), 8);
    meanTimeDelta = meanTimeDelta * (mean_factor - 1) / mean_factor + timeDelta / mean_factor;
    mean_fps = 1000 / meanTimeDelta;
    document.getElementById('fps-value').textContent = mean_fps.toFixed(1);

    // Check time drift
    // Calculate the time difference between the system clock and the performance timer
    timeDrift = dateNow - performanceNow;
    timeDrift_elem = document.getElementById('time-drift')
    //timeDriftError_elem = document.getElementById('time-drift-error')
    if (mean_timeDrift) {
      mean_timeDrift = mean_timeDrift * 15 / 16 + timeDrift / 16;
      if (Math.abs(timeDrift) > 20) {
        if (timeDrift_elem.style.backgroundColor != 'red') {
          log_event(`Time drift: ${timeDrift}ms . dateNow: ${dateNow.getTime()} . performanceNow: ${performanceNow}`);
        }
        timeDrift_elem.style.backgroundColor = 'red';
      } else {
        timeDrift_elem.style.backgroundColor = '';
      }
      /*if (Math.abs(timeDrift - last_timeDrift) > 20) {
        timeDriftError_elem.textContent = (last_timeDrift - timeDrift).toFixed(2);
        timeDriftError_elem.style.transition = "";
        timeDriftError_elem.style.backgroundColor = 'red';
        setInterval(() => {
          timeDriftError_elem.style.transition = "background-color 3s ease-in";
          timeDriftError_elem.style.backgroundColor = '';
        }, 100);
      }*/
    } else {
      mean_timeDrift = timeDrift;
    }
    timeDrift_elem.textContent = mean_timeDrift.toFixed(2) + 'ms';

    // Check the time origin
    timeOrigin_elem = document.getElementById('time-origin')
    if (lastTimeOrigin !== performance.timeOrigin) {
      log_event(`Change in performance.timeOrigin!. Old value: ${lastTimeOrigin}. New value: ${performance.timeOrigin}`);
      lastTimeOrigin = performance.timeOrigin;
    }


    lastUpdateTimeOffset += timeDelta - minFrameTime;
    if (lastUpdateTimeOffset > 1000) {
      lastUpdateTimeOffset = 1000;
    }

    lastUpdateTime = currentTime;
    last_milli = milliseconds;
    last_timeDrift = timeDrift;

  }

  requestAnimationFrame(updateTime);

}

requestAnimationFrame(updateTime);


