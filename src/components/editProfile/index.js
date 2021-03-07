import React from 'react';


<button type="button" onClick={handleOpen}>
  Open Modal
</button>
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
  {body}
</Modal>