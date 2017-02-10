/**
 * Main JavaScript for handling Chromecast interactions.
 */

window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');

  castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState('chromecast-dashboard tv is ready...');
  };

  castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.senderId);
  };

  castReceiverManager.onSenderDisconnected = function(event) {
    console.log('Received Sender Disconnected event: ' + event.senderId);
  };

  window.messageBus =
    window.castReceiverManager.getCastMessageBus(
        'urn:x-cast:com.test.chromecast-dashboard-tv', cast.receiver.CastMessageBus.MessageType.JSON);

  window.messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);

    if (event.data['type'] == 'load') {
      $('#dashboard').attr('src', event.data['url']);
      $('#loading').html("Loading "+event.data['url']);
      if (event.data['refresh'] > 0) {
        $('#dashboard').attr('data-refresh', event.data['refresh'] * 60000);
        setTimeout(reloadDashboard, $('#dashboard').attr('data-refresh'));
      }
      else {
        $('#dashboard').attr('data-refresh', 0);
      }
    }
  }

  // Initialize the CastReceiverManager with an application status message.
  window.castReceiverManager.start({statusText: 'Application is starting'});
  console.log('Receiver Manager started');

  function reloadDashboard() {
    $('#dashboard').attr('src', $('#dashboard').attr('src'));
    $('#loading').html("Loading: "+event.data['url']);
    if ($('#dashboard').attr('data-refresh')) {
      setTimeout(reloadDashboard, $('#dashboard').attr('data-refresh'));
    }
  }

  $('#dashboard').load(function() {
    $('#loading').hide();
    console.log('Loading animation hidden.');
  });
};
