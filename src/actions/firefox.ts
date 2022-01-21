const handleAction = async (message, sender): Promise<any> => {
  switch (message.request) {
    // Firefox specific stuff here
    default:
      return false;
  }
};

export default handleAction;
