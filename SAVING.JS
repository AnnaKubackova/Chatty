        {
          auth.authenticated ?
            <div className="updateForm">
              <form onSubmit={submitUpdate}>
                <h3>Update your profile</h3>
                <div>
                  <label htmlFor="firstName">First Name: </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder={auth.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />{}
                </div>

                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder={auth.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="imageUploadContainer">
                  <label htmlFor="image"> Profile Picture:</label>
                  <Button onClick={handleClick}>
                    Upload a file
                  </Button>
                  <span>{uploadedImageName}</span>
                  <input type="file"
                    name="image"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{display:'none'}} 
                  />
                </div>

                <div className="updateButton">
                  <button 
                    disabled={ firstName || lastName || uploadedImage ? false : true }
                  >Update</button>
                </div>
                
              </form>

              <div className="bottomProfileMenu">
                <Link to={'#'}
                  className="deleteProfile"
                  onClick={() => {
                    dispatch(deleteUser(auth.uid))
                  }}
                >
                  Delete profile
                </Link>

                <Link to={'#'} onClick={() => {
                  dispatch(logout(auth.uid))
                }}>
                  Log out <img src={icon} />
                </Link>              
              </div>
                  
            </div>
          : 
              null
        }  