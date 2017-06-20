import React from 'react';

class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
  }
  /*
  onPrint() {
    const { vehicleData } = this.props.parkedVehicle;
    const { 


    plate_no,
      max_time,
      entry_date_time,
      exit_date_time,
      expiry_time,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      parking_status
    } = vehicleData;

    var pdfConverter = require('jspdf');
    //var converter = new pdfConverter();
    //var doc = converter.jsPDF('p', 'pt');

    var doc = new pdfConverter('p','pt','c6');

    doc.setFontSize(22);
    doc.text(20, 50, 'Park Entry Ticket');
    doc.setFontSize(16);
    doc.text(20, 80, 'Address1: ' + address1);
    doc.text(20, 100, 'Address2: ' + address2);
    doc.text(20, 120, 'Entry Date & time: ' + entry_date_time);
    doc.text(20, 140, 'Expiry date & time: ' + exit_date_time);
    doc.save("test.pdf");
  
  }
  */

  render() {

    return(
      <div>
        
      </div>
    );
  }


}

module.exports = MyPdfViewer;