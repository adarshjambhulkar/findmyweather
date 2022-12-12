exports.unixTime = unixTime;

function unixTime(unixTimeStamp , offset){
 const months=  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date(unixTimeStamp * 1000);
  const utcOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + utcOffset);
  // console.log("UTC " + date);
  date.setSeconds(date.getSeconds() + offset);
  // console.log("offsetUTC " + date);

  let utcDT = {
    time:date.getHours()+":"+date.getMinutes(),
    date:date.getDate()+", "+months[date.getMonth()]
  };

  return utcDT;

}
