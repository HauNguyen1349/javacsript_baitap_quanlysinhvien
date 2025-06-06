(function() {
  var selectedDate = moment().format('MM/DD/YYYY');

  function render() {
    var DatePicker = antd.DatePicker;
    function onChange(date, dateString) {
      selectedDate = dateString;
      document.getElementById('datepicker').value = dateString;
    }
    ReactDOM.render(
      React.createElement(DatePicker, {
        defaultValue: moment(selectedDate, 'MM/DD/YYYY'),
        format: 'MM/DD/YYYY',
        onChange: onChange,
        allowClear: false,
        style: { width: '100%' }
      }),
      document.getElementById('antd-date-container')
    );
    document.getElementById('datepicker').value = selectedDate;
  }

  window.renderAntdDatepicker = function(value) {
    if (value) selectedDate = value;
    render();
  };

  if (document.readyState !== 'loading') {
    render();
  } else {
    window.addEventListener('DOMContentLoaded', render);
  }
})();
